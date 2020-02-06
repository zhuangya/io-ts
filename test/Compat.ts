import * as assert from 'assert'
import * as C from '../src/Compat'
import * as CT from './Codec'
import { right, left } from 'fp-ts/lib/Either'
import * as DE from '../src/DecodeError'

describe('Compat', () => {
  describe('union', () => {
    describe('encode', () => {
      it('should encode a value', () => {
        const compat = C.union([C.string, C.number])
        assert.deepStrictEqual(compat.encode('a'), 'a')
        assert.deepStrictEqual(compat.encode(1), 1)
      })
    })
  })

  describe('lazy', () => {
    const NumberFromString: C.Compat<number> = C.make(
      C.number.is,
      CT.NumberFromString.decode,
      CT.NumberFromString.encode
    )

    interface Rec {
      a: number
      b: Array<Rec>
    }

    const compat: C.Compat<Rec> = C.lazy(() =>
      C.type({
        a: NumberFromString,
        b: C.array(compat)
      })
    )

    describe('decode', () => {
      it('should decode a valid input', () => {
        assert.deepStrictEqual(compat.decode({ a: '1', b: [] }), right({ a: 1, b: [] }))
        assert.deepStrictEqual(compat.decode({ a: '1', b: [{ a: '2', b: [] }] }), right({ a: 1, b: [{ a: 2, b: [] }] }))
      })

      it('should reject an invalid input', () => {
        assert.deepStrictEqual(compat.decode(null), left(DE.leaf(null, 'Record<string, unknown>')))
        assert.deepStrictEqual(
          compat.decode({}),
          left(
            DE.labeled({}, [
              ['a', DE.leaf(undefined, 'string')],
              ['b', DE.leaf(undefined, 'Array<unknown>')]
            ])
          )
        )
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        assert.deepStrictEqual(compat.encode({ a: 1, b: [{ a: 2, b: [] }] }), { a: '1', b: [{ a: '2', b: [] }] })
      })
    })
  })
})
