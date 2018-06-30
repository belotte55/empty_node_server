module.exports =	(sequelize, DataType) => {
	const user = sequelize.define ('user', {
		first_name:			DataType.TEXT,
		last_name:			DataType.TEXT
	})

	user.prototype.get_full_name = function ({ } = { }) {
		return `${first_name || ''} ${first_name && ` ${last_name}` || last_name || ''}`
	}

	return user
}
