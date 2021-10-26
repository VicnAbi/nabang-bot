import CONFIG from '../config'
import { chatAtDiscord } from '../commands/relay'
const YouTube = require('youtube-live-chat')

export default {
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
                resolve(true)
            })
            yt.on('message', ({ snippet, authorDetails }: any) => {
                const { displayMessage } = snippet
                const { displayName } = authorDetails
                if (/^\[(ko|kr)\].*/i.test(displayMessage.trim())) {
                    chatAtDiscord(displayMessage, displayName)
                }
            })
        })
    },
}
