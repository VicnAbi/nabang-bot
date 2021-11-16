import CONFIG from '../config'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { register } from '../commands'

const DEV_MODE = CONFIG.ENV === 'develop'
const rest = new REST({ version: '9' }).setToken(CONFIG.DISCORD.TOKEN!)

;(async () => {
    try {
        if (DEV_MODE) {
            const status = {
                name: 'status',
                description: 'status',
            }
            await rest.put(
                Routes.applicationGuildCommands(
                    CONFIG.DISCORD.CLIENT_ID!,
                    CONFIG.DISCORD.GUILD_ID!,
                ),
                {
                    body: [...register, status],
                },
            )
        } else {
            await rest.put(
                Routes.applicationCommands(CONFIG.DISCORD.CLIENT_ID!),
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
