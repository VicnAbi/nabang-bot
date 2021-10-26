import { CommandInteraction } from 'discord.js'

export default {
    async run(interaction: CommandInteraction) {
        const { options } = interaction
        const input = options.getString('input')
        const uwu = input?.replace(/(l|r)/g, 'w')
        await interaction.reply(uwu || 'UwU')
        // `<@${user.id}>: ${uwu}`
    },
}
