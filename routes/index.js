module.exports = router => {
	router.route ('/')
	.get ((req, res) => {
		return res.render ('index', {
			title: 'Hello'
		})
	})
}
