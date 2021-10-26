import { CommandInteraction } from 'discord.js'

import { Commands } from './index'
import relay from './relay'
import log from './log'

export default {
    async run(interaction: CommandInteraction) {
        const { options } = interaction
        const sub = options.getSubcommand()
        await (
            {
                relay,
                log,
            } as Commands
        )[sub].run(interaction)
    },
}
