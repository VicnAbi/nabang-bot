import CONFIG from './config'
import client from './services/client'
import commands from './commands'
import twitch from './services/twitch'
import youtube from './services/youtube'
import { relayingTlChannels } from './commands/relay'
import { relayingClipChannels, clipScheduler } from './commands/clips'
import { TextBasedChannels } from 'discord.js'

const DEV_MODE = CONFIG.ENV === 'develop'

client.once('ready', async () => {
    if (DEV_MODE) return
    try {
        // await youtube.connect()
        await twitch.connect()

        const initTlChannels = [
            await client.channels.fetch('831529891488727040'),
            await client.channels.fetch('860458602317611029'),
        ]
        const initClipChannels = [
            await client.channels.fetch('831540702537187328'),
        ]
        initTlChannels.forEach((channel) =>
            relayingTlChannels.add(channel as TextBasedChannels),
        )
        initClipChannels.forEach((channel) =>
            relayingClipChannels.add(channel as TextBasedChannels),
        )

        clipScheduler()
        console.log('Ready!')
    } catch (e) {
        console.error(e)
    }
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return
    if (DEV_MODE && CONFIG.MASTER_ID != interaction.user.id) return

    const { commandName } = interaction
    console.log(
        `${interaction.user.id} | ${interaction.user.username} | ${commandName}`,
    )

    const command = commands[commandName]
    if (command) command.run(interaction)
})

client.login(CONFIG.DISCORD.TOKEN)
