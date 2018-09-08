const jwt =				require ('jsonwebtoken')
const moment =			require ('moment')
const fs =				require ('fs')
const private_key =		fs.readFileSync (`${process.env.HOME}/.ssh/jwtRS256.key`).toString ()
const public_key =		fs.readFileSync (`${process.env.HOME}/.ssh/jwtRS256.key.pub`).toString ()
let token_secrets =		require (`${process.env.PWD}/config/token_secrets`)
let token_parameters =	require (`${process.env.PWD}/config/token_parameters`)[process.env.NODE_ENV]

let create = function ({ payload, no_expiration_label, secret, lifetime } = { }) {
	if (no_expiration_label) {
		payload.no_expiration_label = no_expiration_label
		payload.no_expiration_key = rand (64)
		token_secrets[no_expiration_label] = {
			label: no_expiration_label,
			key: payload.no_expiration_key,
			created_at: moment ().format ('LLL')
		}
		fs.writeFileSync (`${process.env.PWD}/config/token_secrets.json`, JSON.stringify (token_secrets, null, '\t'))
	}
	let token = jwt.sign (payload, payload.no_expiration_key || secret ||  private_key, {
		...((payload.no_expiration_key || secret) && { } || { algorithm: 'RS256' }),
		expiresIn: lifetime || (!no_expiration_label && token_parameters.token.lifetime) || null })
	return token
}

let verify = function (token, key) {
	return jwt.verify (token, key || public_key, (error, payload) => {
		if (error) {
			return null
		}
		if (payload.no_expiration_key && payload.no_expiration_key !== token_secrets[payload.no_expiration_label].key) {
			return null
		}
		return payload
	})
}

let decode = jwt.decode

module.exports = {
	create,
	verify,
	decode
}

setInterval (() => {
	token_secrets = require_and_reload (`${process.env.PWD}/config/token_secrets`)
}, 1000 * 60 * 5)
