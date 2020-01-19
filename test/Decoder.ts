import * as assert from 'assert'
import * as E from 'fp-ts/lib/Either'
import * as D from '../src/Decoder'
import * as DE from '../src/DecodeError'

describe.only('Decoder', () => {
  describe('string', () => {
    it('should decode a valid input', () => {
      const decoder = D.string
      assert.deepStrictEqual(decoder('a'), E.right('a'))
    })

    it('should reject an invalid input', () => {
      const decoder = D.string
      assert.deepStrictEqual(decoder(null), E.left(DE.decodeError('string', null)))
    })
  })

  describe('number', () => {
    it('should decode a valid input', () => {
      const decoder = D.number
      assert.deepStrictEqual(decoder(1), E.right(1))
    })

    it('should reject an invalid input', () => {
      const decoder = D.number
      assert.deepStrictEqual(decoder(null), E.left(DE.decodeError('number', null)))
    })
  })

  describe('boolean', () => {
    it('should decode a valid input', () => {
      const decoder = D.boolean
      assert.deepStrictEqual(decoder(true), E.right(true))
      assert.deepStrictEqual(decoder(false), E.right(false))
    })

    it('should reject an invalid input', () => {
      const decoder = D.boolean
      assert.deepStrictEqual(decoder(null), E.left(DE.decodeError('boolean', null)))
    })
  })

  describe('literal', () => {
    it('should decode a valid input', () => {
      const decoder = D.literal('a')
      assert.deepStrictEqual(decoder('a'), E.right('a'))
    })

    it('should reject an invalid input', () => {
      const decoder = D.literal('a')
      assert.deepStrictEqual(decoder('b'), E.left(DE.decodeError('"a"', 'b')))
    })
  })

  describe('type', () => {
    it('should decode a valid input', () => {
      const decoder = D.type({
        a: D.string
      })
      assert.deepStrictEqual(decoder({ a: 'a' }), E.right({ a: 'a' }))
    })

    it('should strip additional fields', () => {
      const decoder = D.type({
        a: D.string
      })
      assert.deepStrictEqual(decoder({ a: 'a', b: 1 }), E.right({ a: 'a' }))
    })

    it('should reject an invalid input', () => {
      const decoder = D.type({
        a: D.string
      })
      assert.deepStrictEqual(
        decoder({ a: 1 }),
        E.left(DE.decodeError('object', { a: 1 }, DE.labeledProduct([['a', DE.decodeError('string', 1)]])))
      )
    })
  })

  describe('partial', () => {
    it('should decode a valid input', () => {
      const decoder = D.partial({
        a: D.string
      })
      assert.deepStrictEqual(decoder({ a: 'a' }), E.right({ a: 'a' }))
      assert.deepStrictEqual(decoder({}), E.right({}))
    })

    it('should strip additional fields', () => {
      const decoder = D.partial({
        a: D.string
      })
      assert.deepStrictEqual(decoder({ a: 'a', b: 1 }), E.right({ a: 'a' }))
    })

    it('should reject an invalid input', () => {
      const decoder = D.partial({
        a: D.string
      })
      assert.deepStrictEqual(
        decoder({ a: 1 }),
        E.left(DE.decodeError('partial', { a: 1 }, DE.labeledProduct([['a', DE.decodeError('string', 1)]])))
      )
    })
  })

  describe('record', () => {
    it('should decode a valid value', () => {
      const decoder = D.record(D.number)
      assert.deepStrictEqual(decoder({}), E.right({}))
      assert.deepStrictEqual(decoder({ a: 1 }), E.right({ a: 1 }))
    })

    it('should reject an invalid value', () => {
      const decoder = D.record(D.number)
      assert.deepStrictEqual(
        decoder({ a: 'a' }),
        E.left(DE.decodeError('record', { a: 'a' }, DE.labeledProduct([['a', DE.decodeError('number', 'a')]])))
      )
    })
  })

  describe('array', () => {
    it('should decode a valid input', () => {
      const decoder = D.array(D.string)
      assert.deepStrictEqual(decoder([]), E.right([]))
      assert.deepStrictEqual(decoder(['a']), E.right(['a']))
    })

    it('should reject an invalid input', () => {
      const decoder = D.array(D.string)
      assert.deepStrictEqual(
        decoder([1]),
        E.left(DE.decodeError('array', [1], DE.indexedProduct([[0, DE.decodeError('string', 1)]])))
      )
    })
  })

  describe('tuple', () => {
    it('should decode a valid input', () => {
      const decoder = D.tuple([D.string, D.number])
      assert.deepStrictEqual(decoder(['a', 1]), E.right(['a', 1]))
    })

    it('should strip additional components', () => {
      const decoder = D.tuple([D.string, D.number])
      assert.deepStrictEqual(decoder(['a', 1, true]), E.right(['a', 1]))
    })

    it('should reject an invalid input', () => {
      const decoder = D.tuple([D.string, D.number])
      assert.deepStrictEqual(
        decoder(['a']),
        E.left(DE.decodeError('tuple', ['a'], DE.indexedProduct([[1, DE.decodeError('number', undefined)]])))
      )
    })
  })

  describe('intersection', () => {
    it('should decode a valid input', () => {
      const decoder = D.intersection([D.type({ a: D.string }), D.type({ b: D.number })])
      assert.deepStrictEqual(decoder({ a: 'a', b: 1 }), E.right({ a: 'a', b: 1 }))
    })

    it('should reject an invalid input', () => {
      const decoder = D.intersection([D.type({ a: D.string }), D.type({ b: D.number })])
      assert.deepStrictEqual(
        decoder({ a: 'a' }),
        E.left(
          DE.decodeError(
            'intersection',
            { a: 'a' },
            DE.and([
              DE.decodeError('object', { a: 'a' }, DE.labeledProduct([['b', DE.decodeError('number', undefined)]]))
            ])
          )
        )
      )
    })
  })

  describe('union', () => {
    it('should decode a valid input', () => {
      const decoder = D.union([D.string, D.number])
      assert.deepStrictEqual(decoder('a'), E.right('a'))
      assert.deepStrictEqual(decoder(1), E.right(1))
    })

    it('should reject an invalid input', () => {
      const decoder = D.union([D.string, D.number])
      assert.deepStrictEqual(
        decoder(true),
        E.left(DE.decodeError('union', true, DE.or([DE.decodeError('string', true), DE.decodeError('number', true)])))
      )
    })
  })
})
