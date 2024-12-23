/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, jest } from '@jest/globals'

import { greetings } from './greetings.js'
import { Got } from 'got'
import { Telegraf } from 'telegraf'

describe('Greetings bootstrap', () => {
  let StrabotManager: Got
  let bot: Telegraf
  let config: any

  beforeEach(async () => {
    StrabotManager = {
      get: jest
        .fn()
        .mockResolvedValueOnce({ body: { data: [] } } as never)
    } as any

    bot = {
      start: jest.fn()
    } as any

    config = {
      attributes: {}
    }
  })

  it('Should be a function', () => {
    expect(greetings).toBeInstanceOf(Function)
  })

  it('Should get the telegram config from the strabot manager', async () => {
    await greetings({
      StrabotManager,
      bot,
      config
    })

    expect(StrabotManager.get).toBeCalledWith(
      'greeting',
      {
        searchParams: {
          populate: 'Messages,Quizzes.Answers,Surveys.Options'
        }
      }
    )
  })
})
