import { CommandInteraction, TextBasedChannels } from 'discord.js'
import twitchService, { TwitchChannel } from '../services/twitch'

export const relayingTlChannels = new Map<TextBasedChannels, string>()

export async function chatAtDiscord(
    twitch: TwitchChannel,
    message: string,
    username: string,
) {
    relayingTlChannels.forEach((target, channel) => {
        if (twitch === target)
            channel.send({
                content: `:speech_balloon:||${username}:|| \`${message}\``,
            })
    })
}

export async function connect(
    channel: TextBasedChannels,
    target: TwitchChannel,
) {
    relayingTlChannels.delete(channel)
    await twitchService.connect(target)
    relayingTlChannels.set(channel, target)
}

export default {
    async run(interaction: CommandInteraction) {
        const { options, channel } = interaction
        if (!channel) return

        let target = options.getString('target')
        if (target === 'stop') {
            // stop
            relayingTlChannels.delete(channel)
            await interaction.reply('tl relay has stopped')
            return
        }
        if (!target) {
            target = 'nabinya'
        }

        // start
        try {
            await connect(channel, target)
            await interaction.reply(
                `tl relay start from https://www.twitch.tv/${target}`,
            )
        } catch (e) {
            console.error(e)
            await interaction.reply(`connect fail`)
        }
    },
}
