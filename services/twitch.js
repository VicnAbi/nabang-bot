const CONFIG = require('../config')
const tmi = require('tmi.js')
const { chatAtDiscord } = require('../commands/relay')

const client = new tmi.Client({
    channels: [CONFIG.TWITCH.CHANNEL],
})
client.on('message', (channel, tags, message, self) => {
    if (self) return
    if (/^\[en\].*/i.test(message.trim())) {
        chatAtDiscord(message, tags.username)
    }
})

module.exports = {
    async connect() {
        await client.connect()
        console.log('twitch connected')
    },
}
