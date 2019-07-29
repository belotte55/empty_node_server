const endpoint = 'https://slack.com/api'
const { auth_token } = require (`${process.env.PWD}/config/slack`)
const headers = {
	authorization: `Bearer ${auth_token}`,
	'Content-Type': 'application/json; charset=utf-8'
}

const action_types = {
	BUTTON: 'button'
}

const button_styles = {
	DEFAULT: 'default',
	PRIMARY: 'primary',
	DANGER: 'danger'
}

module.exports = { }
module.exports.conversations = { }
module.exports.chat = { }

module.exports.conversations.list = async ({ } = { }) => {
	let { body } = await requests.get ({
		url: `${endpoint}/conversations.list?token=${auth_token}`
	})

	if (!body.ok) {
		return console.error ({
			code: 801,
			error: body
		})
	}

	return body.channels
}

module.exports.conversations.history = async ({ channel_id } = { }) => {
	if (!channel_id) { throw 'channel_id is required.' }

	let { body } = await requests.get ({
		url: `${endpoint}/conversations.history?token=${auth_token}&channel=${channel_id}`
	})

	if (!body.ok) {
		return console.error ({
			code: 801,
			error: body
		})
	}

	return body.messages
}

module.exports.conversations.get_channel_id_from_name = async ({ name } = { }) => {
	let channels = await module.exports.conversations.list ()

	if (channels.length === undefined) {
		return console.error ({
			code: 801,
			error: body
		})
	}

	for (let channel of channels) {
		if (channel.name === name) { return channel.id }
	}

	return null
}

module.exports.conversations.get_message = async ({ channel_id, ts } = { }) => {
	let { body } = await requests.get ({
		url: `${endpoint}/conversations.history?token=${auth_token}&channel=${channel_id}&latest=${ts}&limit=1&inclusive=true`
	})

	if (!body.ok) {
		return console.error ({
			code: 801,
			error: body
		})
	}

	return body.messages[0]
}

module.exports.conversations.get_replies = async ({ channel_id, ts } = { }) => {
	let { body } = await requests.get ({
		url: `${endpoint}/conversations.replies?token=${auth_token}&channel=${channel_id}&ts=${ts}`
	})

	return body.messages
}

module.exports.chat.post = async function ({ channel_id, channel, user, text, icon, username = 'ZackBot', blocks } = { }) {
	if (user) {
		channel_id = users[user].slack_id
	}
	if (channel && !channel_id) {
		channel_id = await module.exports.conversations.get_channel_id_from_name ({ name: channel })
	}

	let { body } = await requests.post ({
		url: `${endpoint}/chat.postMessage`,
		headers,
		body: {
			channel: channel_id,
			icon_emoji: icon,
			username,
			as_user: false,
			text,
			mrkdwn: true,
			blocks: (blocks || []).length && [...blocks, {
				type: 'context',
				elements: [{
					type: 'mrkdwn',
					text: `For more info, contact @frank.`
				}]
			}] || []
		}
	})

	if (!body.ok) {
		return console.error ({
			code: 801,
			error: body
		})
	}

	return body
}

module.exports.chat.update = async function ({ channel_id, channel, user, text, icon, username = 'ZackBot', ts, blocks } = { }) {
	if (user) {
		channel_id = users[user].slack_id
	}
	if (channel && !channel_id) {
		channel_id = await module.exports.conversations.get_channel_id_from_name ({ name: channel })
	}

	let { body } = await requests.post ({
		url: `${endpoint}/chat.postMessage`,
		headers,
		body: {
			channel: channel_id,
			icon_emoji: icon,
			username,
			as_user: false,
			text,
			ts,
			mrkdwn: true,
			blocks
		}
	})

	if (!body.ok) {
		return console.error ({
			code: 801,
			error: body
		})
	}

	return body
}

module.exports.chat.delete = async ({ channel_id, ts } = { }) => {
	let { body } = await requests.post ({
		url: `${endpoint}/chat.delete`,
		headers,
		body: {
			channel: channel_id,
			ts
		}
	})

	if (!body.ok) {
		return console.error ({
			code: 801,
			error: body
		})
	}

	return true
}

module.exports.chat.respond = async ({ channel_id, user, username, icon, ts, text, broadcast, as_user = false } = { }) => {
	if (user) {
		channel_id = users[user].slack_id
	}
	let color = null
	let { body } = await requests.post ({
		url: `${endpoint}/chat.postMessage`,
		headers,
		body: {
			channel: channel_id,
			text,
			thread_ts: ts,
			username,
			icon_emoji: icon,
			reply_broadcast: !!broadcast,
			mrkdwn: true
		}
	})

	if (!body.ok) {
		return console.error ({
			code: 801,
			error: body
		})
	}

	return body.message
}

module.exports.reactions = { }

module.exports.reactions.add = async function ({ channel_id, channel, user, emoji, ts } = { }) {
	if (user) {
		channel_id = users[user].slack_id
	}
	if (channel && !channel_id) {
		channel_id = await module.exports.conversations.get_channel_id_from_name ({ name: channel })
	}

	let { body } = await requests.post ({
		url: `${endpoint}/reactions.add`,
		headers,
		body: {
			channel: channel_id,
			name: emoji,
			timestamp: ts,
			ts
		}
	})

	if (!body.ok) {
		return console.error ({
			code: 801,
			error: body
		})
	}

	return body
}

module.exports.post = module.exports.chat.post
