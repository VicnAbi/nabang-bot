const relayingTlChannels = new Set()

module.exports = {
    relayingTlChannels,
    async run(interaction) {
        const { options, channel } = interaction
        const sw = options.getString('switch')
        if (sw) {
            // stop
            relayingTlChannels.delete(channel)
            await interaction.reply('tl relay has stopped')
        } else {
            // start
            relayingTlChannels.add(channel)
            await interaction.reply('start tl relay')
        }
    },
    async chatAtDiscord(message, username) {
        relayingTlChannels.forEach(channel => {
            channel.send({
                content: `:speech_balloon:||${username}|| \`${message}\``,
            })
        })
    },
}
