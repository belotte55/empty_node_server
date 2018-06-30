module.exports = router => {
	router.route ('/')
	.get (async (req, res) => {
		return res.render ('index', {
			title: 'Hello'
		})
	})

	router.route ('/function/:name')
	.get (async (req, res) => {
		let path = `${process.env.PWD}/api/services/functions`
		delete require.cache[require.resolve (path)]
		let f = require (path)[req.params.name]

		return res.json (await f ())
	})
}
