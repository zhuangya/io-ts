import * as assert from 'assert'
import * as DSL from '../src/DSL'

describe('DSL', () => {
  it('literals', () => {
    const dsl = DSL.literals(['a', 1])
    assert.deepStrictEqual(dsl.dsl(false), { _tag: 'literals', values: ['a', 1], id: undefined })
  })

  it('literalsOr', () => {
    const dsl = DSL.literalsOr([null], DSL.type({ a: DSL.string, b: DSL.number }))
    assert.deepStrictEqual(dsl.dsl(false), {
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
    assert.deepStrictEqual(DSL.string.dsl(false), { _tag: 'string' })
  })

  it('number', () => {
    assert.deepStrictEqual(DSL.number.dsl(false), { _tag: 'number' })
  })

  it('boolean', () => {
    assert.deepStrictEqual(DSL.boolean.dsl(false), { _tag: 'boolean' })
  })

  it('UnknownArray', () => {
    assert.deepStrictEqual(DSL.UnknownArray.dsl(false), { _tag: 'UnknownArray' })
  })

  it('UnknownRecord', () => {
    assert.deepStrictEqual(DSL.UnknownRecord.dsl(false), { _tag: 'UnknownRecord' })
  })

  it('type', () => {
    const dsl = DSL.type({ a: DSL.string, b: DSL.number })
    assert.deepStrictEqual(dsl.dsl(false), {
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
    assert.deepStrictEqual(dsl.dsl(false), {
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
    assert.deepStrictEqual(dsl.dsl(false), { _tag: 'record', codomain: { _tag: 'number' }, id: undefined })
  })

  it('array', () => {
    const dsl = DSL.array(DSL.number)
    assert.deepStrictEqual(dsl.dsl(false), { _tag: 'array', items: { _tag: 'number' }, id: undefined })
  })

  it('tuple', () => {
    const dsl = DSL.tuple(DSL.string, DSL.number)
    assert.deepStrictEqual(dsl.dsl(false), {
      _tag: 'tuple',
      left: { _tag: 'string' },
      right: { _tag: 'number' },
      id: undefined
    })
  })

  it('intersection', () => {
    const dsl = DSL.intersection(DSL.type({ a: DSL.string }), DSL.type({ b: DSL.number }))
    assert.deepStrictEqual(dsl.dsl(false), {
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
    assert.deepStrictEqual(dsl.dsl(false), {
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
    assert.deepStrictEqual(dsl.dsl(false), {
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

      assert.deepStrictEqual(dsl.dsl(false), {
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

      assert.deepStrictEqual(dsl.dsl(false), {
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

    it('should support mutually recursive dsls', () => {
      interface A {
        b: null | B
      }
      interface B {
        a: null | A
      }
      const A: DSL.DSL<A> = DSL.lazy('A', () =>
        DSL.type({
          b: DSL.literalsOr([null], B)
        })
      )
      const B: DSL.DSL<B> = DSL.lazy('B', () =>
        DSL.type({
          a: DSL.literalsOr([null], A)
        })
      )
      assert.deepStrictEqual(A.dsl(false), {
        _tag: 'lazy',
        model: {
          _tag: 'type',
          properties: {
            b: { _tag: 'literalsOr', values: [null], model: { _tag: '$ref', id: 'B' }, id: undefined }
          },
          id: undefined
        },
        id: 'A'
      })
      assert.deepStrictEqual(B.dsl(false), {
        _tag: 'lazy',
        model: {
          _tag: 'type',
          properties: {
            a: { _tag: 'literalsOr', values: [null], model: { _tag: '$ref', id: 'A' }, id: undefined }
          },
          id: undefined
        },
        id: 'B'
      })
    })
  })
})
