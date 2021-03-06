import {
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
} from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

export interface Commands {
    [comm: string]: {
        run(intr: CommandInteraction): Promise<void>
    }
}

import status from './status'
import uwu from './uwu'
import tl from './tl'
import clips from './clips'
import comment from './comment'
import tag from './tag'
import reaction from './reaction'

export default <Commands>{
    status,
    uwu,
    tl,
    clips,
    comment,
    tag,
    reaction,
}

export const register = [
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
    // reaction
    new SlashCommandBuilder()
        .setName('reaction')
        .setDescription('Summarize the TLs that received reactions')
        .addStringOption(option =>
            option
                .setName('channel')
                .setDescription('stream chat channelId')
                .setRequired(true),
        )
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
        )
        .addStringOption(option =>
            option.setName('url').setDescription('Video link'),
        ),
    // tag
    new SlashCommandBuilder()
        .setName('tag')
        .setDescription('Generate tag list')
        .addStringOption(option =>
            option
                .setName('channel')
                .setDescription('stream chat channelId')
                .setRequired(true),
        )
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
                    'The difference between the beginning of the stream and the first tag (secoends)',
                ),
        )
        .addStringOption(option =>
            option.setName('url').setDescription('Video link'),
        )
        .addStringOption(option =>
            option.setName('type').setDescription('type:youtube'),
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
                    option
                        .setName('target')
                        .setDescription('Target twitch channel or target:stop'),
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
