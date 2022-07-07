import { Telegraf } from 'telegraf'

import { commands } from './commands.js'

/**
 * @param {Object} params
 * @param {import('got/dist/source/types.js').Got} params.StrabotManager
 */
export async function bootstrap ({ StrabotManager }) {
  const { body: { data: { attributes: { Token } } } } = await StrabotManager.get('telegram-config')
  const bot = new Telegraf(Token)

  commands({
    bot,
    StrabotManager
  })

  bot.launch()
}
