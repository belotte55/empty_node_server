module.exports = router => {
	router.route ('/')
	.get ((req, res) => {
		return res.end ('Success')
	})
}
