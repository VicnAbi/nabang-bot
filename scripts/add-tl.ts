import { readFile } from 'fs'
import { api } from '../services/holodex'

const FILE_PATH = 'scripts/log.txt'
const VIDEO_ID = 'YOUTUBE_VIDEO_ID'
const VIDEO_DATE = '2021-00-00T00:00:00.000Z'
const PREFIX = '[EN] '

console.log(VIDEO_ID)
console.log(VIDEO_DATE)

interface RequestForm {
    name: string
    timestamp: number
    message: string
}

async function request(line: RequestForm) {
    return await api({
        method: 'post',
        url: `/videos/${VIDEO_ID}/chats?lang=en`,
        data: line,
    })
}

readFile(FILE_PATH, 'utf-8', async (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    // parse
    const lines = data
        .split(/\r?\n/)
        .filter((_) => _)
        .map((line) => {
            const matches = line.match(/^(\d+):(\d+):(\d+) ?\((.+?)\) ?(.+)$/)
            if (!matches) {
                console.error(`parse error: ${line}`)
                process.exit()
            }

            const [, h, m, s, user, text] = matches
            const time =
                (parseInt(s) + parseInt(m) * 60 + parseInt(h) * 60 * 60) * 1000
            const startTime = new Date(VIDEO_DATE).getTime()
            return <RequestForm>{
                name: user,
                timestamp: startTime + time,
                message: PREFIX + text,
            }
        })

    const arg = process.argv[2]

    // publish
    if (arg === 'publish') {
        let requestCount = 0
        for (const line of lines) {
            try {
                await request(line)
                console.log(++requestCount)
            } catch (e) {
                console.error(e.response.data)
                console.log(line)
                process.exit()
            }
        }
        console.log(`success: ${requestCount}`)
    }
    // just one call
    else if (arg === 'test') {
        const line = lines[0]
        console.log(line)

        try {
            await request(line)
            console.log('success')
        } catch (e) {
            console.error(e.response.data)
        }
    }
    // just parse
    else {
        const users = new Set()
        lines.forEach((line, index) => {
            users.add(line.name)
            if (index % 10 === 0) {
                console.log(`line[${index}]: ${lines[index].message}`)
            }
        })
        console.log(users)
        console.log(`count: ${lines.length}`)
    }
})
