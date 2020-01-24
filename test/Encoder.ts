import * as assert from 'assert'
import * as E from '../src/Encoder'

describe('Encoder', () => {
  describe('encoder', () => {
    it('contramap', () => {
      const encoder = E.encoder.contramap(E.encoder.number, (s: string) => s.length)
      assert.deepStrictEqual(encoder.encode('aaa'), 3)
    })
  })

  describe('literal', () => {
    it('should be the identity', () => {
      const codec = E.encoder.literal('a')
      assert.deepStrictEqual(codec.encode('a'), 'a')
    })
  })

  describe('literals', () => {
    it('should be the identity', () => {
      const codec = E.encoder.literals(['a', null])
      assert.deepStrictEqual(codec.encode('a'), 'a')
      assert.deepStrictEqual(codec.encode(null), null)
    })
  })
})
