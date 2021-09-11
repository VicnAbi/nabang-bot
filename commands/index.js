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
].map(command => command.toJSON())

module.exports = {
    register,
    status: require('./status'),
    relay: require('./relay'),
    uwu: require('./uwu'),
}
