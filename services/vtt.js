// legacy

/**
 * unix timestamp to format
 * @param {Number} timestamp
 * @returns
 */
function timeFormat(timestamp) {
    let ms = timestamp % 1000
    let s = Math.floor(timestamp / 1000)
    let m = Math.floor(s / 60)
    let h = Math.floor(m / 60)

    s = s % 60
    m = m % 60
    s = (s < 10 ? '0' : '') + s
    m = (m < 10 ? '0' : '') + m
    h = (h < 10 ? '0' : '') + h
    ms = (ms < 100 ? '0' : '') + (ms < 10 ? '0' : '') + ms

    return `${h}:${m}:${s}.${ms}`
}

/**
 * render vtt file source
 * @param {String} startLink
 * @param {Array} messages
 * @param {Number} padding
 * @returns
 */
module.exports = function messagesToVtt(title, messages, padding) {
    const startTime = messages[0].time
    let lastTime = 0
    let lastText = '~'
    let vttText = `
WEBVTT
Kind: subtitles
Language: en

NOTE ${title}
`
    messages.forEach((m) => {
        const time = m.time - startTime + padding * 1000
        vttText += `
${timeFormat(lastTime)} --> ${timeFormat(time)}
${lastText}
    `
        lastTime = time
        lastText = m.content
    })
    // last
    vttText += `
${timeFormat(lastTime)} --> ${timeFormat(lastTime + 5000)}
${lastText}
    `
    return vttText
}
