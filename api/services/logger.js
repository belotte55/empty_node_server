module.exports = function ({ path, is_request, log_to }) {
	if (!path) { throw (`You must define path`) }

	this.path = `${process.env.PWD}/${path}`.replace (/\/\//g, '/').replace (/\.[a-z]*$/, '.json')
	this.is_request = is_request
	this.log_to = log_to || 'logger'

	try {
		fs.mkdirSync (`${this.path.includes ('.') && (this.path.match (/(.*)\/(.*)$/) || [ ])[1] || this.path}`, 0o755)
	} catch (error) { if (!['EEXIST'].includes (error.code)) { throw (error) } }
}

const get_ip = req => req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || ''

const logger = function () {
	return function (message) {
		if (typeof message !== 'object') {
			throw 'Logger only works with objects'
		}
		if (this.is_request) {
			const payload = jwt.decode ((message.params || { }).token || (message.body || { }).token || (message.query || { }).token || (message.headers || { })['x-access-token'] || ((message.headers || { })['authorization'] || '').replace ('Bearer ', '')) || { }
			message = {
				body: message.body && message.body.attributes && {
					ids: message.body.data && message.body.data.attributes && message.body.data.attributes.ids,
					values: message.body && message.body.data && message.body.data.attributes && message.body.data.attributes.values,
					collection: message.body && message.body.data && message.body.data.attributes && message.body.data.attributes.collection_name
				} || message.body || { },
				query: message.query,
				params: message.params,
				ip: get_ip (message),
				user: message.user && message.user.firstname || '-',
				method: (message.method || '-').toUpperCase (),
				route: message.originalUrl,
				date: moment ().format (`YYYY-MM-DD H:mm:ss'SSS`),
				headers: message.headers,
				pretty: `[ ${moment ().format (`YYYY-MM-DD H:mm:ss'SSS`)} ] [ ${get_ip (message)} ] [ ${message.user && message.user.data.firstname || message.forest_user || payload.user_id || (payload.identifier && `#${payload.identifier}` || null) || '-'} ] -> [ ${(message.method || '').toUpperCase ()} ] ${message.originalUrl}`
			}
		} else {
			message.timestamp = moment ().format (`YYYY-MM-DD H:mm:ss'SSS`)
		}

		let array = [ ]

		try {
			array = require (this.path)
		} catch (error) { }

		array.push (message)
		fs.writeFileSync (this.path, JSON.stringify (array, null, '\t'), 'utf-8')

		return array
	}
}

module.exports.prototype.log = function (message) { logger ('log').bind (this) (message) }
module.exports.prototype.error = function (message) { logger ('log').bind (this) (message) }
