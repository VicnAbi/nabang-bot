import { CommandInteraction, TextBasedChannels } from 'discord.js'

export const relayingTlChannels = new Set<TextBasedChannels>()

export async function chatAtDiscord(message: string, username: string) {
    relayingTlChannels.forEach((channel) => {
        channel.send({
            content: `:speech_balloon:||${username}:|| \`${message}\``,
        })
    })
}

export default {
    async run(interaction: CommandInteraction) {
        const { options, channel } = interaction
        if (!channel) return

        const sw = options.getString('switch')
        if (sw) {
            // stop
            relayingTlChannels.delete(channel)
            await interaction.reply('tl relay has stopped')
        } else {
            // start
            relayingTlChannels.add(channel)
            await interaction.reply('start tl relay')
        }
    },
}
