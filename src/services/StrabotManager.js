import got from 'got'

const { STRABOT_MANAGER_URL, STRABOT_MANAGER_TOKEN } = process.env

export const StrabotManager = got.extend({
  prefixUrl: STRABOT_MANAGER_URL,
  headers: {
    Authorization: `Bearer ${STRABOT_MANAGER_TOKEN}`
  }
})
