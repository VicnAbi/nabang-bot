const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const client = require('../services/client')

const maxTryCount = 50

/**
 * unix timestamp to format
 * @param {Number} timestamp
 * @returns
 */
function timeFormat(timestamp) {
    let s = Math.floor(timestamp / 1000)
    let m = Math.floor(s / 60)
    let h = Math.floor(m / 60)

    s = s % 60
    m = m % 60

    let text = ''
    text += h > 0 ? `${h}h` : ''
    text += m > 0 ? `${m}m` : ''
    text += s > 0 ? `${s}s` : ''

    return text
}

/**
 * fetch message data to obj
 * @param {Message} m
 * @returns
 */
function dataToMsg(m) {
    const content = m.content
        .replace(/^.*\[(en|ko|kr)\]/i, '')
        .trim()
        .replace(/`$/, '')
    const isTL = /^(💬|:speech_balloon:)/.test(m.content)
    return {
        id: m.id,
        isTL,
        hasStar: (isTL && m.reactions.cache.has('⭐')) || /^⭐/.test(m.content),
        time: m.createdTimestamp,
        content: content
            .replace(/^(⭐|💬|:speech_balloon:)/, '')
            .replace(/^\|\|.*\|\|/, '')
            .trim(),
    }
}

/**
 * recursive fetch func
 * @param {Collection<Message>} messages
 * @param {Snowflake} lastId
 * @param {Snowflake} endId
 * @param {Array} result
 * @param {Number} count
 * @returns
 */
async function recursiveFetch(messages, lastId, endId, result = [], count = 0) {
    const data = await messages.fetch({ limit: 100, before: lastId })

    let isEnd = data.some(m => {
        result.push(dataToMsg(m))
        return m.id == endId
    })

    if (isEnd || count > maxTryCount) {
        return result
    }
    return recursiveFetch(messages, data.last().id, endId, result, ++count)
}

module.exports = {
    async run(interaction) {
        const { guildId, options } = interaction
        const channelId = options.getString('channel')
        const url = options.getString('url') || ''
        const padding = options.getNumber('padding') || 1
        const start = options.getString('start')
        const end = options.getString('end')

        try {
            const channel = await client.channels.fetch(channelId)
            const startLink = `https://discord.com/channels/${guildId}/${channel.id}/${start}`
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setStyle('LINK')
                    .setLabel('Go to first message')
                    .setURL(startLink),
            )
            interaction.reply({
                content: `Generate tags\n${url}`,
                components: [row],
            })

            const messages = [
                dataToMsg(await channel.messages.fetch(end)),
                ...(await recursiveFetch(channel.messages, end, start)),
            ].sort((a, b) => {
                return a.time - b.time
            })
            const firstTime = messages[0].time
            const txts = messages
                .filter(m => m.hasStar)
                .map(m => {
                    const t = timeFormat(m.time - firstTime + padding * 1000)
                    const link =
                        url === ''
                            ? `https://discord.com/channels/${guildId}/${channel.id}/${m.id}`
                            : `${url}?t=${t}`
                    return (
                        (m.isTL ? '[TL] ' : '') +
                        `${m.content} [${t}](${link})\n`
                    )
                })

            for (let i = 0; i < txts.length; i += 10) {
                const str = txts.slice(i, i + 10).reduce((p, n) => p + n, '')
                const embed = new MessageEmbed().setDescription(str)
                await interaction.channel.send({ embeds: [embed] })
            }
        } catch (e) {
            console.error(e)
            await interaction.channel.send('error')
        }
    },
}
