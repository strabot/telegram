/* eslint-disable @typescript-eslint/no-explicit-any */
import { Got } from 'got'
import { Telegraf } from 'telegraf'

export async function commands ({
  StrabotManager,
  bot
}: {
  StrabotManager: Got,
  bot: Telegraf
}) {
  const { body: { data: commands } } = await StrabotManager.get<any>('commands', {
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
    })
  }
}
