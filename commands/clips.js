const { api } = require('../services/holodex')
const { MessageEmbed } = require('discord.js')

const relayingClipChannels = new Set()
const interval = 3 * 60 * 1000

async function chatAtDiscord({ id, title, channel, lang }) {
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

let before = []
async function clipScheduler() {
    try {
        const { data } = await api({
            url: '/channels/UCzKkwB84Y0ql0EvyOWRSkEw/clips',
            params: {
                limit: 3,
            },
        })
        if (before.length) {
            data.filter(clip => before.every(b => b.id !== clip.id)).forEach(
                newClip => chatAtDiscord(newClip),
            )
        }
        before = data
    } catch (e) {
        console.error('clip load fail')
        // console.error(e)
    }
    setTimeout(clipScheduler, interval)
}

module.exports = {
    relayingClipChannels,
    clipScheduler,
    async run(interaction) {
        const { options, channel } = interaction
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
