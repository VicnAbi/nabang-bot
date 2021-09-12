const CONFIG = require('../config')
const YouTube = require('youtube-live-chat')
const { chatAtDiscord } = require('../commands/relay')

module.exports = {
    connect() {
        const yt = new YouTube(CONFIG.YOUTUBE.CHANNEL, CONFIG.YOUTUBE.API_KEY)
        yt.on('error', console.error)
        yt.on('ready', () => {
            console.log('youtube connected')
            yt.listen(1000)
        })
        yt.on('message', ({ snippet, authorDetails }) => {
            const { displayMessage } = snippet
            const { displayName } = authorDetails
            if (/^\[(ko|KO|kr|KR)\].*/.test(displayMessage.trim())) {
                chatAtDiscord(displayMessage, displayName)
            }
        })
    },
}
