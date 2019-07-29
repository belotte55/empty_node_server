const Sequelize =	require ('sequelize')
const config =		require (`${process.env.PWD}/config/sequelize`)
const db =			{}
global.Model =		Sequelize.Model
global.Op =			Sequelize.Op

Sequelize.DataTypes.postgres.DECIMAL.parse = parseFloat

config.logging = config.logging && (message => {
	if (message.includes ('CREATE')) {
		console.info (message.green)
	} else if (message.includes ('DELETE')) {
		console.info (message.red)
	} else if (message.includes ('UPDATE')) {
		console.info (message.blue)
	} else if (message.includes ('INSERT')) {
		console.info (message.green)
	} else {
		console.info (message.grey)
	}
}) || false

const namespace = require ('cls-hooked').createNamespace ('transaction_namespace')
Sequelize.useCLS (namespace)
const sequelize = new Sequelize (config.database, config.username, config.password, {
	...config,
	define: {
		underscored: true,
		paranoid: true,
		deletedAt: 'deleted_at',
		updatedAt: 'updated_at',
		createdAt: 'created_at',
		...(config.define || { }),
		hooks: {
			beforeCreate: async function (instance, { transaction }) { },
			afterCreate: async function (instance, { transaction }) { },
			beforeUpdate: async function (instance, { transaction }) { },
			afterUpdate: async function (instance, { transaction }) { }
		}
	}
})

global.data_type = Sequelize
global.Sequelize = Sequelize
global.sequelize = sequelize

fs.readdirSync (`${process.env.PWD}/api/models`).filter (file => /^[a-z_]*.js/.test (file) ).map (file => {
	db[file.replace (/\.js$/, '')] = require (`${process.env.PWD}/api/models/${file}`).init (sequelize, Sequelize)
})

for (let model_name of Object.keys (db).filter (model_name => db[model_name].associate)) {
	db[model_name].associate (db)

	Object.keys (db[model_name].prototype).map (key => {
		if (typeof db[model_name].prototype[key] === 'function') {
			db[model_name].prototype[key.decamelized] = db[model_name].prototype[key]
		}
	})
}

try {
	sequelize.sync ({
		force: config.force,
		logging: config.logging
	}).catch (error => {
		console.error (error)
	})
} catch (error) {
	console.error (error)
}

Model.prototype.add_remark = async function (remark, { transaction } = { }) {
	await this.update ({
		remark: `${remark}${this.remark && `\n${this.remark}` || ''}`
	}, { transaction })
}

Sequelize.models = db
db.sequelize = sequelize
db.Sequelize = Sequelize
global.models = db

module.exports = db
