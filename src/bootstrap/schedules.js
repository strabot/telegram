/**
 * Schedules bootstrap
 * @param {Object} params
 * @param {import('../services/Scheduler').Scheduler} params.Scheduler
 * @param {import('got').Got} params.StrabotManager
 * @param {import('telegraf').Telegraf} params.bot
 * @param {import('dayjs')} params.dayjs
 */
export async function schedules ({
  Scheduler,
  StrabotManager,
  bot,
  dayjs
}) {
  const { body: { data: schedules } } = await StrabotManager.get('schedules', {
    searchParams: {
      populate: 'Messages',
      'filters[$or][0][Date][$gt]': dayjs().toISOString(),
      'filters[$or][1][Date][$null]': true
    }
  })

  for (const schedule of schedules) {
    const { Recurrent, Date: date, Cron, Messages } = schedule.attributes

    Scheduler.schedule({
      when: Recurrent ? Cron : new Date(date),
      handler: async function () {
        const { body: { data: chats } } = await StrabotManager.get('chats')

        for (const chat of chats) {
          const { Chat_ID: chatId } = chat.attributes

          for (const message of Messages.data) {
            const { Text } = message.attributes

            bot.telegram.sendMessage(chatId, Text)
          }
        }
      }
    })
  }
}
