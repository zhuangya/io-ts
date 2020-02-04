import * as assert from 'assert'
import * as C from '../src/Compat'

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
})
