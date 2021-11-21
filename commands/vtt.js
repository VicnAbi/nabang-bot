// legacy

const {
    MessageAttachment,
    MessageActionRow,
    MessageButton,
} = require('discord.js')
const messagesToVtt = require('../services/vtt')

const maxTryCount = 10

/**
 * fetch message data to obj
 * @param {Message} m
 * @returns
 */
function dataToMsg(m) {
    return {
        time: m.createdTimestamp,
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
            content: 'start collecting messages',
            components: [row],
        })

        try {
            const messages = [
                dataToMsg(await channel.messages.fetch(end)),
                ...(await recursiveFetch(channel.messages, end, start)),
            ].sort((a, b) => {
                return a.time - b.time
            })
            const vtt = messagesToVtt(startLink, messages, padding)
            const fileName = new Date().toDateString() + '.vtt'
            const attachment = new MessageAttachment(
                Buffer.from(vtt, 'utf-8'),
                fileName,
            )
            await channel.send({ files: [attachment] })
        } catch (e) {
            console.error(e)
            await channel.send('error')
        }
    },
}
