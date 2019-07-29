class Error extends Model {
	static init (sequelize, data_type) {
		return super.init ({
			route:				data_type.TEXT,
			method: {
				type:				data_type.ENUM,
				values:			['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
			},
			errors: {
				type:				data_type.JSON,
				defaultValue:	[ ]
			},
			body: {
				type:				data_type.JSON,
				defaultValue:	{ }
			},
			headers: {
				type:				data_type.JSON,
				defaultValue:	{ }
			},
			parameters: {
				type:				data_type.JSON,
				defaultValue:	{
					query: { },
					params: { }
				}
			},
			status: {
				type:			data_type.ENUM,
				values:			['error', 'pending', 'done'],
				defaultValue:	'error'
			},
			retries: {
				type:			data_type.INTEGER,
				defaultValue:	0
			}
		}, {
			modelName: 'error',
			sequelize,
			hooks: { }
		})
	}

	static associate (models) { }
}

Error.prototype.retry = async function ({ } = { }) {
	console.function_called ()

	if (!['error'].includes (this.status)) {
		throw 'This action can be runned on `error` Errors only'
	}

	await this.update ({
		status: 'pending'
	})

	let { body, error, status_code } = await requests[this.method.toLowerCase ()] ({
		url: `http://localhost:${process.env.PORT}${this.route}${this.route.includes ('?') && '&' || '?'}ERROR_ID=${this.id}`,
		body: this.body,
		headers: this.headers
	})

	await this.update ({
		retries: this.retries + 1,
		status: (error || status_code === 500 || body.error) && 'error' || 'done'
	})
}

module.exports = Error
