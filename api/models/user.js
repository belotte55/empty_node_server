module.exports =	(sequelize, dataType) => {
	const User = sequelize.define ('User', {
		firstName:			dataType.TEXT,
		lastName:			dataType.TEXT,
		gender:				dataType.TEXT,
		pseudo:				dataType.TEXT
	})

	return User
}
