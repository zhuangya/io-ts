import * as assert from 'assert'
import * as S from '../src/Static'

describe('Static', () => {
  it('string', () => {
    const schema = S.string
    assert.strictEqual(schema(), 'string')
  })

  it('boolean', () => {
    const schema = S.boolean
    assert.strictEqual(schema(), 'boolean')
  })

  it('UnknownArray', () => {
    const schema = S.UnknownArray
    assert.strictEqual(schema(), 'Array<unknown>')
  })

  it('UnknownRecord', () => {
    const schema = S.UnknownRecord
    assert.strictEqual(schema(), 'Record<string, unknown>')
  })

  it('literals', () => {
    const schema = S.literals(['a', 1])
    assert.strictEqual(schema(), '("a" | 1)')
  })

  it('literalsOr', () => {
    const schema = S.literalsOr([undefined], S.type({ a: S.string, b: S.number }))
    assert.strictEqual(schema(), '((undefined) | { a: string; b: number; })')
  })

  it('type', () => {
    const schema = S.type({ a: S.string, b: S.number })
    assert.strictEqual(schema(), '{ a: string; b: number; }')
  })

  it('partial', () => {
    const schema = S.partial({ a: S.string, b: S.number })
    assert.strictEqual(schema(), 'Partial<{ a: string; b: number; }>')
  })

  it('record', () => {
    const schema = S.record(S.number)
    assert.strictEqual(schema(), 'Record<string, number>')
  })

  it('array', () => {
    const schema = S.array(S.number)
    assert.strictEqual(schema(), 'Array<number>')
  })

  it('tuple', () => {
    const schema = S.tuple([S.string, S.number])
    assert.strictEqual(schema(), '[string, number]')
  })

  it('intersection', () => {
    const schema = S.intersection([S.type({ a: S.string }), S.type({ b: S.number })])
    assert.strictEqual(schema(), '({ a: string; } & { b: number; })')
  })

  it('sum', () => {
    const sum = S.sum('_tag')

    const A = S.type({ _tag: S.literals(['A']), a: S.string })
    const B = S.type({ _tag: S.literals(['B']), b: S.number })
    const schema = sum({ A, B })
    assert.strictEqual(schema(), '({ _tag: ("A"); a: string; } | { _tag: ("B"); b: number; })')
  })

  it('lazy', () => {
    interface A {
      a: string
      b: undefined | A
    }

    const schema: S.Static<A> = S.lazy(() =>
      S.type({
        a: S.string,
        b: S.literalsOr([undefined], schema)
      })
    )
    assert.strictEqual(schema(), '{ a: string; b: ((undefined) | $Ref1); }')
  })

  it('union', () => {
    const schema = S.union([S.string, S.number])
    assert.strictEqual(schema(), '(string | number)')
  })
})
