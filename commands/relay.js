const relayingChannels = new Set()

module.exports = {
    relayingChannels,
    async run(interaction) {
        const { options, channel } = interaction
        const sw = options.getString('switch')
        if (sw) {
            // stop
            relayingChannels.delete(channel)
            await interaction.reply('tl relay has stopped')
        } else {
            // start
            relayingChannels.add(channel)
            await interaction.reply('start tl relay')
        }
    },
    async chatAtDiscord(message, username) {
        relayingChannels.forEach(channel => {
            channel.send({
                content: `:speech_balloon:||${username}|| \`${message}\``,
            })
        })
    },
}
