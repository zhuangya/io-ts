import * as assert from 'assert'
import { left, right } from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Tree'
import * as Co from '../src/Codec'
import * as C from '../src/Compat'
import * as D from '../src/Decoder'
import * as G from '../src/Guard'

const NumberFromString: C.Compat<number> = C.make(
  Co.make(
    D.parse(D.string, s => {
      const n = parseFloat(s)
      return isNaN(n) ? left('NumberFromString') : right(n)
    }),
    { encode: String }
  ),
  G.number
)

interface PositiveBrand {
  readonly Positive: unique symbol
}
type Positive = number & PositiveBrand
const Positive: C.Compat<Positive> = C.refinement(C.number, (n): n is Positive => n > 0, 'Positive')

interface IntBrand {
  readonly Int: unique symbol
}
type Int = number & IntBrand
const Int: C.Compat<Int> = C.refinement(C.number, (n): n is Int => Number.isInteger(n), 'Int')

describe('Compat', () => {
  describe('string', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.string
        assert.deepStrictEqual(codec.decode('a'), right('a'))
      })

      it('should reject an invalid input', () => {
        const codec = C.string
        assert.deepStrictEqual(codec.decode(null), left([T.make('cannot decode null, should be string')]))
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
        assert.deepStrictEqual(codec.decode(null), left([T.make('cannot decode null, should be number')]))
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
        assert.deepStrictEqual(codec.decode(null), left([T.make('cannot decode null, should be boolean')]))
      })
    })
  })

  describe('literal', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.literal('a', null, 'b', 1, true)
        assert.deepStrictEqual(codec.decode('a'), right('a'))
        assert.deepStrictEqual(codec.decode(null), right(null))
      })

      it('should reject an invalid input', () => {
        const codec = C.literal('a', null)
        assert.deepStrictEqual(codec.decode('b'), left([T.make('cannot decode "b", should be "a" | null')]))
      })

      it('should handle zero members', () => {
        assert.deepStrictEqual(C.literal().decode({}), left([T.make('cannot decode {}, should be never')]))
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.literal('a')
        assert.deepStrictEqual(codec.encode('a'), 'a')
      })
    })
  })

  describe('refinement', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.refinement(C.string, (s): s is string => s.length > 0, 'NonEmptyString')
        assert.deepStrictEqual(codec.decode('a'), right('a'))
      })

      it('should reject an invalid input', () => {
        const codec = C.refinement(C.string, (s): s is string => s.length > 0, 'NonEmptyString')
        assert.deepStrictEqual(codec.decode(undefined), left([T.make('cannot decode undefined, should be string')]))
        assert.deepStrictEqual(codec.decode(''), left([T.make('cannot refine "", should be NonEmptyString')]))
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.refinement(C.string, (s): s is string => s.length > 0, 'NonEmptyString')
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
        assert.deepStrictEqual(
          codec.decode(undefined),
          left([T.make('cannot decode undefined, should be Record<string, unknown>')])
        )
        assert.deepStrictEqual(
          codec.decode({ a: 1 }),
          left([T.make('required property "a"', [T.make('cannot decode 1, should be string')])])
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
        assert.deepStrictEqual(
          codec.decode(undefined),
          left([T.make('cannot decode undefined, should be Record<string, unknown>')])
        )
        assert.deepStrictEqual(
          codec.decode({ a: 1 }),
          left([T.make('optional property "a"', [T.make('cannot decode 1, should be string')])])
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
        assert.deepStrictEqual(
          codec.decode(undefined),
          left([T.make('cannot decode undefined, should be Record<string, unknown>')])
        )
        assert.deepStrictEqual(
          codec.decode({ a: 'a' }),
          left([T.make('key "a"', [T.make('cannot decode "a", should be number')])])
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
        assert.deepStrictEqual(
          codec.decode(undefined),
          left([T.make('cannot decode undefined, should be Array<unknown>')])
        )
        assert.deepStrictEqual(
          codec.decode([1]),
          left([T.make('item 0', [T.make('cannot decode 1, should be string')])])
        )
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
        const codec = C.tuple(C.string, C.number)
        assert.deepStrictEqual(codec.decode(['a', 1]), right(['a', 1]))
      })

      it('should handle zero components', () => {
        assert.deepStrictEqual(C.tuple().decode([]), right([]))
      })

      it('should reject an invalid input', () => {
        const codec = C.tuple(C.string, C.number)
        assert.deepStrictEqual(
          codec.decode(undefined),
          left([T.make('cannot decode undefined, should be Array<unknown>')])
        )
        assert.deepStrictEqual(
          codec.decode(['a']),
          left([T.make('component 1', [T.make('cannot decode undefined, should be number')])])
        )
        assert.deepStrictEqual(
          codec.decode([1, 2]),
          left([T.make('component 0', [T.make('cannot decode 1, should be string')])])
        )
      })

      it('should fail with additional components', () => {
        const codec = C.tuple(C.string, C.number)
        assert.deepStrictEqual(codec.decode(['a', 1, true]), left([T.make('should not have more than 2 items')]))
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.tuple(NumberFromString, C.string)
        assert.deepStrictEqual(codec.encode([1, 'a']), ['1', 'a'])
      })
    })
  })

  describe('intersection', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.intersection(C.type({ a: C.string }), C.type({ b: C.number }))
        assert.deepStrictEqual(codec.decode({ a: 'a', b: 1 }), right({ a: 'a', b: 1 }))
      })

      it('should handle primitives', () => {
        const codec = C.intersection(Int, Positive)
        assert.deepStrictEqual(codec.decode(1), right(1))
      })

      it('should reject an invalid input', () => {
        const codec = C.intersection(C.type({ a: C.string }), C.type({ b: C.number }))
        assert.deepStrictEqual(
          codec.decode({ a: 'a' }),
          left([T.make('required property "b"', [T.make('cannot decode undefined, should be number')])])
        )
        assert.deepStrictEqual(
          codec.decode({ b: 1 }),
          left([T.make('required property "a"', [T.make('cannot decode undefined, should be string')])])
        )
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.intersection(C.type({ a: C.string }), C.type({ b: NumberFromString }))
        assert.deepStrictEqual(codec.encode({ a: 'a', b: 1 }), { a: 'a', b: '1' })
      })

      it('should handle primitives', () => {
        const codec = C.intersection(Int, Positive)
        assert.deepStrictEqual(codec.encode(1 as any), 1)
      })
    })
  })

  describe('sum', () => {
    const sum = C.sum('_tag')

    describe('decode', () => {
      it('should decode a valid input', () => {
        const A = C.type({ _tag: C.literal('A'), a: C.string })
        const B = C.type({ _tag: C.literal('B'), b: C.number })
        const codec = sum({ A, B })
        assert.deepStrictEqual(codec.decode({ _tag: 'A', a: 'a' }), right({ _tag: 'A', a: 'a' }))
        assert.deepStrictEqual(codec.decode({ _tag: 'B', b: 1 }), right({ _tag: 'B', b: 1 }))
      })

      it('should reject an invalid input', () => {
        const A = C.type({ _tag: C.literal('A'), a: C.string })
        const B = C.type({ _tag: C.literal('B'), b: C.number })
        const codec = sum({ A, B })
        assert.deepStrictEqual(
          codec.decode(null),
          left([T.make('cannot decode null, should be Record<string, unknown>')])
        )
        assert.deepStrictEqual(
          codec.decode({}),
          left([T.make('required property "_tag"', [T.make('cannot decode undefined, should be "A" | "B"')])])
        )
        assert.deepStrictEqual(
          codec.decode({ _tag: 'A', a: 1 }),
          left([T.make('required property "a"', [T.make('cannot decode 1, should be string')])])
        )
      })

      it('should handle zero members', () => {
        assert.deepStrictEqual(C.sum('_tag')({}).decode({}), left([T.make('cannot decode {}, should be never')]))
      })

      it('should support empty records', () => {
        const decoder = sum({})
        assert.deepStrictEqual(decoder.decode({}), left([T.make('cannot decode {}, should be never')]))
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const A = C.type({ _tag: C.literal('A'), a: C.string })
        const B = C.type({ _tag: C.literal('B'), b: NumberFromString })
        const codec = sum({ A, B })
        assert.deepStrictEqual(codec.encode({ _tag: 'A', a: 'a' }), { _tag: 'A', a: 'a' })
        assert.deepStrictEqual(codec.encode({ _tag: 'B', b: 1 }), { _tag: 'B', b: '1' })
      })
    })
  })

  describe('lazy', () => {
    interface A {
      a: number
      b?: A
    }

    const codec: C.Compat<A> = C.lazy('A', () =>
      C.intersection(C.type({ a: NumberFromString }), C.partial({ b: codec }))
    )

    describe('decode', () => {
      it('should decode a valid input', () => {
        assert.deepStrictEqual(codec.decode({ a: '1' }), right({ a: 1 }))
        assert.deepStrictEqual(codec.decode({ a: '1', b: { a: '2' } }), right({ a: 1, b: { a: 2 } }))
      })

      it('should reject an invalid input', () => {
        assert.deepStrictEqual(
          codec.decode({ a: 1 }),
          left([T.make('A', [T.make('required property "a"', [T.make('cannot decode 1, should be string')])])])
        )
        assert.deepStrictEqual(
          codec.decode({ a: 'a' }),
          left([T.make('A', [T.make('required property "a"', [T.make('NumberFromString')])])])
        )
        assert.deepStrictEqual(
          codec.decode({ a: '1', b: {} }),
          left([
            T.make('A', [
              T.make('optional property "b"', [
                T.make('A', [T.make('required property "a"', [T.make('cannot decode undefined, should be string')])])
              ])
            ])
          ])
        )
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        assert.deepStrictEqual(codec.encode({ a: 1 }), { a: '1' })
        assert.deepStrictEqual(codec.encode({ a: 1, b: { a: 2 } }), { a: '1', b: { a: '2' } })
      })
    })
  })

  describe('union', () => {
    describe('encode', () => {
      it('should encode a value', () => {
        const compat = C.union(C.string, C.number, C.boolean)
        assert.deepStrictEqual(compat.encode('a'), 'a')
        assert.deepStrictEqual(compat.encode(1), 1)
        assert.deepStrictEqual(compat.encode(true), true)
      })
    })
  })
})
