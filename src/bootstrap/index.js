import { Telegraf } from 'telegraf'

import { commands } from './commands.js'
import { greetings } from './greetings.js'
import { schedules } from './schedules.js'

/**
 * @param {Object} params
 * @param {import('../services/Scheduler').Scheduler} params.Scheduler
 * @param {import('got').Got} params.StrabotManager
 * @param {import('pino').Logger} params.logger
 */
export async function bootstrap ({
  Scheduler,
  StrabotManager,
  dayjs,
  logger
}) {
  try {
    const { body: { data: { attributes: { Active, Token } } } } = await StrabotManager.get('telegram-config')

    if (!Active) {
      logger.error('Telegram platform is not active. Setup in your manager.')
      return process.exit(0)
    }

    const bot = new Telegraf(Token)

    await Promise.all([
      commands({
        StrabotManager,
        bot
      }),
      greetings({
        StrabotManager,
        bot
      }),
      schedules({
        Scheduler,
        StrabotManager,
        bot,
        dayjs
      })
    ])

    await bot.launch()
    logger.info('Bot running')
  } catch (error) {
    logger.error(error)
  }
}
