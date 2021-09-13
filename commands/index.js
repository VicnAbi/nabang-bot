const { SlashCommandBuilder } = require('@discordjs/builders')

const register = [
    // status
    new SlashCommandBuilder().setName('status').setDescription('Bot status'),
    // relay
    new SlashCommandBuilder()
        .setName('relay')
        .setDescription('Brings out the translation of real-time chat.')
        .addStringOption(option =>
            option.setName('switch').setDescription('On/Off switch'),
        ),
    // uwu
    new SlashCommandBuilder()
        .setName('uwu')
        .setDescription('UwU')
        .addStringOption(option =>
            option.setName('input').setDescription('text to uwu'),
        ),
    // comment
    new SlashCommandBuilder()
        .setName('comment')
        .setDescription('Observe Youtube comments')
        .addStringOption(option =>
            option.setName('url').setDescription('youtube url'),
        ),
].map(command => command.toJSON())

module.exports = {
    register,
    status: require('./status'),
    relay: require('./relay'),
    uwu: require('./uwu'),
    comment: require('./comment'),
}
