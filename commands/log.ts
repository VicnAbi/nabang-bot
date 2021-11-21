import {
    CommandInteraction,
    Snowflake,
    Message,
    MessageManager,
    MessageAttachment,
    MessageActionRow,
    MessageButton,
} from 'discord.js'

const maxTryCount = 50

/**
 * unix timestamp to format
 */
function timeFormat(timestamp: number) {
    let s = Math.floor(timestamp / 1000)
    let m = Math.floor(s / 60)
    const h = Math.floor(m / 60)

    s = s % 60
    m = m % 60
    const ss = (s < 10 ? '0' : '') + s
    const ms = (m < 10 ? '0' : '') + m
    const hs = (h < 10 ? '0' : '') + h

    return `${hs}:${ms}:${ss}`
}

/**
 * fetch message data to obj
 */
type MsgData = {
    time: number
    tlr: string
    content: string
}
function dataToMsg(m: Message) {
    return {
        time: m.createdTimestamp,
        tlr: m.content.replace(/^.*\|\|(.*)\|\|.*$/, '$1').replace(':', ''),
        content: m.content
            .replace(/^.*\[(en)\]/i, '')
            .trim()
            .replace(/`$/, ''),
    } as MsgData
}

/**
 * recursive fetch func
 */
async function recursiveFetch(
    messages: MessageManager,
    lastId: Snowflake,
    endId: Snowflake,
    result: MsgData[] = [],
    count = 0,
): Promise<MsgData[]> {
    const data = await messages.fetch({ limit: 100, before: lastId })

    const isEnd = data.some(m => {
        result.push(dataToMsg(m))
        return m.id == endId
    })

    if (isEnd || count > maxTryCount) {
        return result
    }
    return recursiveFetch(messages, data.last()!.id, endId, result, ++count)
}

export default {
    async run(interaction: CommandInteraction) {
        const { guildId, channel, options } = interaction
        if (!channel) return
        const padding = options.getNumber('padding') || 1
        const start = options.getString('start')!
        const end = options.getString('end')!

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
