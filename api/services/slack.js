const fs =						require ('fs')
const request =				require ('request')
const keys =					require (`${process.env.PWD}/config/keys`)
const channels =				require (`${process.env.PWD}/config/slack`).channels
const default_workspace =	''

const send = ({ workspace, channel, text, username, icon }) => {
	return new Promise ((resolve, reject) => {
		let channel_url = channels[workspace || default_workspace][channel]

		if (!channel_url) {
			console.error (`Channel *${channel}* of workspace *${workspace || default_workspace}* doesn't exists.`)
		}

		return request.post ({
			url: channel_url,
			body: JSON.stringify ({
				text,
				link_names: 1,
				username,
				icon_emoji: icon || undefined
			}),
		}, (error, response, body) => {
			if (error || response.statusCode !== 200) {
				return reject (error || `[slack.send] ${response.statusCode}`)
			}
			return resolve ()
		})
	})
}

const upload = (options = { }, callback = () => { }) => {
	return new Promise ((resolve, reject) => {
		if (!fs.existsSync (options.file)) {
			callback (`File ${options.file} doesn't exists`)
			return resolve ([`File ${options.file} doesn't exists`])
		}

		request.post ({
			url: `https://slack.com/api/files.upload`,
			formData: {
				token: keys.slack.tokens[options.slack],
				file: fs.createReadStream (options.file),
				filename: options.filename,
				title: options.title,
				type: options.type,
				username: options.username || 'Devis',
				channels: [keys.slack.channels[options.channel]]
			}
		}, (error, response, body) => {
			if (error || response.statusCode !== 200) {
				callback (error || `[slack.send] ${response.statusCode}`)
				return resolve ([error || `[slack.send] ${response.statusCode}`])
			}
			callback ()
			return resolve ([])
		})
	})
}

module.exports =	{
	send,
	upload
}
