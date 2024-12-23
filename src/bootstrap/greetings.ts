/* eslint-disable @typescript-eslint/no-explicit-any */
import { Got } from 'got'
import { Telegraf } from 'telegraf'

export async function greetings ({
  StrabotManager,
  bot,
  config
}: {
  StrabotManager: Got
  bot: Telegraf
  config: any
}) {
  const { body: { data: greetings } } = await StrabotManager.get<any>('greeting', {
    searchParams: {
      populate: 'Messages,Quizzes.Answers,Surveys.Options'
    }
  })

  const { Username: username, Group_chats: groupChats, Private_chats: privateChats } = config.attributes

  if (privateChats) {
    bot.start(async (context) => {
      if (greetings) {
        const {
          Messages: { data: messages },
          Quizzes: { data: quizzes },
          Surveys: { data: surveys }
        } = greetings.attributes

        for (const message of messages) {
          await context.replyWithMarkdownV2(message.attributes.Text).catch()
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
      }

      await StrabotManager.post('chats', {
        json: {
          data: {
            Name: context.message.from.first_name,
            Platform: 'Telegram',
            Type: 'Private',
            Chat_ID: String(context.chat.id)
          }
        }
      }).catch(() => {})
    })
  }

  if (groupChats) {
    bot.on('new_chat_members', async (context) => {
      if (greetings) {
        const { Messages, Quizzes, Surveys } = greetings

        for (const message of Messages) {
          await context.replyWithMarkdown(message.attributes.Text).catch()
        }

        for (const quiz of Quizzes) {
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

        for (const survey of Surveys) {
          const { Question, Options } = survey.attributes

          await context.replyWithPoll(
            Question,
            Options.map(({ Value }: any) => Value)
          )
        }
      }

      if (context.message.from.username === username) {
        await StrabotManager.post('chats', {
          json: {
            data: {
              Name: context.message.from.first_name,
              Platform: 'Telegram',
              Type: 'Group',
              Chat_ID: String(context.chat.id)
            }
          }
        }).catch(() => {})
      }
    })
  }
}
