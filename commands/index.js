const {
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
} = require('@discordjs/builders')

const register = [
    // status
    new SlashCommandBuilder().setName('status').setDescription('Bot status'),
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
    // tl
    new SlashCommandBuilder()
        .setName('tl')
        .setDescription('Translation functions')
        // tl relay
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName('relay')
                .setDescription('Brings out the translation of real-time chat.')
                .addStringOption(option =>
                    option.setName('switch').setDescription('On/Off switch'),
                ),
        )
        // tl log
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName('log')
                .setDescription('Save TLs like LunaTL log')
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
        ),
].map(command => command.toJSON())

module.exports = {
    register,
    status: require('./status'),
    clips: require('./clips'),
    uwu: require('./uwu'),
    comment: require('./comment'),
    tl: require('./tl'),
}
