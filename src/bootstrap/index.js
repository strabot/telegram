import { Telegraf } from 'telegraf'

import { commands } from './commands.js'
import { greetings } from './greetings.js'
import { listenings } from './listenings.js'
import { schedules } from './schedules.js'

/**
 * @param {Object} params
 * @param {import('../services/Scheduler').Scheduler} params.Scheduler
 * @param {import('got').Got} params.StrabotManager
 * @param {import('pino').Logger} params.logger
 * @param {import('natural')} params.natural
 */
export async function bootstrap ({
  Scheduler,
  StrabotManager,
  dayjs,
  logger,
  natural
}) {
  try {
    const { body: { data: config } } = await StrabotManager.get('telegram-config')
    const { Active, Token } = config.attributes

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
        bot,
        config
      }),
      listenings({
        StrabotManager,
        bot,
        natural
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
