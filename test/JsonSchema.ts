import * as assert from 'assert'
import * as Ajv from 'ajv'
import * as J from '../src/JsonSchema'
import * as C from 'fp-ts/lib/Const'

const ajv = new Ajv()

describe('JsonSchema', () => {
  it('string', () => {
    const validate = ajv.compile(J.string())
    assert.strictEqual(validate('a'), true)
    assert.strictEqual(validate(1), false)
  })

  it('Int', () => {
    const validate = ajv.compile(J.Int())
    assert.strictEqual(validate(1), true)
    assert.strictEqual(validate('a'), false)
    assert.strictEqual(validate(1.2), false)
  })

  it('literals', () => {
    const validate = ajv.compile(J.literals(['a'])())
    assert.strictEqual(validate('a'), true)
    assert.strictEqual(validate(1), false)
  })

  it('literalsOr', () => {
    const validate = ajv.compile(J.literalsOr([undefined], J.type({ a: J.string, b: J.number }))())
    assert.strictEqual(validate(undefined), true)
    assert.strictEqual(validate({ a: 'a', b: 1 }), true)
  })

  it('type', () => {
    const validate = ajv.compile(J.type({ a: J.string, b: J.number })())
    assert.strictEqual(validate({ a: 'a', b: 1 }), true)
    assert.strictEqual(validate({ a: 'a' }), false)
    assert.strictEqual(validate({ a: 'a', b: 'b' }), false)
  })

  it('partial', () => {
    const validate = ajv.compile(J.partial({ a: J.string, b: J.number })())
    assert.strictEqual(validate({ a: 'a', b: 1 }), true)
    assert.strictEqual(validate({ a: 'a' }), true)
    assert.strictEqual(validate({ a: 'a', b: undefined }), true)
    assert.strictEqual(validate({ a: 'a', b: 'b' }), false)
  })

  it('record', () => {
    const validate = ajv.compile(J.record(J.string)())
    assert.strictEqual(validate({ a: 'a', b: 'b' }), true)
    assert.strictEqual(validate({ a: 'a', b: 1 }), false)
  })

  it('array', () => {
    const validate = ajv.compile(J.array(J.number)())
    assert.strictEqual(validate([]), true)
    assert.strictEqual(validate([1, 2, 3]), true)
    assert.strictEqual(validate([1, 'a', 3]), false)
  })

  it('tuple', () => {
    const validate = ajv.compile(J.tuple([J.string, J.number])())
    assert.strictEqual(validate(['a', 1]), true)
    assert.strictEqual(validate(['a', 1, true]), false)
    assert.strictEqual(validate(['a']), false)
  })

  describe('intersection', () => {
    it('should handle non primitive values', () => {
      const validate = ajv.compile(J.intersection([J.type({ a: J.string }), J.type({ b: J.number })])())
      assert.strictEqual(validate({ a: 'a', b: 1 }), true)
      assert.strictEqual(validate({ a: 'a' }), false)
    })

    const Positive: J.JsonSchema<number> = C.make(() => ({
      type: 'number',
      minimum: 0
    }))

    it('should handle primitives', () => {
      const validate = ajv.compile(J.intersection([J.Int, Positive])())
      assert.strictEqual(validate(1), true)
      assert.strictEqual(validate(-1), false)
    })
  })

  it('sum', () => {
    const sum = J.sum('_tag')

    const A = J.type({ _tag: J.literals(['A']), a: J.string })
    const B = J.type({ _tag: J.literals(['B']), b: J.number })
    const validate = ajv.compile(sum({ A, B })())
    assert.strictEqual(validate({ _tag: 'A', a: 'a' }), true)
    assert.strictEqual(validate({ _tag: 'B', b: 1 }), true)
    assert.strictEqual(validate(undefined), false)
    assert.strictEqual(validate({}), false)
  })

  it('union', () => {
    const validate = ajv.compile(J.union([J.string, J.number])())
    assert.strictEqual(validate('a'), true)
    assert.strictEqual(validate(1), true)
    assert.strictEqual(validate(true), false)
  })

  it('lazy', () => {
    interface A {
      a: string
      as: Array<A>
    }
    const schema: J.JsonSchema<A> = J.lazy(() =>
      J.type({
        a: J.string,
        as: J.array(schema)
      })
    )
    const validate = ajv.compile(schema())
    assert.strictEqual(validate({}), false)
    assert.strictEqual(validate({ a: 'a' }), false)
    assert.strictEqual(validate({ a: 'a', as: [] }), true)
  })
})
