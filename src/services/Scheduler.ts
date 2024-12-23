import { CronCommand, CronJob } from 'cron'

export const Scheduler = {
  schedule: async function ({ handler, when }: { handler: CronCommand, when: string | Date }) {
    return new CronJob(when, handler, null, true)
  }
}
