/*---------------------------REQUIREMENTS-------------------------------------*/
require ('colors')
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const express =		require ('express')
const app =				express ()
const server =			require ('http').createServer (app)
const router =			express.Router ()
const settings =		require (`${process.env.PWD}/settings`)
const env =				process.env.NODE_ENV
const bodyParser =	require ('body-parser')
const Logger =			require (`${process.env.PWD}/api/services/logger`)
/*	Initialise un Logger, qui va ecrire dans le fichier ./logs/log.txt */
const loggers =		{
	requests: new Logger ({
		filePath: 'logs/requests.log',
		/*	Indique qu'il faut traiter le parametre comme une requete (log l'utilisateur connecté, la route, etc..) */
		isRequest: true
	}
})
// SEQUELIZE
if (settings.database_enabled) {
	require (`${process.env.PWD}/api/services/sequelize_init`).sequelize
}
/*----------------------------------------------------------------------------*/

/*---------------------------MIDDLEWARES--------------------------------------*/
app.set ('view engine', 'pug')
app.use (bodyParser.urlencoded ({ extended: true }))
app.use (bodyParser.json ())
app.use ('/js',		express.static ('assets/js'))
app.use ('/css',	express.static ('assets/css'))
app.use ('/icons',	express.static ('assets/icons'))
app.use ('/images',	express.static ('assets/images'))
app.use ('*',		(req, res, next) => {
	/*	Sauvegarde l'historique des requêtes */
	logger.log (req)

	return next ()
})
app.use ('/',		router)
app.use ('*',		(req, res) => {
	return res.status (404).end ('404')
})
/*----------------------------------------------------------------------------*/

/*-----------------------SERVICES---------------------------------------------*/
require (`${process.env.PWD}/api/services/prototypes`)
/*----------------------------------------------------------------------------*/

/*-----------------------ROUTE------------------------------------------------*/

/*	Charge les routes `classiques`. */
require (`${process.env.PWD}/routes/index.js`)							(router)
/*----------------------------------------------------------------------------*/

/*-----------------------CONFIG-----------------------------------------------*/
/*----------------------------------------------------------------------------*/

server.listen (settings.port, () => {
	/*	Table de correspondance des couleurs pour indiquer l'environement. */
	const colors = {
		test: 'blue',
		development: 'green',
		production: 'red',
		'42': 'yellow'
	}
	console.log (`Server running on port ${settings.port.toString ().cyan}.`)
	console.log (`Environment: ${env.toString ().toUpperCase ()[colors[env]]}.`)
})
