import { describe, it, expect, beforeEach, jest } from '@jest/globals'

import { commands } from './commands'

describe('Commands bootstrap', () => {
  /**
   * @type {import('got').Got}
   */
  let StrabotManager

  /**
   * @type {import('telegraf').Telegraf}
   */
  let bot

  beforeEach(() => {
    StrabotManager = {
      get: jest
        .fn()
        .mockResolvedValueOnce({ body: { data: [] } })
    }

    bot = {
      start: jest.fn()
    }
  })

  it('Should get the commands from the manager', async () => {
    await commands({
      StrabotManager,
      bot
    })

    expect(StrabotManager.get).toBeCalledWith(
      'commands',
      {
        searchParams: {
          populate: 'Messages,Quizzes.Answers,Surveys.Options',
          'filters[Telegram][$eq]': true
        }
      }
    )
  })
})
