module.exports = {
    async run(interaction) {
        console.log(interaction)
        await interaction.reply('test')
    },
}
