module.exports = {
    async run(interaction) {
        const { options } = interaction
        const input = options.getString('input')
        const uwu = input.replace(/(l|r)/g, 'w')
        await interaction.reply(uwu)
        // `<@${user.id}>: ${uwu}`
    },
}
