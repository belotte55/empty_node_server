module.exports = async ({ code, slack_enabled = true, data }) => {
	let error = Object.assign ({}, Errors[code])
	error.code = code

	if (!error) {
		await slack.send ({
			channel: 'errors',
			username: 'Error',
			icon: ':bangbang:',
			text: `The error [${code}] is not configured !`
		})
		return false
	}

	if (slack_enabled) {
		await slack.send ({
			channel: error.channel || 'errors',
			username: `${error.username || 'Error'} - Code ${code}`,
			icon: process.env.NODE_ENV === 'production' && (error.icon || ':face_with_head_bandage:') || ':bug:',
			text: `${error.error || 'There is no description for this error'}${data && typeof data === 'object' && `\n> \`\`\`${JSON.stringify (data, null, '\t')}\`\`\`` || `\n${data.toString ().split ('\n').map (line => `> ${line}`).join ('\n')}` || ''}`
		})
	}

	console.error ({
		code,
		error: error.error
	})

	return {
		code,
		error: error.error
	}
}
