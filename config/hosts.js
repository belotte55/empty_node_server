module.exports = {
	test: {
		local: `http://localhost:${process.env.PORT}`
	},
	production: {
		local: 'http://frank42.fr'
	}
}[process.env.NODE_ENV] || {
	local: `http://localhost:${process.env.PORT}`
}
