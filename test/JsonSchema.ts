import * as assert from 'assert'
import * as Ajv from 'ajv'
import * as J from '../src/JsonSchema'

const ajv = new Ajv()

function run<A>(jsonSchema: object, a: A): boolean {
  return ajv.compile(jsonSchema)(a) as any
}

describe('JsonSchema', () => {
  it('string', () => {
    assert.strictEqual(run(J.string, 'a'), true)
    assert.strictEqual(run(J.string, 1), false)
  })

  it('Int', () => {
    assert.strictEqual(run(J.Int, 1), true)
    assert.strictEqual(run(J.Int, 'a'), false)
    assert.strictEqual(run(J.Int, 1.2), false)
  })

  it('literals', () => {
    assert.strictEqual(run(J.literals(['a']), 'a'), true)
    assert.strictEqual(run(J.literals(['a']), 1), false)
  })

  it('literalsOr', () => {
    const schema = J.literalsOr([undefined], J.type({ a: J.string, b: J.number }))
    assert.strictEqual(run(schema, undefined), true)
    assert.strictEqual(run(schema, { a: 'a', b: 1 }), true)
  })

  it('type', () => {
    const schema = J.type({ a: J.string, b: J.number })
    assert.strictEqual(run(schema, { a: 'a', b: 1 }), true)
    assert.strictEqual(run(schema, { a: 'a' }), false)
    assert.strictEqual(run(schema, { a: 'a', b: 'b' }), false)
  })

  it('partial', () => {
    const schema = J.partial({ a: J.string, b: J.number })
    assert.strictEqual(run(schema, { a: 'a', b: 1 }), true)
    assert.strictEqual(run(schema, { a: 'a' }), true)
    assert.strictEqual(run(schema, { a: 'a', b: undefined }), true)
    assert.strictEqual(run(schema, { a: 'a', b: 'b' }), false)
  })

  it('record', () => {
    const schema = J.record(J.string)
    assert.strictEqual(run(schema, { a: 'a', b: 'b' }), true)
    assert.strictEqual(run(schema, { a: 'a', b: 1 }), false)
  })

  it('array', () => {
    const schema = J.array(J.number)
    assert.strictEqual(run(schema, []), true)
    assert.strictEqual(run(schema, [1, 2, 3]), true)
    assert.strictEqual(run(schema, [1, 'a', 3]), false)
  })

  it('tuple', () => {
    const schema = J.tuple([J.string, J.number])
    assert.strictEqual(run(schema, ['a', 1]), true)
    assert.strictEqual(run(schema, ['a', 1, true]), false)
    assert.strictEqual(run(schema, ['a']), false)
  })

  describe('intersection', () => {
    it('should handle non primitive values', () => {
      const schema = J.intersection([J.type({ a: J.string }), J.type({ b: J.number })])
      assert.strictEqual(run(schema, { a: 'a', b: 1 }), true)
      assert.strictEqual(run(schema, { a: 'a' }), false)
    })

    const Positive: J.JsonSchema<number> = J.make({
      type: 'number',
      minimum: 0
    })

    it('should handle primitives', () => {
      const schema = J.intersection([J.Int, Positive])
      assert.strictEqual(run(schema, 1), true)
      assert.strictEqual(run(schema, -1), false)
    })
  })

  it('sum', () => {
    const sum = J.sum('_tag')

    const schema = sum({
      A: J.type({ _tag: J.literals(['A']), a: J.string }),
      B: J.type({ _tag: J.literals(['B']), b: J.number })
    })
    assert.strictEqual(run(schema, { _tag: 'A', a: 'a' }), true)
    assert.strictEqual(run(schema, { _tag: 'B', b: 1 }), true)
    assert.strictEqual(run(schema, undefined), false)
    assert.strictEqual(run(schema, {}), false)
  })

  it('union', () => {
    const schema = J.union([J.string, J.number])
    assert.strictEqual(run(schema, 'a'), true)
    assert.strictEqual(run(schema, 1), true)
    assert.strictEqual(run(schema, true), false)
  })
})
