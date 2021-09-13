const axios = require('axios')

const maxTryCount = 60
const interval = 60 * 1000
const youtubeIdRegex = /youtu(?:.*\/v\/|.*v=|\.be\/)([A-Za-z0-9_-]{11})/
const observeServices = new Map()

/**
 * clear user's observe service
 * @param {CommandInteraction} interaction
 * @param {String} text
 */
async function clear(interaction, text) {
    const userId = interaction.user.id
    clearInterval(observeServices.get(userId))
    if (observeServices.delete(userId)) {
        await interaction.channel.send(text)
    }
}

/**
 * recursive check function
 * @param {CommandInteraction} interaction
 * @param {String} url
 * @param {Boolean} beforeStatus
 * @param {Number} count
 */
async function check(interaction, url, beforeStatus, count) {
    const { data } = await axios(url)
    const isOpen = data.includes('comments-section')
    const userId = interaction.user.id
    // changed status alarm
    if (beforeStatus !== isOpen) {
        count = 0
        const status = isOpen ? '🟢 Comments are OK' : '🚫 Comments are locked'
        await interaction.channel.send(`<@${userId}> ${status}`)
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
            `<@${userId}> The service was terminated because there was no change in condition for an hour.`,
        )
    }
}

module.exports = {
    observeServices,
    async run(interaction) {
        const { options } = interaction
        const url = options.getString('url')
        const userId = interaction.user.id

        // clear
        clear(interaction, `<@${userId}> Observe service has been terminated`)

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
            await interaction.reply(`Start observe ${url}`)
            check(interaction, newUrl)
        } catch (e) {
            await interaction.reply('Request error')
        }
    },
}
