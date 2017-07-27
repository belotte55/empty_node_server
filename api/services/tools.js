const moment =		require ('moment')
const fs =			require ('fs-extra')

module.exports = {
	durations: {
		second:		1,
		minute:		60,
		hour:		3600,
		day:		24 * 3600,
		week:		7 * 24 * 3600,
		month:		30 * 24 * 3600,
	},

	rand: (length) => {
		let key = ''

		for (; key.length < (length || 8);) {
			key += Math.random ().toString (36).substr (2, 1)
		}

		return key.toUpperCase ()
	}
}
