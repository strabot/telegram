/* eslint-disable @typescript-eslint/no-explicit-any */
import natural from 'natural'

export async function listenings ({
  StrabotManager,
  bot
}: {
  StrabotManager: import('got').Got
  bot: import('telegraf').Telegraf
}) {
  const { body: { data: listenings } } = await StrabotManager.get<any>('listenings', {
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
            reply_parameters: {
              message_id: messageId
            }
          })
        }

        for (const quiz of quizzes) {
          const { Question, Answers } = quiz.attributes

          const correctAnswerIndex = Answers.findIndex(({ Correct }: any) => Correct)
          await context.replyWithQuiz(
            Question,
            Answers.map(({ Value }: any) => Value),
            {
              correct_option_id: correctAnswerIndex
            }
          )
        }

        for (const survey of surveys) {
          const { Question, Options } = survey.attributes

          await context.replyWithPoll(
            Question,
            Options.map(({ Value }: any) => Value)
          )
        }

        break
      }
    }
  })
}
