const CONFIG = require('./config')
const { Client, Intents } = require('discord.js')
const commands = require('./commands')
const twitch = require('./services/twitch')
const youtube = require('./services/youtube')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.once('ready', async () => {
    await twitch.connect()
    // youtube.connect()
    console.log('Ready!')
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const { commandName } = interaction

    if (commands[commandName]) {
        commands[commandName].run(interaction)
    }
})

client.login(CONFIG.DISCORD.TOKEN)
