/**
 * Bootstrap commands
 * @param {Object} params
 * @param {import('telegraf').Telegraf} params.bot
 * @param {import('got/dist/source/types.js').Got} params.StrabotManager
 */
export async function commands ({ bot, StrabotManager }) {
  const { body: { data: commands } } = await StrabotManager.get('commands', {
    searchParams: {
      populate: 'Messages'
    }
  })

  for (const command of commands) {
    const { Command, Messages: { data: messages } } = command.attributes

    if (Command === 'start') {
      bot.start(
        (context, next) => {
          for (const message of messages) {
            context.replyWithMarkdown(message.attributes.Text).catch()
          }
          next()
        },
        async (context) => {
          await StrabotManager.post('chats', {
            json: {
              data: {
                Chat_ID: String(context.chat.id),
                Platform: 'Telegram'
              }
            }
          }).catch(() => {})
        }
      )
    } else {
      bot.command(Command, context => {
        for (const message of messages) {
          context.replyWithMarkdown(message.attributes.Text).catch()
        }
      })
    }
  }
}
