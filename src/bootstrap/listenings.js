/**
 * @param {Object} params
 * @param {import('telegraf').Telegraf} params.bot
 * @param {import('got').Got} params.StrabotManager
 * @param {import('natural')} params.natural
 */
export async function listenings ({
  StrabotManager,
  bot,
  natural
}) {
  const { body: { data: listenings } } = await StrabotManager.get('listenings', {
    searchParams: {
      populate: 'Messages,Quizzes.Answers,Surveys.Options'
    }
  })

  bot.on('text', async function (context) {
    const { text, message_id: messageId } = context.update.message

    for (const listening of listenings) {
      const {
        Text,
        Messages: { data: messages },
        Quizzes: { data: quizzes },
        Surveys: { data: surveys }
      } = listening.attributes

      if (natural.JaroWinklerDistance(text, Text) >= 0.8) {
        for (const message of messages) {
          const { Text } = message.attributes

          await context.replyWithMarkdown(Text, {
            reply_to_message_id: messageId
          })
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

        break
      }
    }
  })
}
