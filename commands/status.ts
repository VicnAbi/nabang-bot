import { relayingTlChannels } from './relay'
import { relayingClipChannels } from './clips'
import { observeServices } from './comment'
import client from '../services/client'
import { CommandInteraction } from 'discord.js'

export default {
    async run(interaction: CommandInteraction) {
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
