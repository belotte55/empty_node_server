const moment =	require ('moment')
const loggers =	{
	log: console.log,
	error: console.error
}

for (let type of ['log', 'error']) {
	console[type] = function () {
		let callerName

		try { callerName = arguments.callee.caller.name }
		catch (error) { caller = '' }

		args = Array.prototype.slice.call (arguments)
		args.unshift (`[${getDate ()}]${callerName && ` [${callerName}]` || ''}`)
		loggers[type].apply (console, args)
	}
}

/**
* Met le premier caractere d'une chaine en majuscule.
* @method capitalize
* @return {String}
*/
String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1)
}

/**
* Renvoie <b>date</b> ou la date actuelle, au format YYYY-MM-DD H:mm:ss.
* @method getDate
* @param {Date} [date] Date a parser
* @return {String} <b>YYYY-MM-DD H:mm:ss</b>
*/
global.getDate = date => moment (date).format ('YYYY-MM-DD H:mm:ss')
