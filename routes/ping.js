const router =	require ('express').Router ()

router.route ('/')
.all ((req, res) => {
	return res.json ({
		url: req.originalUrl,
		method: req.method,
		body: req.body,
		query: req.query,
		params: req.params,
		headers: req.headers
	})
})

module.exports = router
