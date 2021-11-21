import { chatAtDiscord } from '../commands/relay'
const tmi = require('tmi.js')

export type TwitchChannel = string

const clients = new Map<TwitchChannel, any>()

export default {
    async connect(twitch: TwitchChannel) {
        if (clients.get(twitch)) return

        const client = new tmi.Client({
            channels: [twitch],
        })
        await client.connect()
        client.on(
            'message',
            (
                channel: any,
                tags: { username: any },
                message: string,
                self: any,
            ) => {
                if (self) return
                if (/^\[en\].*/i.test(message.trim())) {
                    chatAtDiscord(twitch, message, tags.username)
                }
            },
        )
        clients.set(twitch, client)
    },
    disconnect(twitch: TwitchChannel) {
        clients.get(twitch).disconnect()
        clients.delete(twitch)
    },
}
