/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, jest } from '@jest/globals'

import { commands } from './commands'
import { Got } from 'got'
import { Telegraf } from 'telegraf'

describe('Commands bootstrap', () => {
  let StrabotManager: Got
  let bot: Telegraf

  beforeEach(() => {
    StrabotManager = {
      get: jest
        .fn()
        .mockResolvedValueOnce({ body: { data: [] } } as never)
    } as any

    bot = {
      start: jest.fn()
    } as any
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
