import * as assert from 'assert'
import * as E from 'fp-ts/lib/Either'
import * as C from '../src/Codec'
import * as DE from '../src/DecodeError'
import * as D from '../src/Decoder'

describe('Decoder', () => {
  describe('Int', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.Int
        assert.deepStrictEqual(codec.decode(1), E.right(1))
      })

      it('should reject an invalid input', () => {
        const codec = C.Int
        assert.deepStrictEqual(codec.decode(null), E.left(DE.leaf('number', null)))
        assert.deepStrictEqual(codec.decode('1'), E.left(DE.leaf('number', '1')))
        assert.deepStrictEqual(codec.decode(1.2), E.left(DE.leaf('Int', 1.2)))
      })
    })
  })

  describe('union', () => {
    it('should decode a valid input', () => {
      const codec = D.union([C.string, C.number])
      assert.deepStrictEqual(codec.decode('a'), E.right('a'))
      assert.deepStrictEqual(codec.decode(1), E.right(1))
    })

    it('should reject an invalid input', () => {
      const codec = D.union([C.string, C.number])
      assert.deepStrictEqual(
        codec.decode(true),
        E.left(DE.or('union', true, [DE.leaf('string', true), DE.leaf('number', true)]))
      )
    })

    it('should handle empty unions', () => {
      const codec = D.union([] as any)
      assert.deepStrictEqual(codec.decode('a'), E.left(DE.leaf('empty union', 'a')))
    })
  })
})
