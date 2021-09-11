const { relayingChannels } = require('./relay')

module.exports = {
    async run(interaction) {
        await interaction.reply(`
relayingChannels: ${relayingChannels.size}
        `)
    },
}
