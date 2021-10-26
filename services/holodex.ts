import CONFIG from '../config'
import axios, { AxiosRequestConfig } from 'axios'

const instance = axios.create({
    baseURL: 'https://holodex.net/api/v2',
    headers: {
        'X-APIKEY': CONFIG.HOLODEX.API_KEY,
    },
})

export function api(option: AxiosRequestConfig) {
    return instance.request(option)
}
