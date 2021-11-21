import { api } from '../services/holodex'
import { CommandInteraction, TextBasedChannels, MessageEmbed } from 'discord.js'

export const relayingClipChannels = new Set<TextBasedChannels>()

const interval = 3 * 60 * 1000

type Clip = {
    id: string
    title: string
    lang: string
    channel: {
        name: string
        photo: string
    }
}
async function chatAtDiscord({ id, title, channel, lang }: Clip) {
    const embed = new MessageEmbed()
        .setColor('#B03B40')
        .setTitle(title)
        .setAuthor(channel.name, channel.photo)
        .setURL(`https://youtu.be/${id}`)
        .setImage(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`)
        .addFields({ name: 'Language', value: lang, inline: true })
        .setFooter(
            'From Holodex clips',
            'https://pbs.twimg.com/profile_images/1374907434523750408/-rlYtfK0_normal.png',
        )
    relayingClipChannels.forEach(channel => {
        channel.send({ embeds: [embed] })
    })
}

let before: Clip[] = []
export async function clipScheduler() {
    try {
        const { data } = await api({
            url: '/channels/UCzKkwB84Y0ql0EvyOWRSkEw/clips',
            params: {
                limit: 3,
            },
        })
        if (before.length) {
            data.filter((clip: Clip) =>
                before.every(b => b.id !== clip.id),
            ).forEach((newClip: Clip) => chatAtDiscord(newClip))
        }
        before = data
    } catch (e) {
        console.error('clip load fail')
        // console.error(e)
    }
    setTimeout(clipScheduler, interval)
}

export default {
    async run(interaction: CommandInteraction) {
        const { options, channel } = interaction
        if (!channel) return

        const sw = options.getString('switch')
        if (sw) {
            // stop
            relayingClipChannels.delete(channel)
            await interaction.reply('clip relay has stopped')
        } else {
            // start
            relayingClipChannels.add(channel)
            await interaction.reply('start clip relay')
        }
    },
}
