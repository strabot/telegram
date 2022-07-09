/**
 * Schedules bootstrap
 * @param {Object} params
 * @param {import('../services/Scheduler').Scheduler} params.Scheduler
 * @param {import('got').Got} params.StrabotManager
 * @param {import('telegraf').Telegraf} params.bot
 */
export async function schedules ({ Scheduler, StrabotManager, bot }) {
  const { body: { data: schedules } } = await StrabotManager.get('schedules', {
    searchParams: {
      populate: 'Messages'
    }
  })

  for (const schedule of schedules) {
    const { Recurrent, Date, Cron, Messages } = schedule.attributes

    Scheduler.schedule({
      when: Recurrent ? Cron : Date,
      handler: async function () {
        const { body: { data: chats } } = await StrabotManager.get('chats')

        for (const chat of chats) {
          const { Chat_ID } = chat.attributes

          for (const message of Messages.data) {
            const { Text } = message.attributes

            bot.telegram.sendMessage(Chat_ID, Text)
          }
        }
      }
    })
  }
}
