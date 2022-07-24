import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'

import { greetings } from './greetings.js'

describe('Greetings bootstrap', () => {
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
        .mockResolvedValueOnce({
          body: {
            data: {
              id: faker.datatype.number(),
              attributes: {}
            }
          }
        })
    }

    bot = {
      start: jest.fn()
    }
  })

  it('Should be a function', () => {
    expect(greetings).toBeInstanceOf(Function)
  })

  it('Should get the telegram config from the strabot manager', async () => {
    await greetings({
      StrabotManager,
      bot
    })

    expect(StrabotManager.get).toBeCalledWith(
      'telegram-config',
      {
        searchParams: {
          populate: 'Greetings.Messages,Greetings.Quizzes,Greetings.Surveys'
        }
      }
    )
  })
})
