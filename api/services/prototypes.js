require ('colors')
const moment =	require ('moment')
const request =	require ('request')
const loggers =	{
	log: console.log,
	error: console.error
}

global.get_date = date => moment (date).format ('YYYY-MM-DD H:mm:ss')

for (let type of ['log', 'error']) {
	console[type] = function () {
		args = Array.prototype.slice.call (arguments)
		args.unshift (`[${get_date ()}]`)
		if (process.env.NODE_ENV === 'test') {
			args = args.map (arg => {
				if (typeof arg === 'object') {
					return JSON.stringify (arg, null, 2).gray
				}
				return (arg || '').toString ().gray
			})
		}
		loggers[type].apply (console, args)
	}
	for (let color of ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'grey']) {
		if (!console[color]) {
			console[color] = { }
		}
		console[color][type] = function () {
			args = Array.prototype.slice.call (arguments).map (arg => {
				if (typeof arg === 'object') {
					return JSON.stringify (arg, null, 2)[color].bold
				}
				return (arg || '').toString ()[color].bold
			})
			args.unshift (`[${get_date ()}]`)
			loggers[type].apply (console, args)
		}
	}
}

String.prototype.capitalize = function () {
	return this.toLowerCase ().replace(/(^|\s)([a-z])/g, (m,p1,p2) => p1 + p2.toUpperCase())
}

String.prototype.insert = function (index, string) {
	return `${this.substr (0, index)}${string}${this.substr (index)}`
}

global.get_random_value_from_array = (array) => {
	return array[Math.floor (Math.random () * array.length)]
}
global.Errors = require (`${process.env.PWD}/config/errors`)
global.rand = (length, numbers_only) => {
	let key = ''

	for (; key.length < (length || 8);) {
		key += Math.random ().toString (numbers_only && 10 || 36).substr (2, 1)
	}

	return key.toUpperCase ()
}

require (`${process.env.PWD}/api/services/request`).load_to_global ()

global.require_and_reload = path => {
	delete require.cache[require.resolve (path)]
	return require (path)
}

global.moment = require ('moment')
global.moment.locale ('fr')
global.slack = require (`${process.env.PWD}/api/services/slack`)
global.log_error = require (`${process.env.PWD}/api/services/errors`)
global.thrower = error => { throw error }
