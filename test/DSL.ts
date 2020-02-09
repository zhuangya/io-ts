import * as assert from 'assert'
import * as DSL from '../src/DSL'

describe('DSL', () => {
  it('literals', () => {
    const dsl = DSL.literals(['a', 1])
    assert.deepStrictEqual(dsl.dsl(), { _tag: 'literals', values: ['a', 1], id: undefined })
  })

  it('literalsOr', () => {
    const dsl = DSL.literalsOr([null], DSL.type({ a: DSL.string, b: DSL.number }))
    assert.deepStrictEqual(dsl.dsl(), {
      _tag: 'literalsOr',
      values: [null],
      model: {
        _tag: 'type',
        properties: {
          a: { _tag: 'string' },
          b: { _tag: 'number' }
        },
        id: undefined
      },
      id: undefined
    })
  })

  it('string', () => {
    assert.deepStrictEqual(DSL.string.dsl(), { _tag: 'string' })
  })

  it('number', () => {
    assert.deepStrictEqual(DSL.number.dsl(), { _tag: 'number' })
  })

  it('boolean', () => {
    assert.deepStrictEqual(DSL.boolean.dsl(), { _tag: 'boolean' })
  })

  it('UnknownArray', () => {
    assert.deepStrictEqual(DSL.UnknownArray.dsl(), { _tag: 'UnknownArray' })
  })

  it('UnknownRecord', () => {
    assert.deepStrictEqual(DSL.UnknownRecord.dsl(), { _tag: 'UnknownRecord' })
  })

  it('type', () => {
    const dsl = DSL.type({ a: DSL.string, b: DSL.number })
    assert.deepStrictEqual(dsl.dsl(), {
      _tag: 'type',
      properties: {
        a: { _tag: 'string' },
        b: { _tag: 'number' }
      },
      id: undefined
    })
  })

  it('partial', () => {
    const dsl = DSL.partial({ a: DSL.string, b: DSL.number })
    assert.deepStrictEqual(dsl.dsl(), {
      _tag: 'partial',
      properties: {
        a: { _tag: 'string' },
        b: { _tag: 'number' }
      },
      id: undefined
    })
  })

  it('record', () => {
    const dsl = DSL.record(DSL.number)
    assert.deepStrictEqual(dsl.dsl(), { _tag: 'record', codomain: { _tag: 'number' }, id: undefined })
  })

  it('array', () => {
    const dsl = DSL.array(DSL.number)
    assert.deepStrictEqual(dsl.dsl(), { _tag: 'array', items: { _tag: 'number' }, id: undefined })
  })

  it('tuple', () => {
    const dsl = DSL.tuple([DSL.string, DSL.number])
    assert.deepStrictEqual(dsl.dsl(), {
      _tag: 'tuple',
      items: [{ _tag: 'string' }, { _tag: 'number' }],
      id: undefined
    })
  })

  it('intersection', () => {
    const dsl = DSL.intersection([DSL.type({ a: DSL.string }), DSL.type({ b: DSL.number })])
    assert.deepStrictEqual(dsl.dsl(), {
      _tag: 'intersection',
      models: [
        {
          _tag: 'type',
          properties: {
            a: { _tag: 'string' }
          },
          id: undefined
        },
        {
          _tag: 'type',
          properties: {
            b: { _tag: 'number' }
          },
          id: undefined
        }
      ],
      id: undefined
    })
  })

  it('sum', () => {
    const dsl = DSL.sum('_tag')({
      A: DSL.type({ _tag: DSL.literals(['A']), a: DSL.string }),
      B: DSL.type({ _tag: DSL.literals(['B']), b: DSL.number })
    })
    assert.deepStrictEqual(dsl.dsl(), {
      _tag: 'sum',
      tag: '_tag',
      models: {
        A: {
          _tag: 'type',
          properties: {
            _tag: { _tag: 'literals', values: ['A'], id: undefined },
            a: { _tag: 'string' }
          },
          id: undefined
        },
        B: {
          _tag: 'type',
          properties: {
            _tag: { _tag: 'literals', values: ['B'], id: undefined },
            b: { _tag: 'number' }
          },
          id: undefined
        }
      },
      id: undefined
    })
  })

  it('union', () => {
    const dsl = DSL.union([DSL.string, DSL.number, DSL.boolean])
    assert.deepStrictEqual(dsl.dsl(), {
      _tag: 'union',
      models: [{ _tag: 'string' }, { _tag: 'number' }, { _tag: 'boolean' }],
      id: undefined
    })
  })

  describe('lazy', () => {
    it('using the $ref constructor', () => {
      const dsl = DSL.lazy('A', () =>
        DSL.type({
          a: DSL.number,
          b: DSL.literalsOr([null], DSL.$ref('A'))
        })
      )

      assert.deepStrictEqual(dsl.dsl(), {
        _tag: 'lazy',
        model: {
          _tag: 'type',
          properties: {
            a: { _tag: 'number' },
            b: { _tag: 'literalsOr', values: [null], model: { _tag: '$ref', id: 'A' }, id: undefined }
          },
          id: undefined
        },
        id: 'A'
      })
    })

    it('using a recursive definition', () => {
      interface A {
        a: number
        b: null | A
      }

      const dsl: DSL.DSL<A> = DSL.lazy('A', () =>
        DSL.type({
          a: DSL.number,
          b: DSL.literalsOr([null], dsl)
        })
      )

      assert.deepStrictEqual(dsl.dsl(), {
        _tag: 'lazy',
        model: {
          _tag: 'type',
          properties: {
            a: { _tag: 'number' },
            b: { _tag: 'literalsOr', values: [null], model: { _tag: '$ref', id: 'A' }, id: undefined }
          },
          id: undefined
        },
        id: 'A'
      })
    })
  })
})
