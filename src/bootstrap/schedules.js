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
      populate: 'Messages,Quizzes.Answers,Surveys.Options',
      'filters[Telegram][$eq]': true,
      'filters[$or][0][Date][$gt]': dayjs().toISOString(),
      'filters[$or][1][Cron][$notNull]': true
    }
  })

  for (const schedule of schedules) {
    const {
      Recurrent,
      Date: date,
      Cron,
      Messages: { data: messages },
      Quizzes: { data: quizzes },
      Surveys: { data: surveys }
    } = schedule.attributes

    Scheduler.schedule({
      when: Recurrent ? Cron : new Date(date),
      handler: async function () {
        const { body: { data: chats } } = await StrabotManager.get('chats')

        for (const chat of chats) {
          const { Chat_ID: chatId } = chat.attributes

          for (const message of messages) {
            const { Text } = message.attributes

            bot.telegram.sendMessage(chatId, Text)
          }

          for (const quiz of quizzes) {
            const { Question, Answers } = quiz.attributes
    
            const correctAnswerIndex = Answers.findIndex(({ Correct }) => Correct)
            await bot.telegram.sendQuiz(
              chatId,
              Question,
              Answers.map(({ Value }) => Value),
              {
                correct_option_id: correctAnswerIndex
              }
            )
          }
    
          for (const survey of surveys) {
            const { Question, Options } = survey.attributes
    
            await bot.telegram.sendPoll(
              chatId,
              Question,
              Options.map(({ Value }) => Value)
            )
          }
        }
      }
    })
  }
}
