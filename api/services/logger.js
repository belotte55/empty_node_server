/** @module Logger */

const moment =	require ('moment')
const fs =		require ('fs')
const path =	require ('path')

/**
* Initialise le logger
* @constructor
* @param {Object}		options
* @param {String}		options.filePath	- Chemin du fichier de logs, a partir de la racine du projet
* @param {Function}	callback
* @param {String}		callback.error		- Message qui indique l'erreur
*/
module.exports = function (options = { }, callback = () => { }) {
	if (!options.filePath) { return callback (`You must define options.filePath`) }

	this.filePath = options.filePath
	this.isRequest = options.isRequest

	fs.mkdir (`${process.env.PWD}/${path.dirname (options.filePath)}`, 0o755, error => {
		if (error && error.code != 'EEXIST') { return callback (error) }

		if (!error || !this.logger) {
			this.logger = fs.createWriteStream (`${process.env.PWD}/${options.filePath}`, { flags: 'a' })
		}
		return callback ()
	})
}

/**
* Ecrit un message dans le fichier de log
* @method log
* @param {Object | String}		message		- Message/data a log
*/
module.exports.prototype.log = function (message) {
	if (this.isRequest) {
		this.logger.write (`[ ${moment ().format (`YYYY-MM-DD H:mm:ss'SSS`)} ] [ ${message.ip} ] -> ${message.originalUrl} ${JSON.stringify (message.body || message.query || {})}\n`)
	} else {
		if (typeof message === 'object') {
			this.logger.write (`[ ${moment ().format (`YYYY-MM-DD H:mm:ss'SSS`)} ] ${JSON.stringify (message, null, '\t')}\n`)
		} else {
			this.logger.write (`[ ${moment ().format (`YYYY-MM-DD H:mm:ss'SSS`)} ] ${message.toString ()}\n`)
		}
	}
}
