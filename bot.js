const CONFIG = require('./config')
const { Client, Intents } = require('discord.js')
const commands = require('./commands')
const twitch = require('./services/twitch')
const youtube = require('./services/youtube')
const { relayingTlChannels } = require('./commands/relay')
const { relayingClipChannels, clipScheduler } = require('./commands/clips')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.once('ready', async () => {
    try {
        // await youtube.connect()
        await twitch.connect()
        relayingTlChannels
            .add(await client.channels.fetch('831529891488727040'))
            .add(await client.channels.fetch('860458602317611029'))
        relayingClipChannels.add(
            await client.channels.fetch('831540702537187328'),
        )
        clipScheduler()
        console.log('Ready!')
    } catch (e) {
        console.error(e)
    }
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const { commandName } = interaction
    console.log(
        `${interaction.createdAt.toLocaleString()} | ${
            interaction.user.username
        } | ${commandName}`,
    )

    if (commands[commandName]) {
        commands[commandName].run(interaction)
    }
})

client.login(CONFIG.DISCORD.TOKEN)
