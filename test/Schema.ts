import * as assert from 'assert'
import * as S from '../src/Schema'
import * as DSL from '../src/DSL'

const transformer = S.getTransformer({})

function assertRoundtrip<A>(dsl: DSL.DSL<A>): void {
  const schema = transformer(dsl)
  assert.deepStrictEqual(schema(DSL.dsl).dsl(), dsl.dsl())
}

describe('Schema', () => {
  it('literal', () => {
    assertRoundtrip(DSL.literal('A'))
  })

  it('literals', () => {
    assertRoundtrip(DSL.literals(['A', 1]))
  })

  it('literalsOr', () => {
    assertRoundtrip(DSL.literalsOr(['A', 1], DSL.type({ a: DSL.number })))
  })

  it('string', () => {
    assertRoundtrip(DSL.string)
  })

  it('number', () => {
    assertRoundtrip(DSL.number)
  })

  it('boolean', () => {
    assertRoundtrip(DSL.boolean)
  })

  it('UnknownArray', () => {
    assertRoundtrip(DSL.UnknownArray)
  })

  it('UnknownRecord', () => {
    assertRoundtrip(DSL.UnknownRecord)
  })

  it('type', () => {
    assertRoundtrip(DSL.type({ a: DSL.number }))
  })

  it('partial', () => {
    assertRoundtrip(DSL.partial({ a: DSL.number }))
  })

  it('record', () => {
    assertRoundtrip(DSL.record(DSL.number))
  })

  it('array', () => {
    assertRoundtrip(DSL.array(DSL.number))
  })

  it('tuple2', () => {
    assertRoundtrip(DSL.tuple2(DSL.string, DSL.number))
  })

  it('tuple3', () => {
    assertRoundtrip(DSL.tuple3(DSL.string, DSL.number, DSL.boolean))
  })

  it('intersection', () => {
    assertRoundtrip(DSL.intersection(DSL.type({ a: DSL.number }), DSL.type({ b: DSL.string })))
  })

  it('sum', () => {
    assertRoundtrip(
      DSL.sum('_tag')({
        A: DSL.type({ _tag: DSL.literal('A'), a: DSL.number }),
        B: DSL.type({ _tag: DSL.literal('B'), b: DSL.string })
      })
    )
  })

  it('lazy', () => {
    const dsl = DSL.lazy('A', () =>
      DSL.type({
        a: DSL.number,
        b: DSL.literalsOr([null], DSL.$ref('A'))
      })
    )
    const expected = DSL.lazy('A', () =>
      DSL.type({
        a: DSL.number,
        b: DSL.literalsOr([null], DSL.$ref('A'))
      })
    )
    const schema = transformer(dsl)
    assert.deepStrictEqual(schema(DSL.dsl).dsl(), expected.dsl())
  })

  it('union', () => {
    assertRoundtrip(DSL.union([DSL.string, DSL.number]))
  })
})
