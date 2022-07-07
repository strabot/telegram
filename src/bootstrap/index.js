import { Telegraf } from 'telegraf'

import { commands } from './commands.js'

/**
 * @param {Object} params
 * @param {import('got/dist/source/types.js').Got} params.StrabotManager
 * @param {import('pino').Logger} params.logger
 */
export async function bootstrap ({ StrabotManager, logger }) {
  try {
    const { body: { data: { attributes: { Token } } } } = await StrabotManager.get('telegram-config')
    const bot = new Telegraf(Token)
  
    commands({
      bot,
      StrabotManager
    })
  
    await bot.launch()
    logger.info('Bot running')
  } catch (error) {
    logger.error(error)
  }
}
