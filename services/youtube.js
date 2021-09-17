const CONFIG = require('../config')
const YouTube = require('youtube-live-chat')
const { chatAtDiscord } = require('../commands/relay')

module.exports = {
    connect() {
        return new Promise((resolve, reject) => {
            const yt = new YouTube(
                CONFIG.YOUTUBE.TARGET,
                CONFIG.YOUTUBE.API_KEY,
            )
            yt.on('error', reject)
            yt.on('ready', () => {
                console.log('youtube connected')
                yt.listen(1000)
                resolve()
            })
            yt.on('message', ({ snippet, authorDetails }) => {
                const { displayMessage } = snippet
                const { displayName } = authorDetails
                if (/^\[(ko|kr)\].*/i.test(displayMessage.trim())) {
                    chatAtDiscord(displayMessage, displayName)
                }
            })
        })
    },
}
