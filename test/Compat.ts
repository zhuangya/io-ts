import * as assert from 'assert'
import * as C from '../src/Compat'
import * as CT from './Codec'
import { right, left } from 'fp-ts/lib/Either'
import * as DE from '../src/DecodeError'

describe('Compat', () => {
  describe('name', () => {
    it('literals', () => {
      assert.strictEqual(C.literals(['a', 1]).name, '"a" | 1')
      assert.strictEqual(C.literals(['a', 1], 'name').name, 'name')
    })

    it('literalsOr', () => {
      assert.strictEqual(
        C.literalsOr([null], C.type({ a: C.string, b: C.number })).name,
        'null | { a: string, b: number }'
      )
      assert.strictEqual(C.literalsOr([null], C.type({ a: C.string, b: C.number }), 'name').name, 'name')
    })

    it('refinement', () => {
      assert.strictEqual(
        C.refinement(C.string, s => (s.length > 0 ? right(s) : left('please entere a non empty string')), 'name').name,
        'name'
      )
    })

    it('type', () => {
      assert.strictEqual(C.type({ a: C.string, b: C.number }).name, '{ a: string, b: number }')
      assert.strictEqual(C.type({ a: C.string, b: C.number }, 'name').name, 'name')
    })

    it('partial', () => {
      assert.strictEqual(C.partial({ a: C.string, b: C.number }).name, 'Partial<{ a: string, b: number }>')
      assert.strictEqual(C.partial({ a: C.string, b: C.number }, 'name').name, 'name')
    })

    it('record', () => {
      assert.strictEqual(C.record(C.number).name, 'Record<string, number>')
      assert.strictEqual(C.record(C.number, 'name').name, 'name')
    })

    it('array', () => {
      assert.strictEqual(C.array(C.number).name, 'Array<number>')
      assert.strictEqual(C.array(C.number, 'name').name, 'name')
    })

    it('tuple', () => {
      assert.strictEqual(C.tuple([C.string, C.number]).name, '[string, number]')
      assert.strictEqual(C.tuple([C.string, C.number], 'name').name, 'name')
    })

    it('intersection', () => {
      assert.strictEqual(
        C.intersection([C.type({ a: C.string }), C.type({ b: C.number })]).name,
        '{ a: string } & { b: number }'
      )
      assert.strictEqual(C.intersection([C.type({ a: C.string }), C.type({ b: C.number })], 'name').name, 'name')
    })

    it('sum', () => {
      const sum = C.sum('_tag')

      const A = C.type({ _tag: C.literals(['A']), a: C.string })
      const B = C.type({ _tag: C.literals(['B']), b: C.number })
      assert.strictEqual(sum({ A, B }).name, '{ _tag: "A", a: string } | { _tag: "B", b: number }')
      assert.strictEqual(sum({ A, B }, 'name').name, 'name')
    })

    it.skip('lazy', () => {
      interface A {
        a: number
        b: null | A
      }

      const A: C.Compat<A> = C.lazy(() =>
        C.type({
          a: C.number,
          b: C.literalsOr([null], A)
        })
      )
      assert.strictEqual(A.name, 'TODO')
    })

    it('union', () => {
      assert.strictEqual(C.union([C.string, C.number]).name, 'string | number')
      assert.strictEqual(C.union([C.string, C.number], 'name').name, 'name')
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

  describe('lazy', () => {
    const NumberFromString: C.Compat<number> = C.make(
      'NumberFromString',
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
