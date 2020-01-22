import * as assert from 'assert'
import * as E from 'fp-ts/lib/Either'
import * as C from '../src/Codec'
import * as D from '../src/Decoder'
import * as G from '../src/Guard'
import * as DE from '../src/DecodeError'

export const NumberFromString: C.Codec<number> = {
  name: 'NumberFromString',
  decode: u => {
    const e = D.string.decode(u)
    if (E.isLeft(e)) {
      return E.left(DE.decodeError('NumberFromString', u))
    } else {
      const s = e.right
      const n = parseFloat(s)
      return isNaN(n) ? E.left(DE.decodeError('NumberFromString', u)) : E.right(n)
    }
  },
  encode: String,
  ...G.number
}

describe('Codec', () => {
  describe('string', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.string
        assert.deepStrictEqual(codec.decode('a'), E.right('a'))
      })

      it('should reject an invalid input', () => {
        const codec = C.string
        assert.deepStrictEqual(codec.decode(null), E.left(DE.decodeError('string', null)))
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
        assert.deepStrictEqual(codec.decode(null), E.left(DE.decodeError('number', null)))
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
        assert.deepStrictEqual(codec.decode(null), E.left(DE.decodeError('boolean', null)))
      })
    })
  })

  describe('undefined', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.undefined
        assert.deepStrictEqual(codec.decode(undefined), E.right(undefined))
      })

      it('should reject an invalid input', () => {
        const codec = C.undefined
        assert.deepStrictEqual(codec.decode(null), E.left(DE.decodeError('undefined', null)))
      })
    })
  })

  describe('null', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.null
        assert.deepStrictEqual(codec.decode(null), E.right(null))
      })

      it('should reject an invalid input', () => {
        const codec = C.null
        assert.deepStrictEqual(codec.decode(undefined), E.left(DE.decodeError('null', undefined)))
      })
    })
  })

  describe('Int', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.Int
        assert.deepStrictEqual(codec.decode(1), E.right(1))
      })

      it('should reject an invalid input', () => {
        const codec = C.Int
        assert.deepStrictEqual(codec.decode(null), E.left(DE.decodeError('Int', null)))
        assert.deepStrictEqual(codec.decode('1'), E.left(DE.decodeError('Int', '1')))
        assert.deepStrictEqual(codec.decode(1.2), E.left(DE.decodeError('Int', 1.2)))
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
        const codec = C.literal('a')
        assert.deepStrictEqual(codec.decode('b'), E.left(DE.decodeError('"a"', 'b')))
      })
    })
  })

  describe('withName', () => {
    describe('decode', () => {
      it('should, return the provided name', () => {
        const codec = C.withName(C.number, 'mynumber')
        assert.deepStrictEqual(codec.decode('a'), E.left(DE.decodeError('mynumber', 'a')))
      })
    })
  })

  describe('withMessage', () => {
    describe('decode', () => {
      it('should, return the provided message', () => {
        const codec = C.withMessage(C.number, () => 'Please provide a number')
        assert.deepStrictEqual(
          codec.decode('a'),
          E.left({ expected: 'number', actual: 'a', detail: undefined, message: 'Please provide a number' })
        )
      })
    })
  })

  describe('keyof', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.keyof({ a: null, b: null })
        assert.deepStrictEqual(codec.decode('a'), E.right('a'))
        assert.deepStrictEqual(codec.decode('b'), E.right('b'))
      })

      it('should reject an invalid input', () => {
        const codec = C.keyof({ a: null, b: null })
        assert.deepStrictEqual(codec.decode('c'), E.left(DE.decodeError('"a" | "b"', 'c')))
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
        assert.deepStrictEqual(codec.decode(undefined), E.left(DE.decodeError('Record<string, unknown>', undefined)))
        assert.deepStrictEqual(
          codec.decode({ a: 1 }),
          E.left(DE.decodeError('{ a: string }', { a: 1 }, DE.labeledProduct([['a', DE.decodeError('string', 1)]])))
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
        assert.deepStrictEqual(codec.decode(undefined), E.left(DE.decodeError('Record<string, unknown>', undefined)))
        assert.deepStrictEqual(
          codec.decode({ a: 1 }),
          E.left(
            DE.decodeError('Partial<{ a: string }>', { a: 1 }, DE.labeledProduct([['a', DE.decodeError('string', 1)]]))
          )
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
        assert.deepStrictEqual(codec.decode(undefined), E.left(DE.decodeError('Record<string, unknown>', undefined)))
        assert.deepStrictEqual(
          codec.decode({ a: 'a' }),
          E.left(
            DE.decodeError(
              'Record<string, number>',
              { a: 'a' },
              DE.labeledProduct([['a', DE.decodeError('number', 'a')]])
            )
          )
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
        assert.deepStrictEqual(codec.decode(undefined), E.left(DE.decodeError('Array<unknown>', undefined)))
        assert.deepStrictEqual(
          codec.decode([1]),
          E.left(DE.decodeError('Array<string>', [1], DE.indexedProduct([[0, DE.decodeError('string', 1)]])))
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
        const codec = C.tuple([C.string, C.number])
        assert.deepStrictEqual(codec.decode(['a', 1]), E.right(['a', 1]))
      })

      it('should strip additional components', () => {
        const codec = C.tuple([C.string, C.number])
        assert.deepStrictEqual(codec.decode(['a', 1, true]), E.right(['a', 1]))
      })

      it('should reject an invalid input', () => {
        const codec = C.tuple([C.string, C.number])
        assert.deepStrictEqual(codec.decode(undefined), E.left(DE.decodeError('Array<unknown>', undefined)))
        assert.deepStrictEqual(
          codec.decode(['a']),
          E.left(
            DE.decodeError('[string, number]', ['a'], DE.indexedProduct([[1, DE.decodeError('number', undefined)]]))
          )
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
            DE.decodeError(
              '({ a: string } & { b: number })',
              { a: 'a' },
              DE.and([
                DE.decodeError(
                  '{ b: number }',
                  { a: 'a' },
                  DE.labeledProduct([['b', DE.decodeError('number', undefined)]])
                )
              ])
            )
          )
        )
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

  describe('union', () => {
    describe('decode', () => {
      it('should decode a valid input', () => {
        const codec = C.union([C.string, C.number])
        assert.deepStrictEqual(codec.decode('a'), E.right('a'))
        assert.deepStrictEqual(codec.decode(1), E.right(1))
      })

      it('should reject an invalid input', () => {
        const codec = C.union([C.string, C.number])
        assert.deepStrictEqual(
          codec.decode(true),
          E.left(
            DE.decodeError(
              '(string | number)',
              true,
              DE.or([DE.decodeError('string', true), DE.decodeError('number', true)])
            )
          )
        )
      })
    })

    describe('encode', () => {
      it('should encode a value', () => {
        const codec = C.union([C.string, NumberFromString])
        assert.deepStrictEqual(codec.encode('a'), 'a')
        assert.deepStrictEqual(codec.encode(1), '1')
      })
    })
  })

  describe('recursive', () => {
    describe('decode', () => {
      interface Rec {
        a: string
        b: Array<Rec>
      }

      it('should decode a valid input', () => {
        const codec: C.Codec<Rec> = C.recursive('Rec', () =>
          C.type({
            a: C.string,
            b: C.array(codec)
          })
        )
        assert.deepStrictEqual(codec.decode({ a: 'a', b: [] }), E.right({ a: 'a', b: [] }))
        assert.deepStrictEqual(
          codec.decode({ a: 'a', b: [{ a: 'b', b: [] }] }),
          E.right({ a: 'a', b: [{ a: 'b', b: [] }] })
        )
      })

      it('should reject an invalid input', () => {
        const codec: C.Codec<Rec> = C.recursive('Rec', () =>
          C.type({
            a: C.string,
            b: C.array(codec)
          })
        )
        assert.deepStrictEqual(codec.decode(null), E.left(DE.decodeError('Rec', null)))
        assert.deepStrictEqual(
          codec.decode({}),
          E.left(
            DE.decodeError(
              'Rec',
              {},
              DE.labeledProduct([
                ['a', DE.decodeError('string', undefined)],
                ['b', DE.decodeError('Array<unknown>', undefined)]
              ])
            )
          )
        )
      })
    })

    describe('encode', () => {
      interface Rec {
        a: number
        b: Array<Rec>
      }

      it('should encode a value', () => {
        const codec: C.Codec<Rec> = C.recursive('Rec', () =>
          C.type({
            a: NumberFromString,
            b: C.array(codec)
          })
        )
        assert.deepStrictEqual(codec.encode({ a: 1, b: [{ a: 2, b: [] }] }), { a: '1', b: [{ a: '2', b: [] }] })
      })
    })
  })
})
