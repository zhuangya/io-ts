import * as assert from 'assert'
import { left, right } from 'fp-ts/lib/Either'
import * as C from '../src/Codec'
import * as D from '../src/Decoder'
import * as DE from '../src/DecodeError'

const NumberFromString: C.Codec<number> = C.make(
  D.parse(D.string, s => {
    const n = parseFloat(s)
    return isNaN(n) ? left('NumberFromString') : right(n)
  }),
  { encode: String }
)

interface PositiveBrand {
  readonly Positive: unique symbol
}
type Positive = number & PositiveBrand
const Positive = C.parse(C.number, n => (n > 0 ? right(n as Positive) : left('Positive')))

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

  describe('string', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.string
        assert.deepStrictEqual(codec.decode('a'), right('a'))
      })

      it('should reject an invalid input', () => {
        const codec = C.string
        assert.deepStrictEqual(codec.decode(null), left(DE.leaf('string', null)))
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
        assert.deepStrictEqual(codec.decode(null), left(DE.leaf('number', null)))
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
        assert.deepStrictEqual(codec.decode(null), left(DE.leaf('boolean', null)))
      })
    })
  })

  describe('constants', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.constants(['a', null])
        assert.deepStrictEqual(codec.decode('a'), right('a'))
        assert.deepStrictEqual(codec.decode(null), right(null))
      })

      it('should reject an invalid input', () => {
        const codec = C.constants(['a', undefined])
        assert.deepStrictEqual(codec.decode('b'), left(DE.leaf('"a" | undefined', 'b')))
      })
    })
  })

  describe('constantsOr', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.constantsOr([null, undefined], NumberFromString)
        assert.deepStrictEqual(codec.decode(null), right(null))
        assert.deepStrictEqual(codec.decode(undefined), right(undefined))
        assert.deepStrictEqual(codec.decode('2'), right(2))
      })

      it('should reject an invalid input', () => {
        const codec = C.constantsOr([null, undefined], NumberFromString)
        assert.deepStrictEqual(
          codec.decode(2),
          left(DE.or('union', 2, [DE.leaf('null | undefined', 2), DE.leaf('string', 2)]))
        )
        assert.deepStrictEqual(
          codec.decode('a'),
          left(DE.or('union', 'a', [DE.leaf('null | undefined', 'a'), DE.leaf('NumberFromString', 'a')]))
        )
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.constantsOr([null, undefined], NumberFromString)
        assert.deepStrictEqual(codec.encode(null), null)
        assert.deepStrictEqual(codec.encode(undefined), undefined)
        assert.deepStrictEqual(codec.encode(2), '2')
      })
    })
  })

  describe('withExpected', () => {
    describe('decode', () => {
      it('should, return the provided name', () => {
        const codec = C.withExpected(C.number, 'mynumber')
        assert.deepStrictEqual(codec.decode('a'), left(DE.leaf('mynumber', 'a')))
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
        assert.deepStrictEqual(codec.decode(undefined), left(DE.leaf('Record<string, unknown>', undefined)))
        assert.deepStrictEqual(
          codec.decode({ a: 1 }),
          left(DE.labeled('type', { a: 1 }, [['a', DE.leaf('string', 1)]]))
        )
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
        const codec = C.partial({
          a: C.string
        })
        assert.deepStrictEqual(codec.decode({ a: 'a' }), right({ a: 'a' }))
        assert.deepStrictEqual(codec.decode({}), right({}))
      })

      it('should strip additional fields', () => {
        const codec = C.partial({
          a: C.string
        })
        assert.deepStrictEqual(codec.decode({ a: 'a', b: 1 }), right({ a: 'a' }))
      })

      it('should reject an invalid input', () => {
        const codec = C.partial({
          a: C.string
        })
        assert.deepStrictEqual(codec.decode(undefined), left(DE.leaf('Record<string, unknown>', undefined)))
        assert.deepStrictEqual(
          codec.decode({ a: 1 }),
          left(DE.labeled('partial', { a: 1 }, [['a', DE.leaf('string', 1)]]))
        )
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.partial({ a: NumberFromString })
        assert.deepStrictEqual(codec.encode({}), {})
        assert.deepStrictEqual(codec.encode({ a: 1 }), { a: '1' })
      })

      it('should strip additional fields', () => {
        const codec = C.partial({ a: C.number })
        const a = { a: 1, b: true }
        assert.deepStrictEqual(codec.encode(a), { a: 1 })
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
        assert.deepStrictEqual(codec.decode(undefined), left(DE.leaf('Record<string, unknown>', undefined)))
        assert.deepStrictEqual(
          codec.decode({ a: 'a' }),
          left(DE.labeled('record', { a: 'a' }, [['a', DE.leaf('number', 'a')]]))
        )
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
        assert.deepStrictEqual(codec.decode(undefined), left(DE.leaf('Array<unknown>', undefined)))
        assert.deepStrictEqual(codec.decode([1]), left(DE.indexed('array', [1], [[0, DE.leaf('string', 1)]])))
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
        assert.deepStrictEqual(codec.decode(undefined), left(DE.leaf('Array<unknown>', undefined)))
        assert.deepStrictEqual(
          codec.decode(['a']),
          left(DE.indexed('tuple', ['a'], [[1, DE.leaf('number', undefined)]]))
        )
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
        const codec = C.intersection([C.Int, Positive])
        assert.deepStrictEqual(codec.decode(1), right(1))
      })

      it('should reject an invalid input', () => {
        const codec = C.intersection([C.type({ a: C.string }), C.type({ b: C.number })])
        assert.deepStrictEqual(
          codec.decode({ a: 'a' }),
          left(
            DE.and('intersection', { a: 'a' }, [DE.labeled('type', { a: 'a' }, [['b', DE.leaf('number', undefined)]])])
          )
        )
      })

      it('should handle empty intersections', () => {
        const codec = D.intersection([] as any)
        assert.deepStrictEqual(codec.decode('a'), right('a'))
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.intersection([C.type({ a: C.string }), C.type({ b: NumberFromString })])
        assert.deepStrictEqual(codec.encode({ a: 'a', b: 1 }), { a: 'a', b: '1' })
      })

      it('should handle primitives', () => {
        const codec = C.intersection([C.Int, C.Int])
        assert.deepStrictEqual(codec.encode(1 as any), 1)
      })
    })
  })

  describe('lazy', () => {
    interface Rec {
      a: number
      b: Array<Rec>
    }

    const codec: C.Codec<Rec> = C.lazy(() =>
      C.type({
        a: NumberFromString,
        b: C.array(codec)
      })
    )

    describe('decode', () => {
      it('should decode a valid input', () => {
        assert.deepStrictEqual(codec.decode({ a: '1', b: [] }), right({ a: 1, b: [] }))
        assert.deepStrictEqual(codec.decode({ a: '1', b: [{ a: '2', b: [] }] }), right({ a: 1, b: [{ a: 2, b: [] }] }))
      })

      it('should reject an invalid input', () => {
        assert.deepStrictEqual(codec.decode(null), left(DE.leaf('Record<string, unknown>', null)))
        assert.deepStrictEqual(
          codec.decode({}),
          left(
            DE.labeled('type', {}, [
              ['a', DE.leaf('string', undefined)],
              ['b', DE.leaf('Array<unknown>', undefined)]
            ])
          )
        )
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        assert.deepStrictEqual(codec.encode({ a: 1, b: [{ a: 2, b: [] }] }), { a: '1', b: [{ a: '2', b: [] }] })
      })
    })
  })

  describe('sum', () => {
    const sum = C.sum('_tag')

    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = sum({
          A: C.type({ _tag: C.constants(['A']), a: C.string }),
          B: C.type({ _tag: C.constants(['B']), b: C.number })
        })
        assert.deepStrictEqual(codec.decode({ _tag: 'A', a: 'a' }), right({ _tag: 'A', a: 'a' }))
        assert.deepStrictEqual(codec.decode({ _tag: 'B', b: 1 }), right({ _tag: 'B', b: 1 }))
      })

      it('should reject an invalid input', () => {
        const codec = sum({
          A: C.type({ _tag: C.constants(['A']), a: C.string }),
          B: C.type({ _tag: C.constants(['B']), b: C.number })
        })
        assert.deepStrictEqual(codec.decode(null), left(DE.leaf('Record<string, unknown>', null)))
        assert.deepStrictEqual(
          codec.decode({}),
          left(DE.labeled('sum', {}, [['_tag', DE.leaf('"A" | "B"', undefined)]]))
        )
        assert.deepStrictEqual(
          codec.decode({ _tag: 'A', a: 1 }),
          left(DE.labeled('type', { _tag: 'A', a: 1 }, [['a', DE.leaf('string', 1)]]))
        )
      })

      it('should support empty records', () => {
        const decoder = sum({})
        assert.deepStrictEqual(decoder.decode({}), left(DE.leaf('never', {})))
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = sum({
          A: C.type({ _tag: C.constants(['A']), a: C.string }),
          B: C.type({ _tag: C.constants(['B']), b: NumberFromString })
        })
        assert.deepStrictEqual(codec.encode({ _tag: 'A', a: 'a' }), { _tag: 'A', a: 'a' })
        assert.deepStrictEqual(codec.encode({ _tag: 'B', b: 1 }), { _tag: 'B', b: '1' })
      })
    })
  })
})
