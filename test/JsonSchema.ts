import * as assert from 'assert'
import * as Ajv from 'ajv'
import * as J from '../src/JsonSchema'
import * as C from 'fp-ts/lib/Const'

const ajv = new Ajv()

describe('JsonSchema', () => {
  it('literals', () => {
    const validate = ajv.compile(J.literals(['a']).compile(false))
    assert.strictEqual(validate('a'), true)
    assert.strictEqual(validate(1), false)
  })

  it('literalsOr', () => {
    const schema = J.literalsOr([null], J.type({ a: J.string, b: J.number })).compile(false)
    const validate = ajv.compile(schema)
    assert.strictEqual(validate(null), true)
    assert.strictEqual(validate({ a: 'a', b: 1 }), true)
  })

  it('string', () => {
    const validate = ajv.compile(J.string.compile(false))
    assert.strictEqual(validate('a'), true)
    assert.strictEqual(validate(1), false)
  })

  it('boolean', () => {
    const validate = ajv.compile(J.boolean.compile(false))
    assert.strictEqual(validate(true), true)
    assert.strictEqual(validate(1), false)
  })

  it('UnknownArray', () => {
    const validate = ajv.compile(J.UnknownArray.compile(false))
    assert.strictEqual(validate([]), true)
    assert.strictEqual(validate([1, 2, 3]), true)
    assert.strictEqual(validate(1), false)
  })

  it('UnknownRecord', () => {
    const validate = ajv.compile(J.UnknownRecord.compile(false))
    assert.strictEqual(validate({}), true)
    assert.strictEqual(validate({ a: 'a', b: 1 }), true)
    assert.strictEqual(validate(1), false)
  })

  it('type', () => {
    const schema = J.type({ a: J.string, b: J.number }).compile(false)
    const validate = ajv.compile(schema)
    assert.strictEqual(validate({ a: 'a', b: 1 }), true)
    assert.strictEqual(validate({ a: 'a' }), false)
    assert.strictEqual(validate({ a: 'a', b: 'b' }), false)
  })

  it('partial', () => {
    const validate = ajv.compile(J.partial({ a: J.string, b: J.number }).compile(false))
    assert.strictEqual(validate({ a: 'a', b: 1 }), true)
    assert.strictEqual(validate({ a: 'a' }), true)
    assert.strictEqual(validate({ a: 'a', b: undefined }), true)
    assert.strictEqual(validate({ a: 'a', b: 'b' }), false)
  })

  it('record', () => {
    const validate = ajv.compile(J.record(J.string).compile(false))
    assert.strictEqual(validate({ a: 'a', b: 'b' }), true)
    assert.strictEqual(validate({ a: 'a', b: 1 }), false)
  })

  it('array', () => {
    const validate = ajv.compile(J.array(J.number).compile(false))
    assert.strictEqual(validate([]), true)
    assert.strictEqual(validate([1, 2, 3]), true)
    assert.strictEqual(validate([1, 'a', 3]), false)
  })

  it('tuple2', () => {
    const validate = ajv.compile(J.tuple2(J.string, J.number).compile(false))
    assert.strictEqual(validate(['a', 1]), true)
    assert.strictEqual(validate(['a', 1, true]), false)
    assert.strictEqual(validate(['a']), false)
  })

  describe('intersection', () => {
    it('should handle non primitive values', () => {
      const validate = ajv.compile(J.intersection(J.type({ a: J.string }), J.type({ b: J.number })).compile(false))
      assert.strictEqual(validate({ a: 'a', b: 1 }), true)
      assert.strictEqual(validate({ a: 'a' }), false)
    })

    interface IntBrand {
      readonly Int: unique symbol
    }
    type Int = number & IntBrand

    const Int: J.JsonSchema<Int> = {
      compile: () =>
        C.make({
          type: 'integer'
        })
    }
    const Positive: J.JsonSchema<number> = {
      compile: () =>
        C.make({
          type: 'number',
          minimum: 0
        })
    }

    it('should handle primitives', () => {
      const validate = ajv.compile(J.intersection(Int, Positive).compile(false))
      assert.strictEqual(validate(1), true)
      assert.strictEqual(validate(-1), false)
    })
  })

  it('sum', () => {
    const sum = J.sum('_tag')

    const A = J.type({ _tag: J.literal('A'), a: J.string })
    const B = J.type({ _tag: J.literal('B'), b: J.number })
    const validate = ajv.compile(sum({ A, B }).compile(false))
    assert.strictEqual(validate({ _tag: 'A', a: 'a' }), true)
    assert.strictEqual(validate({ _tag: 'B', b: 1 }), true)
    assert.strictEqual(validate(undefined), false)
    assert.strictEqual(validate({}), false)
  })

  it('union', () => {
    const validate = ajv.compile(J.union([J.string, J.number]).compile(false))
    assert.strictEqual(validate('a'), true)
    assert.strictEqual(validate(1), true)
    assert.strictEqual(validate(true), false)
  })

  describe('lazy', () => {
    it('should support recursive json schemas', () => {
      interface A {
        a: number
        b: null | A
      }

      const schema: J.JsonSchema<A> = J.lazy('A', () =>
        J.type({
          a: J.number,
          b: J.literalsOr([null], schema)
        })
      )

      const validate = ajv.compile(schema.compile(false))
      assert.strictEqual(validate({}), false)
      assert.strictEqual(validate({ a: 1 }), false)
      assert.strictEqual(validate({ a: 1, b: null }), true)
      assert.strictEqual(validate({ a: 1, b: { a: 2, b: null } }), true)
    })

    it.skip('should support mutually recursive json schemas', () => {
      interface A {
        b: null | B
      }
      interface B {
        a: null | A
      }
      const A: J.JsonSchema<A> = J.lazy('A', () =>
        J.type({
          b: J.literalsOr([null], B)
        })
      )
      const B: J.JsonSchema<B> = J.lazy('B', () =>
        J.type({
          a: J.literalsOr([null], A)
        })
      )
      console.log(JSON.stringify(A.compile(false), null, 2))
      const validateA = ajv.compile(A.compile(false))
      assert.strictEqual(validateA({ b: null }), true)
      assert.strictEqual(validateA({ b: { a: null } }), true)
      assert.strictEqual(validateA({ b: { a: { b: null } } }), true)

      const validateB = ajv.compile(B.compile(false))
      assert.strictEqual(validateB({ a: null }), true)
      assert.strictEqual(validateB({ a: { b: null } }), true)
      assert.strictEqual(validateB({ a: { b: { a: null } } }), true)
    })
  })
})
