import { CronJob } from 'cron'

export const Scheduler = {
  /**
  * @param {Object} params
  * @param {Function} params.handler
  * @param {String | Date} params.when
  */
  schedule: async function ({ handler, when }) {
    return new CronJob(when, handler, null, true)
  }
}
