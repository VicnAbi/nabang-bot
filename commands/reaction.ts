import {
    CommandInteraction,
    Message,
    MessageManager,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    Snowflake,
    Collection,
    MessageReaction,
    TextBasedChannels,
} from 'discord.js'
import client from '../services/client'

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
 * fetch message data to obj
 */
type MsgData = {
    id: Snowflake
    isTL: boolean
    time: number
    reactions: Collection<string, MessageReaction>
    reaction: {
        text: string
        count: number
    }
    content: string
}
function dataToMsg(m: Message) {
    return {
        id: m.id,
        isTL: /^(💬|:speech_balloon:)/.test(m.content),
        time: m.createdTimestamp,
        reactions: m.reactions.cache,
        content: m.content
            .replace(/^.*\[(en|ko|kr)\]/i, '')
            .trim()
            .replace(/`$/, ''),
    } as MsgData
}

/**
 * analyze emoji
 */
function analyzeEmoji(m: MsgData) {
    let text = ''
    let count = 0
    m.reactions
        .filter(r => r.emoji.name !== '⭐')
        .forEach(r => {
            text += `<:${r.emoji.name}:${r.emoji.id}>`
            count = count > r.count ? count : r.count
        })
    m.reaction = { text, count }
    return m
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
                content: `Summarize reactions\n${url}`,
                components: [row],
            })

            const tlMessages = [
                dataToMsg(await channel.messages.fetch(end)),
                ...(await recursiveFetch(channel.messages, end, start)),
            ]
                .filter(m => m.isTL)
                .sort((a, b) => {
                    return a.time - b.time
                })
            const firstTime = tlMessages[0].time
            const messages = tlMessages
                .map(m => {
                    m.time = m.time - firstTime + padding * 1000
                    return analyzeEmoji(m)
                })
                .filter(m => m.reaction.count > 1)

            const txts = messages.map(m => {
                const t = timeFormat(m.time)
                const link =
                    url === ''
                        ? `https://discord.com/channels/${guildId}/${channel.id}/${m.id}`
                        : `${url}?t=${t}`
                return `${m.content} ${m.reaction.text}(${m.reaction.count}) [${t}](${link})\n`
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
