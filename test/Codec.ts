import * as assert from 'assert'
import * as E from 'fp-ts/lib/Either'
import * as C from '../src/Codec'
import * as D from '../src/Decoder'
import * as G from '../src/Guard'
import * as DE from '../src/DecodeError'

const NumberFromString: C.Codec<number> = {
  decode: u => {
    const e = D.string.decode(u)
    if (E.isLeft(e)) {
      return E.left(DE.leaf('NumberFromString', u))
    } else {
      const s = e.right
      const n = parseFloat(s)
      return isNaN(n) ? E.left(DE.leaf('NumberFromString', u)) : E.right(n)
    }
  },
  encode: String,
  ...G.number
}

describe('Codec', () => {
  describe('codec', () => {
    it('imap', () => {
      const codec = C.codec.imap(
        C.string,
        s => ({ value: s }),
        ({ value }) => value
      )
      assert.deepStrictEqual(codec.decode('a'), E.right({ value: 'a' }))
      assert.deepStrictEqual(codec.encode({ value: 'a' }), 'a')
    })
  })

  describe('string', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.string
        assert.deepStrictEqual(codec.decode('a'), E.right('a'))
      })

      it('should reject an invalid input', () => {
        const codec = C.string
        assert.deepStrictEqual(codec.decode(null), E.left(DE.leaf('string', null)))
      })
    })
  })

  describe('number', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.number
        assert.deepStrictEqual(codec.decode(1), E.right(1))
      })

      it('should reject an invalid input', () => {
        const codec = C.number
        assert.deepStrictEqual(codec.decode(null), E.left(DE.leaf('number', null)))
      })
    })
  })

  describe('boolean', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.boolean
        assert.deepStrictEqual(codec.decode(true), E.right(true))
        assert.deepStrictEqual(codec.decode(false), E.right(false))
      })

      it('should reject an invalid input', () => {
        const codec = C.boolean
        assert.deepStrictEqual(codec.decode(null), E.left(DE.leaf('boolean', null)))
      })
    })
  })

  describe('literal', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.literal('a')
        assert.deepStrictEqual(codec.decode('a'), E.right('a'))
      })

      it('should reject an invalid input', () => {
        const codec = C.literal(undefined)
        assert.deepStrictEqual(codec.decode(null), E.left(DE.leaf('undefined', null)))
      })
    })
  })

  describe('literals', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.literals(['a', null])
        assert.deepStrictEqual(codec.decode('a'), E.right('a'))
        assert.deepStrictEqual(codec.decode(null), E.right(null))
      })

      it('should reject an invalid input', () => {
        const codec = C.literals(['a', undefined])
        assert.deepStrictEqual(codec.decode('b'), E.left(DE.leaf('"a" | undefined', 'b')))
      })
    })
  })

  describe('withExpected', () => {
    describe('decode', () => {
      it('should, return the provided name', () => {
        const codec = C.withExpected(C.number, 'mynumber')
        assert.deepStrictEqual(codec.decode('a'), E.left(DE.leaf('mynumber', 'a')))
      })
    })
  })

  describe('type', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.type({
          a: C.string
        })
        assert.deepStrictEqual(codec.decode({ a: 'a' }), E.right({ a: 'a' }))
      })

      it('should strip additional fields', () => {
        const codec = C.type({
          a: C.string
        })
        assert.deepStrictEqual(codec.decode({ a: 'a', b: 1 }), E.right({ a: 'a' }))
      })

      it('should reject an invalid input', () => {
        const codec = C.type({
          a: C.string
        })
        assert.deepStrictEqual(codec.decode(undefined), E.left(DE.leaf('Record<string, unknown>', undefined)))
        assert.deepStrictEqual(
          codec.decode({ a: 1 }),
          E.left(DE.labeled('type', { a: 1 }, [['a', DE.leaf('string', 1)]]))
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
        assert.deepStrictEqual(codec.decode({ a: 'a' }), E.right({ a: 'a' }))
        assert.deepStrictEqual(codec.decode({}), E.right({}))
      })

      it('should strip additional fields', () => {
        const codec = C.partial({
          a: C.string
        })
        assert.deepStrictEqual(codec.decode({ a: 'a', b: 1 }), E.right({ a: 'a' }))
      })

      it('should reject an invalid input', () => {
        const codec = C.partial({
          a: C.string
        })
        assert.deepStrictEqual(codec.decode(undefined), E.left(DE.leaf('Record<string, unknown>', undefined)))
        assert.deepStrictEqual(
          codec.decode({ a: 1 }),
          E.left(DE.labeled('partial', { a: 1 }, [['a', DE.leaf('string', 1)]]))
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
        assert.deepStrictEqual(codec.decode({}), E.right({}))
        assert.deepStrictEqual(codec.decode({ a: 1 }), E.right({ a: 1 }))
      })

      it('should reject an invalid value', () => {
        const codec = C.record(C.number)
        assert.deepStrictEqual(codec.decode(undefined), E.left(DE.leaf('Record<string, unknown>', undefined)))
        assert.deepStrictEqual(
          codec.decode({ a: 'a' }),
          E.left(DE.labeled('record', { a: 'a' }, [['a', DE.leaf('number', 'a')]]))
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
        assert.deepStrictEqual(codec.decode([]), E.right([]))
        assert.deepStrictEqual(codec.decode(['a']), E.right(['a']))
      })

      it('should reject an invalid input', () => {
        const codec = C.array(C.string)
        assert.deepStrictEqual(codec.decode(undefined), E.left(DE.leaf('Array<unknown>', undefined)))
        assert.deepStrictEqual(codec.decode([1]), E.left(DE.indexed('array', [1], [[0, DE.leaf('string', 1)]])))
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
        assert.deepStrictEqual(codec.decode(['a', 1]), E.right(['a', 1]))
      })

      it('should strip additional components', () => {
        const codec = C.tuple([C.string, C.number])
        assert.deepStrictEqual(codec.decode(['a', 1, true]), E.right(['a', 1]))
      })

      it('should reject an invalid input', () => {
        const codec = C.tuple([C.string, C.number])
        assert.deepStrictEqual(codec.decode(undefined), E.left(DE.leaf('Array<unknown>', undefined)))
        assert.deepStrictEqual(
          codec.decode(['a']),
          E.left(DE.indexed('tuple', ['a'], [[1, DE.leaf('number', undefined)]]))
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
        assert.deepStrictEqual(codec.decode({ a: 'a', b: 1 }), E.right({ a: 'a', b: 1 }))
      })

      it('should handle primitives', () => {
        interface PositiveBrand {
          readonly Positive: unique symbol
        }
        type Positive = number & PositiveBrand
        const Positive = C.refinement(C.number, (n): n is Positive => n > 0, 'Positive')

        const codec = C.intersection([C.Int, Positive])
        assert.deepStrictEqual(codec.decode(1), E.right(1))
      })

      it('should reject an invalid input', () => {
        const codec = C.intersection([C.type({ a: C.string }), C.type({ b: C.number })])
        assert.deepStrictEqual(
          codec.decode({ a: 'a' }),
          E.left(
            DE.and('intersection', { a: 'a' }, [DE.labeled('type', { a: 'a' }, [['b', DE.leaf('number', undefined)]])])
          )
        )
      })

      it('should handle empty intersections', () => {
        const codec = D.intersection([] as any)
        assert.deepStrictEqual(codec.decode('a'), E.right('a'))
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

  describe('recursive', () => {
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
        assert.deepStrictEqual(codec.decode({ a: '1', b: [] }), E.right({ a: 1, b: [] }))
        assert.deepStrictEqual(
          codec.decode({ a: '1', b: [{ a: '2', b: [] }] }),
          E.right({ a: 1, b: [{ a: 2, b: [] }] })
        )
      })

      it('should reject an invalid input', () => {
        assert.deepStrictEqual(codec.decode(null), E.left(DE.leaf('Record<string, unknown>', null)))
        assert.deepStrictEqual(
          codec.decode({}),
          E.left(
            DE.labeled('type', {}, [
              ['a', DE.leaf('NumberFromString', undefined)],
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
})
