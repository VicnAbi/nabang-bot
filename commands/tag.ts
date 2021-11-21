import {
    CommandInteraction,
    Message,
    MessageManager,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    Snowflake,
    TextBasedChannels,
} from 'discord.js'
import client from '../services/client'
import youtube from '../services/youtube'

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

    let text = ''
    text += h > 0 ? `${h}h` : ''
    text += m > 0 ? `${m}m` : ''
    text += s > 0 ? `${s}s` : ''

    return text
}

/**
 * unix timestamp to youtube format
 * @param {Number} timestamp
 * @returns
 */
function youtubeTimeFormat(timestamp: number) {
    let s = Math.floor(timestamp / 1000)
    let m = Math.floor(s / 60)
    const h = Math.floor(m / 60)

    s = s % 60
    m = m % 60

    let text = ''
    text += h > 0 ? `${h}:` : ''
    text += m > 9 ? `${m}:` : `0${m}:`
    text += s > 9 ? `${s}` : `0${s}`

    return text
}

/**
 * fetch message data to obj
 */
type MsgData = {
    id: Snowflake
    isTL: boolean
    hasStar: boolean
    time: number
    content: string
}
function dataToMsg(m: Message) {
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
        const { guildId, options } = interaction
        const channelId = options.getString('channel')!
        const url = options.getString('url') || ''
        const padding = options.getNumber('padding') || 1
        const start = options.getString('start')!
        const end = options.getString('end')!
        const renderType = options.getString('type') || ''

        try {
            const channel = (await client.channels.fetch(
                channelId,
            )) as TextBasedChannels
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
                    const t = m.time - firstTime + padding * 1000
                    const link =
                        url === ''
                            ? `https://discord.com/channels/${guildId}/${channel.id}/${m.id}`
                            : `${url}?t=${t}`
                    return renderType.toLowerCase() === 'youtube'
                        ? `${youtubeTimeFormat(t)} ${m.isTL ? '[TL] ' : ''}` +
                              `${m.content}\n`
                        : (m.isTL ? '[TL] ' : '') +
                              `${m.content} [${timeFormat(t)}](${link})\n`
                })

            for (let i = 0; i < txts.length; i += 10) {
                const str = txts.slice(i, i + 10).reduce((p, n) => p + n, '')
                const embed = new MessageEmbed().setDescription(str)
                await interaction.channel?.send({ embeds: [embed] })
            }
        } catch (e) {
            console.error(e)
            await interaction.channel?.send('error')
        }
    },
}
