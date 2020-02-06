import * as assert from 'assert'
import * as E from '../src/Encoder'
import * as C from '../src/Compat'
import * as D from '../src/Decoder'
import * as G from '../src/Guard'
import * as CT from './Codec'
import { right, left } from 'fp-ts/lib/Either'
import * as DE from '../src/DecodeError'

export const NumberFromString: C.Compat<number> = C.make(
  G.number.is,
  CT.NumberFromString.decode,
  CT.NumberFromString.encode
)

interface PositiveBrand {
  readonly Positive: unique symbol
}
type Positive = number & PositiveBrand
const Positive: C.Compat<Positive> = C.make(
  G.refinement(G.number, n => (n > 0 ? right(n as Positive) : left('Positive'))).is,
  D.parse(C.number, n => (n > 0 ? right(n as Positive) : left('Positive'))).decode,
  E.id.encode
)

interface IntBrand {
  readonly Int: unique symbol
}
type Int = number & IntBrand
const Int: C.Compat<Int> = C.make(
  G.refinement(G.number, n => (Number.isInteger(n) ? right(n as Int) : left('Int'))).is,
  D.parse(C.number, n => (Number.isInteger(n) ? right(n as Int) : left('Int'))).decode,
  E.id.encode
)

describe('Codec', () => {
  describe('string', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.string
        assert.deepStrictEqual(codec.decode('a'), right('a'))
      })

      it('should reject an invalid input', () => {
        const codec = C.string
        assert.deepStrictEqual(codec.decode(null), left(DE.leaf(null, 'string')))
      })
    })
  })

  describe('number', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.number
        assert.deepStrictEqual(codec.decode(1), right(1))
      })

      it('should reject an invalid input', () => {
        const codec = C.number
        assert.deepStrictEqual(codec.decode(null), left(DE.leaf(null, 'number')))
      })
    })
  })

  describe('boolean', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.boolean
        assert.deepStrictEqual(codec.decode(true), right(true))
        assert.deepStrictEqual(codec.decode(false), right(false))
      })

      it('should reject an invalid input', () => {
        const codec = C.boolean
        assert.deepStrictEqual(codec.decode(null), left(DE.leaf(null, 'boolean')))
      })
    })
  })

  describe('literals', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.literals(['a', null])
        assert.deepStrictEqual(codec.decode('a'), right('a'))
        assert.deepStrictEqual(codec.decode(null), right(null))
      })

      it('should reject an invalid input', () => {
        const codec = C.literals(['a', null])
        assert.deepStrictEqual(codec.decode('b'), left(DE.leaf('b')))
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = E.encoder.literals(['a', null])
        assert.deepStrictEqual(codec.encode('a'), 'a')
        assert.deepStrictEqual(codec.encode(null), null)
      })
    })
  })

  describe('literalsOr', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.literalsOr(['a', null], NumberFromString)
        assert.deepStrictEqual(codec.decode('a'), right('a'))
        assert.deepStrictEqual(codec.decode(null), right(null))
        assert.deepStrictEqual(codec.decode('2'), right(2))
      })

      it('should reject an invalid input', () => {
        const codec = C.literalsOr(['a', null], NumberFromString)
        assert.deepStrictEqual(codec.decode(2), left(DE.or(2, [DE.leaf(2), DE.leaf(2, 'string')])))
        assert.deepStrictEqual(
          codec.decode('b'),
          left(DE.or('b', [DE.leaf('b'), DE.leaf('b', 'NumberFromString', 'not a number')]))
        )
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.literalsOr(['a', null], NumberFromString)
        assert.deepStrictEqual(codec.encode('a'), 'a')
        assert.deepStrictEqual(codec.encode(null), null)
        assert.deepStrictEqual(codec.encode(2), '2')
      })
    })
  })

  describe('refinement', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.refinement(C.string, s => (s.length > 0 ? right(s) : left('please entere a non empty string')))
        assert.deepStrictEqual(codec.decode('a'), right('a'))
      })

      it('should reject an invalid input', () => {
        const codec = C.refinement(C.string, s => (s.length > 0 ? right(s) : left('please entere a non empty string')))
        assert.deepStrictEqual(codec.decode(undefined), left(DE.leaf(undefined, 'string')))
        assert.deepStrictEqual(codec.decode(''), left(DE.leaf('', undefined, 'please entere a non empty string')))
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.refinement(C.string, s => (s.length > 0 ? right(s) : left('please entere a non empty string')))
        assert.strictEqual(codec.encode('a'), 'a')
      })
    })
  })

  describe('type', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.type({
          a: C.string
        })
        assert.deepStrictEqual(codec.decode({ a: 'a' }), right({ a: 'a' }))
      })

      it('should strip additional fields', () => {
        const codec = C.type({
          a: C.string
        })
        assert.deepStrictEqual(codec.decode({ a: 'a', b: 1 }), right({ a: 'a' }))
      })

      it('should reject an invalid input', () => {
        const codec = C.type({
          a: C.string
        })
        assert.deepStrictEqual(codec.decode(undefined), left(DE.leaf(undefined, 'Record<string, unknown>')))
        assert.deepStrictEqual(codec.decode({ a: 1 }), left(DE.labeled({ a: 1 }, [['a', DE.leaf(1, 'string')]])))
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.type({ a: NumberFromString })
        assert.deepStrictEqual(codec.encode({ a: 1 }), { a: '1' })
      })

      it('should strip additional fields', () => {
        const codec = C.type({ a: C.number })
        const a = { a: 1, b: true }
        assert.deepStrictEqual(codec.encode(a), { a: 1 })
      })
    })
  })

  describe('partial', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.partial({ a: C.string })
        assert.deepStrictEqual(codec.decode({ a: 'a' }), right({ a: 'a' }))
        assert.deepStrictEqual(codec.decode({}), right({}))
      })

      it('should strip additional fields', () => {
        const codec = C.partial({ a: C.string })
        assert.deepStrictEqual(codec.decode({ a: 'a', b: 1 }), right({ a: 'a' }))
      })

      it('should not add missing fields', () => {
        const codec = C.partial({ a: C.string })
        assert.deepStrictEqual(codec.decode({}), right({}))
      })

      it('should not strip undefined fields', () => {
        const codec = C.partial({ a: C.string })
        assert.deepStrictEqual(codec.decode({ a: undefined }), right({ a: undefined }))
      })

      it('should reject an invalid input', () => {
        const codec = C.partial({ a: C.string })
        assert.deepStrictEqual(codec.decode(undefined), left(DE.leaf(undefined, 'Record<string, unknown>')))
        assert.deepStrictEqual(codec.decode({ a: 1 }), left(DE.labeled({ a: 1 }, [['a', DE.leaf(1, 'string')]])))
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.partial({ a: NumberFromString })
        assert.deepStrictEqual(codec.encode({}), {})
        assert.deepStrictEqual(codec.encode({ a: 1 }), { a: '1' })
      })

      it('should strip additional fields', () => {
        const codec = C.partial({ a: C.string })
        const a = { a: 'a', b: true }
        assert.deepStrictEqual(codec.encode(a), { a: 'a' })
      })

      it('should not add missing fields', () => {
        const codec = C.partial({ a: C.string })
        assert.deepStrictEqual(codec.encode({}), {})
      })

      it('should not strip undefined fields', () => {
        const codec = C.partial({ a: C.string })
        assert.deepStrictEqual(codec.encode({ a: undefined }), { a: undefined })
      })
    })
  })

  describe('record', () => {
    describe('decode', () => {
      it('should decode a valid value', () => {
        const codec = C.record(C.number)
        assert.deepStrictEqual(codec.decode({}), right({}))
        assert.deepStrictEqual(codec.decode({ a: 1 }), right({ a: 1 }))
      })

      it('should reject an invalid value', () => {
        const codec = C.record(C.number)
        assert.deepStrictEqual(codec.decode(undefined), left(DE.leaf(undefined, 'Record<string, unknown>')))
        assert.deepStrictEqual(codec.decode({ a: 'a' }), left(DE.labeled({ a: 'a' }, [['a', DE.leaf('a', 'number')]])))
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.record(NumberFromString)
        assert.deepStrictEqual(codec.encode({ a: 1, b: 2 }), { a: '1', b: '2' })
      })
    })
  })

  describe('array', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.array(C.string)
        assert.deepStrictEqual(codec.decode([]), right([]))
        assert.deepStrictEqual(codec.decode(['a']), right(['a']))
      })

      it('should reject an invalid input', () => {
        const codec = C.array(C.string)
        assert.deepStrictEqual(codec.decode(undefined), left(DE.leaf(undefined, 'Array<unknown>')))
        assert.deepStrictEqual(codec.decode([1]), left(DE.indexed([1], [[0, DE.leaf(1, 'string')]])))
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.array(NumberFromString)
        assert.deepStrictEqual(codec.encode([1, 2]), ['1', '2'])
      })
    })
  })

  describe('tuple', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.tuple([C.string, C.number])
        assert.deepStrictEqual(codec.decode(['a', 1]), right(['a', 1]))
      })

      it('should strip additional components', () => {
        const codec = C.tuple([C.string, C.number])
        assert.deepStrictEqual(codec.decode(['a', 1, true]), right(['a', 1]))
      })

      it('should reject an invalid input', () => {
        const codec = C.tuple([C.string, C.number])
        assert.deepStrictEqual(codec.decode(undefined), left(DE.leaf(undefined, 'Array<unknown>')))
        assert.deepStrictEqual(codec.decode(['a']), left(DE.indexed(['a'], [[1, DE.leaf(undefined, 'number')]])))
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.tuple([NumberFromString, C.string])
        assert.deepStrictEqual(codec.encode([1, 'a']), ['1', 'a'])
      })
    })
  })

  describe('intersection', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.intersection([C.type({ a: C.string }), C.type({ b: C.number })])
        assert.deepStrictEqual(codec.decode({ a: 'a', b: 1 }), right({ a: 'a', b: 1 }))
      })

      it('should handle primitives', () => {
        const codec = C.intersection([Int, Positive])
        assert.deepStrictEqual(codec.decode(1), right(1))
      })

      it('should reject an invalid input', () => {
        const codec = C.intersection([C.type({ a: C.string }), C.type({ b: C.number })])
        assert.deepStrictEqual(
          codec.decode({ a: 'a' }),
          left(DE.and({ a: 'a' }, [DE.labeled({ a: 'a' }, [['b', DE.leaf(undefined, 'number')]])]))
        )
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.intersection([C.type({ a: C.string }), C.type({ b: NumberFromString })])
        assert.deepStrictEqual(codec.encode({ a: 'a', b: 1 }), { a: 'a', b: '1' })
      })

      it('should handle primitives', () => {
        const codec = C.intersection([Int, Positive])
        assert.deepStrictEqual(codec.encode(1 as any), 1)
      })
    })
  })

  describe('sum', () => {
    const sum = C.sum('_tag')

    describe('decode', () => {
      it('should decode a valid input', () => {
        const A = C.type({ _tag: C.literals(['A']), a: C.string })
        const B = C.type({ _tag: C.literals(['B']), b: C.number })
        const codec = sum({ A, B })
        assert.deepStrictEqual(codec.decode({ _tag: 'A', a: 'a' }), right({ _tag: 'A', a: 'a' }))
        assert.deepStrictEqual(codec.decode({ _tag: 'B', b: 1 }), right({ _tag: 'B', b: 1 }))
      })

      it('should reject an invalid input', () => {
        const A = C.type({ _tag: C.literals(['A']), a: C.string })
        const B = C.type({ _tag: C.literals(['B']), b: C.number })
        const codec = sum({ A, B })
        assert.deepStrictEqual(codec.decode(null), left(DE.leaf(null, 'Record<string, unknown>')))
        assert.deepStrictEqual(
          codec.decode({}),
          left(DE.labeled({}, [['_tag', DE.leaf(undefined, undefined, '"A" | "B"')]]))
        )
        assert.deepStrictEqual(
          codec.decode({ _tag: 'A', a: 1 }),
          left(DE.labeled({ _tag: 'A', a: 1 }, [['a', DE.leaf(1, 'string')]]))
        )
      })

      it('should support empty records', () => {
        const decoder = sum({})
        assert.deepStrictEqual(decoder.decode({}), left(DE.leaf({}, 'never')))
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const A = C.type({ _tag: C.literals(['A']), a: C.string })
        const B = C.type({ _tag: C.literals(['B']), b: NumberFromString })
        const codec = sum({ A, B })
        assert.deepStrictEqual(codec.encode({ _tag: 'A', a: 'a' }), { _tag: 'A', a: 'a' })
        assert.deepStrictEqual(codec.encode({ _tag: 'B', b: 1 }), { _tag: 'B', b: '1' })
      })
    })
  })

  describe('lazy', () => {
    interface A {
      a: number
      b: null | A
    }

    const codec: C.Compat<A> = C.lazy('A', () =>
      C.type({
        a: NumberFromString,
        b: C.literalsOr([null], codec)
      })
    )

    describe('decode', () => {
      it('should decode a valid input', () => {
        assert.deepStrictEqual(codec.decode({ a: '1', b: null }), right({ a: 1, b: null }))
        assert.deepStrictEqual(codec.decode({ a: '1', b: { a: '2', b: null } }), right({ a: 1, b: { a: 2, b: null } }))
      })

      it('should reject an invalid input', () => {
        assert.deepStrictEqual(
          codec.decode({ a: 1, b: null }),
          left(DE.labeled({ a: 1, b: null }, [['a', DE.leaf(1, 'string')]], 'A'))
        )
        assert.deepStrictEqual(
          codec.decode({ a: 'a', b: null }),
          left(DE.labeled({ a: 'a', b: null }, [['a', DE.leaf('a', 'NumberFromString', 'not a number')]], 'A'))
        )
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        assert.deepStrictEqual(codec.encode({ a: 1, b: null }), { a: '1', b: null })
        assert.deepStrictEqual(codec.encode({ a: 1, b: { a: 2, b: null } }), { a: '1', b: { a: '2', b: null } })
      })
    })
  })

  describe('union', () => {
    describe('encode', () => {
      it('should encode a value', () => {
        const compat = C.union([C.string, C.number])
        assert.deepStrictEqual(compat.encode('a'), 'a')
        assert.deepStrictEqual(compat.encode(1), 1)
      })
    })
  })
})
