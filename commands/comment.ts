import axios from 'axios'
import { CommandInteraction } from 'discord.js'

const maxTryCount = 60
const interval = 60 * 1000
const youtubeIdRegex = /youtu(?:.*\/v\/|.*v=|\.be\/)([A-Za-z0-9_-]{11})/

export const observeServices = new Map()

/**
 * clear user's observe service
 */
async function clear(interaction: CommandInteraction, text: string) {
    const { channel } = interaction
    if (!channel) return

    const userId = interaction.user.id
    clearInterval(observeServices.get(userId))
    if (observeServices.delete(userId)) {
        await channel.send(text)
    }
}

/**
 * recursive check function
 */
async function check(
    interaction: CommandInteraction,
    url: string,
    beforeStatus?: boolean,
    count: number = 0,
) {
    const { data } = await axios(url)
    const isOpen = data.includes('comments-section')
    const userId = interaction.user.id
    const { channel } = interaction
    if (!channel) return

    // changed status alarm
    if (beforeStatus !== isOpen) {
        count = 0
        const status = isOpen ? '🟢 Comments are OK' : '🚫 Comments are locked'
        try {
            await channel.send(`<@${userId}> ${status}`)
        } catch (e) {
            console.error(e)
        }
    }
    // next
    if (count < maxTryCount) {
        observeServices.set(
            userId,
            setTimeout(
                () => check(interaction, url, isOpen, ++count),
                interval,
            ),
        )
    } else {
        clear(
            interaction,
            `<@${userId}> No issues detected for an hour. Terminating service.`,
        )
    }
}

module.exports = {
    async run(interaction: CommandInteraction) {
        const { options } = interaction
        const url = options.getString('url')
        const userId = interaction.user.id

        // clear
        clear(
            interaction,
            `<@${userId}> Observation service has been terminated.`,
        )

        if (!url) {
            await interaction.reply('Please write url to restart')
            return
        }
        const matched = url.match(youtubeIdRegex)
        if (!matched) {
            // invalid
            await interaction.reply('Invalid youtube url')
            return
        }
        const newUrl = `https://m.youtube.com/watch?v=${matched[1]}`
        try {
            await interaction.reply(`Start observation of ${url}`)
            check(interaction, newUrl)
        } catch (e) {
            await interaction.reply('Request error')
        }
    },
}
