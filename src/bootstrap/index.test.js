import { describe, expect, it } from '@jest/globals'

import { bootstrap } from '.'

describe('bootstrap', () => {
  it('Should be a function', () => {
    expect(bootstrap).toBeInstanceOf(Function)
  })
})
