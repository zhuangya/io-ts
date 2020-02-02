import * as assert from 'assert'
import * as E from '../src/Encoder'
import { right, left } from 'fp-ts/lib/Either'

describe('Encoder', () => {
  describe('encoder', () => {
    it('contramap', () => {
      const encoder = E.encoder.contramap(E.encoder.number, (s: string) => s.length)
      assert.deepStrictEqual(encoder.encode('aaa'), 3)
    })
  })

  it('literals', () => {
    const codec = E.encoder.literals(['a', null])
    assert.deepStrictEqual(codec.encode('a'), 'a')
    assert.deepStrictEqual(codec.encode(null), null)
  })

  it('refinement', () => {
    const encoder = E.refinement(E.string, s => (s === 'a' ? right<string, 'a'>(s) : left('"a"')))
    assert.strictEqual(encoder, E.string)
  })
})
