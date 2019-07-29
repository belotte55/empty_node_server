const router =	require ('express').Router ()

router.route ('/')
.get (async (req, res) => {
	return res.render ('index', {
		title: 'Hello'
	})
})
