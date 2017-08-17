/** @module Logger */

/*
	Usage:
	const logger = new require ('./logger') ({
		filePath: './logs/requests.log', // the directory is automatically created
		isRequest: true, // log the route and the ip source
		logTo: 'both' // logger, console, both
	});

	logger.log (req);
*/

require ('colors')
const moment =	require ('moment')
const fs =		require ('fs')
const path =	require ('path')

/**
* Initialise le logger
* @constructor
* @param {Object}		options
* @param {String}		options.filePath	- Chemin du fichier de logs, a partir de la racine du projet
* @param {Boolean}		options.isRequest	- Log l'IP, l'utilisateur connecté et le path demandé
* @param {String}		options.logTo		- console, logger, both -> indique quels logs activer
* @param {Function}		callback
* @param {String}		callback.error		- Message qui indique l'erreur
*/
module.exports = function (options = { }, callback = () => { }) {
	if (!options.filePath) { return callback (`You must define options.filePath`) }

	this.filePath = options.filePath
	this.isRequest = options.isRequest
	this.logTo = options.logTo || 'logger'

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
		message = `[ ${moment ().format (`YYYY-MM-DD H:mm:ss'SSS`)} ] [ ${message.ip} ] [ ${message.user && message.user.pseudo || '-'} ] -> [ ${(message.method || '').toUpperCase ()} ] ${message.originalUrl} ${message.body && JSON.stringify (message.body, null, 2) || ''}`
	} else {
		if (typeof message === 'object') {
			message = `[ ${moment ().format (`YYYY-MM-DD H:mm:ss'SSS`)} ] ${JSON.stringify (message, null, '\t')}`
		} else {
			message = `[ ${moment ().format (`YYYY-MM-DD H:mm:ss'SSS`)} ] ${message.toString ()}`
		}
	}

	if (!this.logTo || this.logTo === 'both' || this.logTo === 'logger') {
		this.logger.write (message + '\n')
	}
	if (this.logTo === 'both' || this.logTo === 'console') {
		console.log (message)
	}
}

module.exports.prototype.error = function (message) {
	if (this.isRequest) {
		message = `[ ${moment ().format (`YYYY-MM-DD H:mm:ss'SSS`)} ] [${'ERROR'.red}] [ ${message.ip} ] [ ${message.user && message.user.pseudo || '-'} ] -> [ ${(message.method || '').toUpperCase ()} ] ${message.originalUrl} ${message.body && JSON.stringify (message.body, null, 2) || ''}`
	} else {
		if (typeof message === 'object') {
			message = `[ ${moment ().format (`YYYY-MM-DD H:mm:ss'SSS`)} ] [${'ERROR'.red}] ${JSON.stringify (message, null, '\t')}`
		} else {
			message = `[ ${moment ().format (`YYYY-MM-DD H:mm:ss'SSS`)} ] [${'ERROR'.red}] ${message.toString ()}`
		}
	}

	if (!this.logTo || this.logTo === 'both' || this.logTo === 'logger') {
		this.logger.write (message + '\n')
	}
	if (this.logTo === 'both' || this.logTo === 'console') {
		console.error (message)
	}
}
