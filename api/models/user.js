class User extends Model {
	static init (sequelize, data_type) {
		return super.init ({
			address_components: {
				type:				data_type.JSONB,
				defaultValue:	{
					address: null,
					address_complement: null,
					zipcode: null,
					city: null,
					country: null,
					country_code: null
				}
			},
			company:			data_type.TEXT,
			firstname:			data_type.TEXT,
			lastname:			data_type.TEXT,
			pseudo:				data_type.TEXT,
			phone:				data_type.TEXT,
			mail:				data_type.TEXT
		}, {
			modelName: 'user',
			sequelize,
			scopes: {
				user: {
					where: {
						role: 'user'
					}
				}
			},
			hooks: {
				beforeCreate: async function (user) {
					user.phone = `${user.phone && '+' || ''}${(user.phone || '').replace (/[^0-9]/g, '').replace (/^0/, '33')}` || null
					user.firstname = (user.firstname || '').capitalize () || null
					user.lastname = (user.lastname || '').capitalize () || null
				},
				beforeUpdate: async function (user) {
					user.phone = `${user.phone && '+' || ''}${(user.phone || '').replace (/[^0-9]/g, '').replace (/^0/, '33')}` || null
					user.firstname = (user.firstname || '').capitalize () || null
					user.lastname = (user.lastname || '').capitalize () || null
				}
			}
		})
	}

	static associate (models) { }

	get stringified_address () {
		return `${this.address_components.address || ''}${this.address_components.address && (this.address_components.zipcode || this.address_components.city) && ',' || ''}${this.address_components.zipcode && ` ${this.address_components.zipcode}` || ''}${this.address_components.city && ` ${this.address_components.city}` || ''}` || ''
	}

	get name () {
		return `${this.firstname || ''}${this.firstname && this.lastname && ' ' || ''}${this.lastname || ''}`
	}
}

module.exports = User
