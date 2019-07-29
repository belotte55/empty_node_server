module.exports = {
	...{
		test: {
			username: 'user',
			password: 'pass',
			database: 'api',
			host: 'localhost',
			port: 5555,
			dialect: 'postgres',
			dialectOptions: { decimalNumbers: true },
			logging: false,
			force: true,
			define: { }
		},
		production: {
			username: 'zack',
			password: 'zack_',
			database: 'prod',
			host: 'localhost',
			dialect: 'postgres',
			dialectOptions: { decimalNumbers: true },
			logging: false,
			force: false,
			define: { }
		}
	}[process.env.NODE_ENV] || {
		username: 'user',
		password: 'pass',
		database: 'api',
		host: 'localhost',
		port: 5555,
		dialect: 'postgres',
		dialectOptions: { decimalNumbers: true },
		logging: false,
		force: process.env.FORCE_DB || false,
		define: { }
	}
}
