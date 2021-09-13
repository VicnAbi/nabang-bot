const { relayingChannels } = require('./relay')
const { observeServices } = require('./comment')

module.exports = {
    async run(interaction) {
        await interaction.reply(`
relayingChannels: ${relayingChannels.size}
observeComments: ${observeServices.size}
        `)
    },
}
