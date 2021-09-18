const { relayingTlChannels } = require('./relay')
const { relayingClipChannels } = require('./clips')
const { observeServices } = require('./comment')

module.exports = {
    async run(interaction) {
        await interaction.reply(`
relayingTlChannels: ${relayingTlChannels.size}
relayingClipChannels: ${relayingClipChannels.size}
observeComments: ${observeServices.size}
        `)
    },
}
