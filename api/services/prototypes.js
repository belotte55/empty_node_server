const moment =	require ('moment')
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

/**
* Met le premier caractere d'une chaine en majuscule.
* @method capitalize
* @return {String}
*/
String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1)
}

global.rand = (length, numbers_only) => {
	let key = ''

	for (; key.length < (length || 8);) {
		key += Math.random ().toString (numbers_only && 10 || 36).substr (2, 1)
	}

	return key.toUpperCase ()
}

global.request_post = ({ url, body, headers } = { }) => {
	return new Promise ((resolve, reject) => {
		return request ({
			url,
			method: 'POST',
			json: true,
			headers,
			body
		}, (error, response, body) => {
			if (error) { return reject (error) }
			return resolve (body)
		})
	})
}
global.request_delete = ({ url, body, headers } = { }) => {
	return new Promise ((resolve, reject) => {
		return request ({
			url,
			method: 'DELETE',
			json: true,
			headers,
			body
		}, (error, response, body) => {
			if (error) { return reject (error) }
			return resolve (body)
		})
	})
}
global.request_put = ({ url, body, headers } = { }) => {
	return new Promise ((resolve, reject) => {
		return request ({
			url,
			method: 'PUT',
			json: true,
			headers,
			body
		}, (error, response, body) => {
			if (error) { return reject (error) }
			return resolve (body)
		})
	})
}
global.request_patch = ({ url, body, headers } = { }) => {
	return new Promise ((resolve, reject) => {
		return request ({
			url,
			method: 'PATCH',
			json: true,
			headers,
			body
		}, (error, response, body) => {
			if (error) { return reject (error) }
			return resolve (body)
		})
	})
}
global.request_get = ({ url, headers } = { }) => {
	return new Promise ((resolve, reject) => {
		return request ({
			url,
			method: 'GET',
			json: true,
			headers
		}, (error, response, body) => {
			if (error) { return reject (error) }
			return resolve (body)
		})
	})
}

global.require_and_reload = path => {
	delete require.cache[require.resolve (path)]
	return require (path)
}

global.Errors = require (`${process.env.PWD}/config/errors`)
