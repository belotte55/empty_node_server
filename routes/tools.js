const router =	require ('express').Router ()

router.route ('/functions/:name/:type?')
.all (wrap (async (req, res) => {
	let f = require_and_reload (`${process.env.PWD}/api/services/tools_functions`)[req.params.name]

	if (!f || typeof f !== 'function') {
		return res.status (404).json ({ error: `${req.params.name} is not a function` })
	}

	console.info (`[function][${req.params.name}] running.`)

	let result = await f (req.method === 'POST' && req.body || req.query)

	console.info (`[function][${req.params.name}] done.`)

	return res[{
		json: 'json',
		text: 'end'
	}[req.params.type || 'json']] (result)
}))

module.exports = router
