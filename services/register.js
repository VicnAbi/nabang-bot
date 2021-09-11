const CONFIG = require('../config')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { register } = require('../commands')

const rest = new REST({ version: '9' }).setToken(CONFIG.DISCORD.TOKEN)

;(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(
                CONFIG.DISCORD.CLIENT_ID,
                CONFIG.DISCORD.GUILD_ID,
            ),
            {
                body: register,
            },
        )
        console.log('Successfully registered application commands.')
    } catch (error) {
        console.error(error)
    }
})()
