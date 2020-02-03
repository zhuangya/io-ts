import * as assert from 'assert'
import * as DSL from '../src/DSL'

function assertDSL<A>(dsl: DSL.DSL<A>, model: DSL.Model): void {
  assert.deepStrictEqual(dsl(), model)
}

describe('DSL', () => {
  it('literals', () => {
    assertDSL(DSL.literals(['a', 1]), { _tag: 'literals', values: ['a', 1], id: undefined })
  })

  it('literalsOr', () => {
    const schema = DSL.literalsOr([null], DSL.type({ a: DSL.string, b: DSL.number }))
    assertDSL(schema, {
      _tag: 'literalsOr',
      values: [null],
      model: {
        _tag: 'type',
        models: {
          a: { _tag: 'string' },
          b: { _tag: 'number' }
        },
        id: undefined
      },
      id: undefined
    })
  })

  it('string', () => {
    assertDSL(DSL.string, { _tag: 'string' })
  })

  it('number', () => {
    assertDSL(DSL.number, { _tag: 'number' })
  })

  it('boolean', () => {
    assertDSL(DSL.boolean, { _tag: 'boolean' })
  })

  it('UnknownArray', () => {
    assertDSL(DSL.UnknownArray, { _tag: 'UnknownArray' })
  })

  it('UnknownRecord', () => {
    assertDSL(DSL.UnknownRecord, { _tag: 'UnknownRecord' })
  })

  it('type', () => {
    const schema = DSL.type({ a: DSL.string, b: DSL.number })
    assertDSL(schema, {
      _tag: 'type',
      models: {
        a: { _tag: 'string' },
        b: { _tag: 'number' }
      },
      id: undefined
    })
  })

  it('partial', () => {
    const schema = DSL.partial({ a: DSL.string, b: DSL.number })
    assertDSL(schema, {
      _tag: 'partial',
      models: {
        a: { _tag: 'string' },
        b: { _tag: 'number' }
      },
      id: undefined
    })
  })

  it('record', () => {
    const schema = DSL.record(DSL.number)
    assertDSL(schema, { _tag: 'record', model: { _tag: 'number' }, id: undefined })
  })

  it('array', () => {
    const schema = DSL.array(DSL.number)
    assertDSL(schema, { _tag: 'array', model: { _tag: 'number' }, id: undefined })
  })

  it('tuple', () => {
    const schema = DSL.tuple([DSL.string, DSL.number])
    assertDSL(schema, { _tag: 'tuple', models: [{ _tag: 'string' }, { _tag: 'number' }], id: undefined })
  })

  it('intersection', () => {
    const schema = DSL.intersection([
      DSL.type({ a: DSL.string }),
      DSL.type({ b: DSL.number }),
      DSL.type({ c: DSL.boolean })
    ])
    assertDSL(schema, {
      _tag: 'intersection',
      models: [
        {
          _tag: 'type',
          models: {
            a: { _tag: 'string' }
          },
          id: undefined
        },
        {
          _tag: 'type',
          models: {
            b: { _tag: 'number' }
          },
          id: undefined
        },
        {
          _tag: 'type',
          models: {
            c: { _tag: 'boolean' }
          },
          id: undefined
        }
      ],
      id: undefined
    })
  })

  it('sum', () => {
    const sum = DSL.sum('_tag')

    const A = DSL.type({ _tag: DSL.literals(['A']), a: DSL.string })
    const B = DSL.type({ _tag: DSL.literals(['B']), b: DSL.number })
    const schema = sum({ A, B })
    assertDSL(schema, {
      _tag: 'sum',
      tag: '_tag',
      models: {
        A: {
          _tag: 'type',
          models: {
            _tag: { _tag: 'literals', values: ['A'], id: undefined },
            a: { _tag: 'string' }
          },
          id: undefined
        },
        B: {
          _tag: 'type',
          models: {
            _tag: { _tag: 'literals', values: ['B'], id: undefined },
            b: { _tag: 'number' }
          },
          id: undefined
        }
      },
      id: undefined
    })
  })

  it('lazy', () => {
    interface A {
      a: string
      as: Array<A>
    }
    const schema: DSL.DSL<A> = DSL.lazy(() =>
      DSL.type({
        a: DSL.string,
        as: DSL.array(schema)
      })
    )
    assertDSL(schema, {
      _tag: 'lazy',
      model: {
        _tag: 'type',
        models: {
          a: { _tag: 'string' },
          as: { _tag: 'array', model: { _tag: '$ref', id: '$Ref1' }, id: undefined }
        },
        id: undefined
      },
      id: '$Ref1'
    })
    assertDSL(DSL.type({ a: schema }), {
      _tag: 'type',
      models: {
        a: { _tag: '$ref', id: '$Ref1' }
      },
      id: undefined
    })
  })

  it('union', () => {
    const schema = DSL.union([DSL.string, DSL.number, DSL.boolean])
    assertDSL(schema, {
      _tag: 'union',
      models: [{ _tag: 'string' }, { _tag: 'number' }, { _tag: 'boolean' }],
      id: undefined
    })
  })
})
