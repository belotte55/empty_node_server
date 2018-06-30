const fs =			require ('fs')
const path =		require ('path')
const Sequelize =	require ('sequelize')
const basename =	path.basename (module.filename)
const env =			process.env.NODE_ENV || 'development'
const config =		require (`${process.env.PWD}/config/sequelize`)[env]
const modelsPath =	`${process.env.PWD}/api/models`
const db =			{}
const Op = Sequelize.Op;
let sequelize =		null

config.operatorsAliases = {
	$eq: Op.eq,
	$ne: Op.ne,
	$gte: Op.gte,
	$gt: Op.gt,
	$lte: Op.lte,
	$lt: Op.lt,
	$not: Op.not,
	$in: Op.in,
	$notIn: Op.notIn,
	$is: Op.is,
	$like: Op.like,
	$notLike: Op.notLike,
	$iLike: Op.iLike,
	$notILike: Op.notILike,
	$regexp: Op.regexp,
	$notRegexp: Op.notRegexp,
	$iRegexp: Op.iRegexp,
	$notIRegexp: Op.notIRegexp,
	$between: Op.between,
	$notBetween: Op.notBetween,
	$overlap: Op.overlap,
	$contains: Op.contains,
	$contained: Op.contained,
	$adjacent: Op.adjacent,
	$strictLeft: Op.strictLeft,
	$strictRight: Op.strictRight,
	$noExtendRight: Op.noExtendRight,
	$noExtendLeft: Op.noExtendLeft,
	$and: Op.and,
	$or: Op.or,
	$any: Op.any,
	$all: Op.all,
	$values: Op.values,
	$col: Op.col
}

config.logging = config.logging && (message => {
	if (message.includes ('CREATE')) {
		console.log (message.green)
	} else if (message.includes ('DELETE')) {
		console.log (message.red)
	} else if (message.includes ('UPDATE')) {
		console.log (message.blue)
	} else if (message.includes ('INSERT')) {
		console.log (message.green)
	} else {
		console.log (message.grey)
	}
}) || false

if (config.use_env_variable) {
	sequelize = new Sequelize (process.env[config.use_env_variable])
} else {
	sequelize = new Sequelize (config.database, config.username, config.password, config)
}

fs
	.readdirSync (modelsPath)
	.filter (file => {
		return (file.indexOf ('.') !== 0) && (file !== basename) && (file.slice (-3) === '.js')
	})
	.forEach (file => {
		let model = sequelize.import (path.join (modelsPath, file))
		db[model.name] = model
	})

for (let modelName in db) {
	if (db[modelName].associate) {
		db[modelName].associate (db)
	}
}

sequelize.sync ({
	force: config.force,
	logging: config.logging
})

Sequelize.models = db
global.models = db
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
