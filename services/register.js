const CONFIG = require('../config')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { register } = require('../commands')

const DEV_MODE = CONFIG.ENV === 'develop'
const rest = new REST({ version: '9' }).setToken(CONFIG.DISCORD.TOKEN)

;(async () => {
    try {
        if (DEV_MODE) {
            const test = {
                name: 'test',
                description: 'test',
            }
            await rest.put(
                Routes.applicationGuildCommands(
                    CONFIG.DISCORD.CLIENT_ID,
                    CONFIG.DISCORD.GUILD_ID,
                ),
                {
                    body: [...register, test],
                },
            )
        } else {
            await rest.put(
                Routes.applicationCommands(CONFIG.DISCORD.CLIENT_ID),
                {
                    body: register,
                },
            )
        }
        console.log('Successfully registered application commands.')
    } catch (error) {
        console.error(error)
    }
})()
