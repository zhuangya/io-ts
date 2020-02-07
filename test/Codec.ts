import * as assert from 'assert'
import { left, right } from 'fp-ts/lib/Either'
import * as C from '../src/Codec'
import * as D from '../src/Decoder'
import * as E from '../src/Encoder'
import * as DE from '../src/DecodeError'

interface PositiveBrand {
  readonly Positive: unique symbol
}
type Positive = number & PositiveBrand
const Positive = C.make(
  D.parse(C.number, n => (n > 0 ? right(n as Positive) : left('Positive'))),
  E.id
)

describe('Codec', () => {
  describe('codec', () => {
    it('imap', () => {
      const codec = C.codec.imap(
        C.string,
        s => ({ value: s }),
        ({ value }) => value
      )
      assert.deepStrictEqual(codec.decode('a'), right({ value: 'a' }))
      assert.deepStrictEqual(codec.encode({ value: 'a' }), 'a')
    })
  })

  describe('withMessage', () => {
    describe('decode', () => {
      it('should, return the provided name', () => {
        const codec = C.withMessage(C.number, () => 'please insert a number')
        assert.deepStrictEqual(codec.decode('a'), left(DE.leaf('a', 'number', 'please insert a number')))
      })
    })
  })
})
