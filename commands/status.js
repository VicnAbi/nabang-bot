const { relayingTlChannels } = require('./relay')
const { relayingClipChannels } = require('./clips')
const { observeServices } = require('./comment')
const client = require('../services/client')

module.exports = {
    async run(interaction) {
        const guilds = client.guilds.cache.reduce(
            (s, g) =>
                s +
                `${g.name}, ${g.description}, ${g.memberCount}, ${g.ownerId}\n`,
            '',
        )
        await interaction.reply(`
relayingTlChannels: ${relayingTlChannels.size}
relayingClipChannels: ${relayingClipChannels.size}
observeComments: ${observeServices.size}
\`\`\`
${guilds}
\`\`\`
        `)
    },
}
