const jwt =			require ('jsonwebtoken')
const private_key =	fs.readFileSync (`${process.env.HOME}/.ssh/jwtRS256.key`).toString ()
const public_key =	fs.readFileSync (`${process.env.HOME}/.ssh/jwtRS256.key.pub`).toString ()

const create = function ({ payload, secret, lifetime } = { }) {
	const token = jwt.sign (payload, secret ||  private_key, {
		...(secret && { } || { algorithm: 'RS256' }),
		expiresIn: lifetime || null })
	return token
}

const verify = function (token, key) {
	return jwt.verify (token, key || public_key, (error, payload) => {
		if (error) { return null }
		return payload
	})
}

const decode = jwt.decode
const sign = jwt.sign

module.exports = {
	create,
	verify,
	decode,
	sign
}
