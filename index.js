/*---------------------------REQUIREMENTS-------------------------------------*/
Object.keys (require ('./.env')).map (key => process.env[key.toUpperCase ()] = require ('./.env')[key])
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
/*	Charge les ptototypes et variables globales. */
require (`${process.env.PWD}/api/services/globals`)

const express =			require ('express')
const app =				express ()
const router =			express.Router ()
const server =			require ('http').createServer (app)
const { sequelize } =	require (`${process.env.PWD}/api/services/sequelize`)
const Logger =			require (`${process.env.PWD}/api/services/logger`)
/*	Initialize un Logger, qui va ecrire dans le fichier ./logs/log.txt */
const loggers = {
	request: new Logger ({
		path: 'logs/requests.txt',
		/*	Indique qu'il faut traiter le parametre comme une requete (log l'utilisateur connecté, la route, etc..) */
		is_request: true
	})
}
/*----------------------------------------------------------------------------*/

/*---------------------------MIDDLEWARES--------------------------------------*/
app.set ('view engine', 'pug')
app.use (require ('cors') ({
	origin: ['http://localhost:4000'],
	credentials: true
}))
app.use (require ('helmet') ())
app.use (express.urlencoded ({ limit: '50mb' }))
app.use (express.json ({ limit: '50mb' }))

app.use ('*', (req, res, next) => {
	loggers.request.log (req)

	return next ()
})
app.use ('/js',				express.static ('assets/js'))
app.use ('/css',			express.static ('assets/css'))
app.use ('/icons',			express.static ('assets/icons'))
app.use ('/images',			express.static ('assets/images'))
app.use ('/ressources',		express.static ('assets/ressources'))
app.use ('/.well-known',	express.static( 'assets/.well-known', { dotfiles: 'allow' } ))

app.use ('/ping',						require (`${process.env.PWD}/routes/ping.js`))
app.use ('/tools',						require (`${process.env.PWD}/routes/tools.js`))

app.use (async (error, req, res, next) => {
	error = {
		timestamp: now (),
		error: error.to_string && error.to_string () || error
	}

	let error_instance = req.query.ERROR_ID && await models.error.findOne ({
		where: {
			id: req.query.ERROR_ID
		}
	}) || null

	try {
		if (error && !error.logged && !error.error.logged) {
			console.error (error)
		}
		delete error.logged
		delete error.error.logged
	} catch (error) { }
	return res.status (500).json (error && !error.is_empty && error || {
		error: 'An error occured. Please contact frank@hellozack.fr.'
	})
})

app.use ('*',		(req, res) => {
	return res.status (404).end ('404')
})

server.listen (process.env.PORT, async () => {
	console.info (`Server running on port ${process.env.PORT.toString ().cyan.bold}.`)
	console.info (`Environment: ${process.env.NODE_ENV.toUpperCase ()[{
		test: 'blue',
		development: 'green',
		production: 'red'
	}[process.env.NODE_ENV] || 'blue'].bold}`)

	await wait (1.5)
	process.emit ('server_started')
})

module.exports = app
