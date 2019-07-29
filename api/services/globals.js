require ('colors')
global.fs =		require ('fs')
global.ms =		require ('ms')
global.moment =	require ('moment')

global.moment.locale ('fr')
global.moment.prototype.beautify = function () {
	return this.format ('dddd DD MMMM, HH:mm:ss')
}


global.jwt =		require (`${process.env.PWD}/api/services/jwt`)
global.slack =		require (`${process.env.PWD}/api/services/slack`)

global.hosts =						require (`${process.env.PWD}/config/hosts`)
global.keys =						require (`${process.env.PWD}/config/keys`)

const { make_request } = require ('async_requests')

global.requests = {
	post: make_request ('post'),
	get: make_request ('get'),
	put: make_request ('put'),
	delete: make_request ('delete'),
	custom: make_request ()
}

global.wrap = fn => (...args) => fn(...args).catch(args[2])
global.transaction_wrap = fn => sequelize.transaction ({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED }, fn)
global.now = date => moment (date).format ('YYYY-MM-DD HH:mm:ss')
global.now_minimal = date => moment (date).format ('YYMMDD_HHmmss_SSS')
global.rand = (length, numbers_only) => [...new Array (length)].map (() => Math.random ().toString (numbers_only && 10 || 36).substr (2, 1)).join ('').toUpperCase ()
global.require_and_reload = path => {
	try {
		delete require.cache[require.resolve (path)]
	} catch (error) { }
	return require (path)
}
global.wait = async (delay) => new Promise (resolve => { setTimeout (() => resolve (), delay * 1000) })
global.stringify_address = ({ address }) => `${address.address}${address.address && (address.zipcode || address.city) && ', ' || ''}${address.zipcode}${address.zipcode && address.city && ' ' || ''}${address.city}`

global.empty_instance = {
	update: () => { }
}

try {
	Object.keys (require (`${process.env.PWD}/config/globals`)).map (key => {
		global[key] = require (`${process.env.PWD}/config/globals`)[key]
	})
} catch (error) { }

Object.defineProperty (Array.prototype, 'random_value', {
	get: function () {
		return this[Math.floor (Math.random () * this.length)]
	}
})
Object.defineProperty (Array.prototype, 'last_element', {
	get: function () {
		return this[this.length - 1]
	}
})
Object.defineProperty (Array.prototype, 'push_', {
	value: function (value_to_push) {
		this.push (value_to_push)
		return this
	}
})
Object.defineProperty (Array.prototype, 'stringified_product_list', {
	get: function () {
		let categories = { }

		this.map (product => {
			if (!categories[product.brand]) {
				categories[product.brand] = { }
			}
			if (!categories[product.brand][product.category]) {
				categories[product.brand][product.category] = 0
			}
			categories[product.brand][product.category] += 1
		})

		let elements = []

		for (let brand of Object.keys (categories)) {
			for (let category of Object.keys (categories[brand])) {
				elements.push (`${categories[brand][category] > 1 && `vos ${categories[brand][category]}` || 'votre'} ${global.real_models_names[brand][category]}`)
			}
		}

		let last_element = elements.pop ()
		return elements.length && `${elements.join (', ')} et ${last_element}` || last_element
	}
})

Object.defineProperty (Object.prototype, 'is_empty', {
	get: function () {
		for (let key in this) {
			if (this.hasOwnProperty (key))
			return false
		}
		return true
	}
})
Object.defineProperty (Object.prototype, 'at_path', {
	value: function (path) {
		return path.split ('.').reduce ((final_object, key) => { return final_object && final_object[key] || undefined }, this)
	}
})
Object.defineProperty (Object.prototype, 'most_recent_attribute', {
	get: function () {
		return this[Object.keys (this).sort ((a, b) => a < b)[0]]
	}
})
Object.defineProperty (Object.prototype, 'is_equal_to', {
	value: function (object) {
		if (Object.keys (this).sort ().join () !== Object.keys (object).sort ().join ()) {
			return false
		}
		for (let key of Object.keys (this)) {
			if (this[key] !== object[key]) {
				return false
			}
		}
		return true
	}
})
Object.defineProperty (Object.prototype, 'stringified_query_parameters', {
	get: function () {
		let result = ''
		for (let key in this) {
			result = `${result}${key}=${this[key]}&`
		}
		return result.replace (/&$/, '')
	}
})
Object.defineProperty (Error.prototype, 'to_string', {
	value: function () {
		let stack_component = this.stack.split ('at ')[1].replace (/\n/g, '')
		let stack_components = {
			filename: stack_component.match (/\((.*\.js)/)[1].replace (process.env.PWD, ''),
			function: stack_component.split (' ')[0].includes (process.env.PWD) && '-' || stack_component.split (' ')[0],
			position: stack_component.match (/:([0-9]*:[0-9]*)/)[1]
		}

		return {
			name: this.name,
			message: this.message,
			file: stack_components.filename,
			function: stack_components.function,
			position: stack_components.line
		}
	}
})

Object.defineProperty (Number.prototype, 'round', {
	value: function (number_of_decimal = 0) {
		return +(`${Math.round (this + `e+${number_of_decimal}`)}e-${number_of_decimal}`)
	}
})

Object.defineProperty (String.prototype, 'decamelized', {
	get: function () {
		return this.replace (/([A-Za-z])([A-Z])/g, '$1_$2').toLowerCase ()
	}
})
Object.defineProperty (String.prototype, 'first_letter_uppercased', {
	get: function () {
		return this.replace(/^\w/, character => character.toUpperCase ())
	}
})

String.prototype.hide_password = function () {
	return this.replace (/("?password"?: ").*(")/g, '$1********$2')
}

String.prototype.capitalize = function () {
	return this.toLowerCase ().replace (/(^|\s)([a-z])/g, (_, previous, character_to_upper) => previous + character_to_upper.toUpperCase ())
}

let loggers = {
	info: console.info,
	error: console.error,
	function_called: console.info
}

for (let type in loggers) {
	console[type] = function () {
		args = Object.keys (arguments).map (id => arguments[id]).map (arg => {
			if (typeof arg === 'object') {
				return `${JSON.stringify (arg, null, 2).hide_password ()}`
			}
			return (arg || '').toString ().replace (/^"|"$/g, '')
		})
		if (type === 'error' && process.env.NODE_ENV === 'production') {
			let args_for_slack = Object.keys (arguments).map (id => arguments[id]).map (arg => {
				if (typeof arg === 'object') {
					return `\`\`\`${JSON.stringify (arg, null, 2)}\`\`\``
				}
				return (arg || '').toString ().replace (/^"|"$/g, '')
			})
			let text = ''
			for (let arg of args_for_slack) {
				text = `${text && `${text}\n\n`}> ${arg}`
			}
			slack.send ({
				channel: 'errors_log',
				username: 'Error',
				icon: '',
				text
			})
		}
		let stack_component = new Error ().stack.split ('at ')[2].replace (/\n/g, '')
		let caller_components = {
			filename: stack_component.match (/\/([0-9a-zA-Z_]*\.js)/)[1].replace (process.env.PWD, ''),
			function: stack_component.split (' ')[0].includes (process.env.PWD) && '-' || stack_component.split (' ')[0],
			line: stack_component.match (/:([0-9]*:[0-9]*)/)[1]
		}

		loggers[type].apply (console, [`[${now_minimal ()}]${['error', 'function_called'].includes (type) && ` [${caller_components.filename}:${caller_components.line.split (':')[0]}][${caller_components.function.replace (/^Object\./, '')}]` || ''}`[{
			info: 'gray',
			error: 'red',
			function_called: 'blue'
		}[type]], ...args])

		if (['error'].includes (type) && arguments[0] && typeof arguments[0] === 'object') {
			arguments[0].logged = true
		}

		return Object.keys (arguments).map (id => arguments[id])[0]
	}
}

if (process.env.DO_NOT_MODIFY_LOGGERS) {
	console.info = loggers.info
	console.error = loggers.error
	if (!process.env.LOG_FUNCTIONS) {
		console.function_called = () => { }
	}
}
