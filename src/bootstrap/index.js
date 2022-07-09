import { Telegraf } from 'telegraf'

import { commands } from './commands.js'
import { schedules } from './schedules.js'

/**
 * @param {Object} params
 * @param {import('../services/Scheduler').Scheduler} params.Scheduler
 * @param {import('got').Got} params.StrabotManager
 * @param {import('pino').Logger} params.logger
 */
export async function bootstrap ({ Scheduler, StrabotManager, logger }) {
  try {
    const { body: { data: { attributes: { Token } } } } = await StrabotManager.get('telegram-config')
    const bot = new Telegraf(Token)

    await Promise.all([
      commands({
        StrabotManager,
        bot
      }),
      schedules({
        Scheduler,
        StrabotManager,
        bot
      })
    ])

    await bot.launch()
    logger.info('Bot running')
  } catch (error) {
    logger.error(error)
  }
}
