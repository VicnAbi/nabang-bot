const CONFIG = require('../config')
const axios = require('axios')

const instance = axios.create({
    baseURL: 'https://holodex.net/api/v2',
    headers: {
        'X-APIKEY': CONFIG.HOLODEX.API_KEY,
    },
})

module.exports = {
    api(option) {
        return instance.request(option)
    },
}
