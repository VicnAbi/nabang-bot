import CONFIG from '../config'
import { chatAtDiscord } from '../commands/relay'
const tmi = require('tmi.js')

const client = new tmi.Client({
    channels: [CONFIG.TWITCH.CHANNEL],
})

client.on(
    'message',
    (channel: any, tags: { username: any }, message: string, self: any) => {
        if (self) return
        if (/^\[en\].*/i.test(message.trim())) {
            chatAtDiscord(message, tags.username)
        }
    },
)

export default {
    async connect() {
        await client.connect()
        console.log('twitch connected')
    },
}
