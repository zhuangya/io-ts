import * as assert from 'assert'
import * as E from '../src/Encoder'

describe('Encoder', () => {
  describe('literal', () => {
    it('should be the identity', () => {
      const codec = E.encoder.literal('a')
      assert.deepStrictEqual(codec.encode('a'), 'a')
    })
  })

  describe('keyof', () => {
    it('should be the identity', () => {
      const codec = E.encoder.keyof({ a: null, b: null })
      assert.deepStrictEqual(codec.encode('a'), 'a')
      assert.deepStrictEqual(codec.encode('b'), 'b')
    })
  })
})
