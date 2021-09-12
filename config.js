const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    DISCORD: {
        TOKEN: process.env.DISCORD_BOT_TOKEN,
        CLIENT_ID: process.env.DISCORD_BOT_CLIENT_ID,
        GUILD_ID: process.env.DISCORD_BOT_GUILD_ID,
    },
    TWITCH: {
        NAME: process.env.TWITCH_BOT_NAME,
        TOKEN: process.env.TWITCH_BOT_TOKEN,
        CHANNEL: process.env.TWITCH_TARGET_CHANNEL,
    },
    YOUTUBE: {
        API_KEY: process.env.YOUTUBE_API_KEY,
        CHANNEL: process.env.YOUTUBE_TARGET_CHANNEL,
    },
}
