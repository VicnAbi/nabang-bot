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
    // clips
    new SlashCommandBuilder()
        .setName('clips')
        .setDescription('Brings out the new clips.')
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
    // vtt
    new SlashCommandBuilder()
        .setName('vtt')
        .setDescription('Save TLs to .vtt')
        .addStringOption(option =>
            option
                .setName('start')
                .setDescription('start chatId')
                .setRequired(true),
        )
        .addStringOption(option =>
            option
                .setName('end')
                .setDescription('end chatId')
                .setRequired(true),
        )
        .addNumberOption(option =>
            option
                .setName('padding')
                .setDescription(
                    'The difference between the beginning of the stream and the first TL (secoends)',
                ),
        ),
].map(command => command.toJSON())

module.exports = {
    register,
    status: require('./status'),
    relay: require('./relay'),
    clips: require('./clips'),
    uwu: require('./uwu'),
    comment: require('./comment'),
    vtt: require('./vtt'),
}
