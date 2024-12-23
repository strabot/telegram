/* eslint-disable @typescript-eslint/no-explicit-any */
import { Telegraf } from 'telegraf'

import { commands } from './commands.js'
import { greetings } from './greetings.js'
import { listenings } from './listenings.js'
import { schedules } from './schedules.js'
import { Logger } from 'pino'
import { Got } from 'got'

/**
 * @param {Object} params
 * @param {import('../services/Scheduler').Scheduler} params.Scheduler
 * @param {import('got').Got} params.StrabotManager
 * @param {import('pino').Logger} params.logger
 */
export async function bootstrap ({
  Scheduler,
  StrabotManager,
  logger,
}: {
  Scheduler: any
  StrabotManager: Got
  logger: Logger
}) {
  try {
    const { body: { data: config } } = await StrabotManager.get<any>('telegram-config')
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
      }),
      schedules({
        Scheduler,
        StrabotManager,
        bot,
      })
    ])

    await bot.launch()
    logger.info('Bot running')
  } catch (error) {
    logger.error(error)
  }
}
