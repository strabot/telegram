import { Telegraf } from 'telegraf'

import { commands } from './commands.js'

/**
 * @param {Object} params
 * @param {import('got').Got} params.StrabotManager
 * @param {import('pino').Logger} params.logger
 */
export async function bootstrap ({ StrabotManager, logger }) {
  try {
    const { body: { data: { attributes: { Token } } } } = await StrabotManager.get('telegram-config')
    const bot = new Telegraf(Token)

    await Promise.all([
      commands({
        bot,
        StrabotManager
      })
    ])

    await bot.launch()
    logger.info('Bot running')
  } catch (error) {
    logger.error(error)
  }
}
