const {
    MessageAttachment,
    MessageActionRow,
    MessageButton,
} = require('discord.js')

const maxTryCount = 10

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
    s = (s < 10 ? '0' : '') + s
    m = (m < 10 ? '0' : '') + m
    h = (h < 10 ? '0' : '') + h

    return `${h}:${m}:${s}`
}

/**
 * fetch message data to obj
 * @param {Message} m
 * @returns
 */
function dataToMsg(m) {
    return {
        time: m.createdTimestamp,
        tlr: m.content.replace(/^.*\|\|(.*)\|\|.*$/, '$1').replace(':', ''),
        content: m.content
            .replace(/^.*\[(en)\]/i, '')
            .trim()
            .replace(/`$/, ''),
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
        const { guildId, channel, options } = interaction
        const padding = options.getNumber('padding') || 1
        const start = options.getString('start')
        const end = options.getString('end')

        const startLink = `https://discord.com/channels/${guildId}/${channel.id}/${start}`
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setStyle('LINK')
                .setLabel('Go to first')
                .setURL(startLink),
        )
        interaction.reply({
            content: 'create a log file',
            components: [row],
        })

        try {
            const messages = [
                dataToMsg(await channel.messages.fetch(end)),
                ...(await recursiveFetch(channel.messages, end, start)),
            ].sort((a, b) => {
                return a.time - b.time
            })
            const txt = messages.reduce((s, m) => {
                const time = m.time - messages[0].time + padding * 1000
                return s + `${timeFormat(time)} (${m.tlr}) ${m.content}\n`
            }, '')
            const fileName = new Date(messages[0].time).toDateString() + '.txt'
            const attachment = new MessageAttachment(
                Buffer.from(txt, 'utf-8'),
                fileName,
            )
            await channel.send({ files: [attachment] })
        } catch (e) {
            console.error(e)
            await channel.send('error')
        }
    },
}
