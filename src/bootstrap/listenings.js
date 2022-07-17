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
      populate: 'Messages,Quizzes,Surveys'
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
      }

      break
    }
  })
}
