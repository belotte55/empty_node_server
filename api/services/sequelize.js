const fs =			require ('fs')
const Sequelize =	require ('sequelize')
const env =			process.env.NODE_ENV || 'development'
const config =		require (`${process.env.PWD}/config/sequelize`)[env]
const models =		{}
let sequelize =		null

module.exports =	{
	init: () => {
		if (config.alter) {
			console.error (`config.alter doesn't works for now, so is it ignored.`)
			config.alter = false
		}
		sequelize = new Sequelize (config.database, config.user, config.pass, config)

		fs.readdirSync (`${process.env.PWD}/api/models`).forEach (file => {
			if (file.indexOf ('.') !== 0 && /\.js$/.test (file)) {
				const model = sequelize.import (`${process.env.PWD}/api/models/${file}`)
				models[model.name] = model
			}
		})

		Object.keys (models).forEach (model => {
			if (models[model].associate) { models[model].associate (models) }
		})

		sequelize.sync ({ force: config.force || false, alter: config.alter })

		models.sequelize = sequelize
		models.Sequelize = Sequelize

		return module.exports
	},

	Sequelize,
	sequelize,
	models
}
