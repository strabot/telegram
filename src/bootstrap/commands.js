/**
 * Bootstrap commands
 * @param {Object} params
 * @param {import('got/dist/source/types.js').Got} params.StrabotManager
 * @param {import('telegraf').Telegraf} params.bot
 */
export async function commands ({
  StrabotManager,
  bot
}) {
  const { body: { data: commands } } = await StrabotManager.get('commands', {
    searchParams: {
      populate: 'Messages,Quizzes.Answers,Surveys.Options',
      'filters[Telegram][$eq]': true
    }
  })

  for (const command of commands) {
    const {
      Command,
      Messages: { data: messages },
      Quizzes: { data: quizzes },
      Surveys: { data: surveys }
    } = command.attributes

    bot.command(Command, async context => {
      for (const message of messages) {
        await context.replyWithMarkdown(message.attributes.Text).catch()
      }

      for (const quiz of quizzes) {
        const { Question, Answers } = quiz.attributes

        const correctAnswerIndex = Answers.findIndex(({ Correct }) => Correct)
        await context.replyWithQuiz(
          Question,
          Answers.map(({ Value }) => Value),
          {
            correct_option_id: correctAnswerIndex
          }
        )
      }

      for (const survey of surveys) {
        const { Question, Options } = survey.attributes

        await context.replyWithPoll(
          Question,
          Options.map(({ Value }) => Value)
        )
      }
    })
  }
}
