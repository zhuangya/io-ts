import * as assert from 'assert'
import * as DSL from '../src/DSL'

describe('DSL', () => {
  it('$ref', () => {
    assert.deepStrictEqual(DSL.$ref('Person'), { _tag: '$ref', id: 'Person' })
  })

  it('literals', () => {
    assert.deepStrictEqual(DSL.literals(['a', 1]), { _tag: 'literals', values: ['a', 1], id: undefined })
  })

  it('literalsOr', () => {
    const expression = DSL.literalsOr([null], DSL.type({ a: DSL.string, b: DSL.number }))
    assert.deepStrictEqual(expression, {
      _tag: 'literalsOr',
      values: [null],
      dsl: {
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
    assert.deepStrictEqual(DSL.string, { _tag: 'string' })
  })

  it('number', () => {
    assert.deepStrictEqual(DSL.number, { _tag: 'number' })
  })

  it('boolean', () => {
    assert.deepStrictEqual(DSL.boolean, { _tag: 'boolean' })
  })

  it('UnknownArray', () => {
    assert.deepStrictEqual(DSL.UnknownArray, { _tag: 'UnknownArray' })
  })

  it('UnknownRecord', () => {
    assert.deepStrictEqual(DSL.UnknownRecord, { _tag: 'UnknownRecord' })
  })

  it('type', () => {
    const expression = DSL.type({ a: DSL.string, b: DSL.number })
    assert.deepStrictEqual(expression, {
      _tag: 'type',
      properties: {
        a: { _tag: 'string' },
        b: { _tag: 'number' }
      },
      id: undefined
    })
  })

  it('partial', () => {
    const expression = DSL.partial({ a: DSL.string, b: DSL.number })
    assert.deepStrictEqual(expression, {
      _tag: 'partial',
      properties: {
        a: { _tag: 'string' },
        b: { _tag: 'number' }
      },
      id: undefined
    })
  })

  it('record', () => {
    const expression = DSL.record(DSL.number)
    assert.deepStrictEqual(expression, { _tag: 'record', codomain: { _tag: 'number' }, id: undefined })
  })

  it('array', () => {
    const expression = DSL.array(DSL.number)
    assert.deepStrictEqual(expression, { _tag: 'array', items: { _tag: 'number' }, id: undefined })
  })

  it('tuple', () => {
    const expression = DSL.tuple([DSL.string, DSL.number])
    assert.deepStrictEqual(expression, {
      _tag: 'tuple',
      items: [{ _tag: 'string' }, { _tag: 'number' }],
      id: undefined
    })
  })

  it('intersection', () => {
    const expression = DSL.intersection([
      DSL.type({ a: DSL.string }),
      DSL.type({ b: DSL.number }),
      DSL.type({ c: DSL.boolean })
    ])
    assert.deepStrictEqual(expression, {
      _tag: 'intersection',
      dsls: [
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
        },
        {
          _tag: 'type',
          properties: {
            c: { _tag: 'boolean' }
          },
          id: undefined
        }
      ],
      id: undefined
    })
  })

  it('sum', () => {
    const expression = DSL.sum('_tag', {
      A: DSL.type({ _tag: DSL.literals(['A']), a: DSL.string }),
      B: DSL.type({ _tag: DSL.literals(['B']), b: DSL.number })
    })
    assert.deepStrictEqual(expression, {
      _tag: 'sum',
      tag: '_tag',
      dsls: {
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
    const expression = DSL.union([DSL.string, DSL.number, DSL.boolean])
    assert.deepStrictEqual(expression, {
      _tag: 'union',
      dsls: [{ _tag: 'string' }, { _tag: 'number' }, { _tag: 'boolean' }],
      id: undefined
    })
  })

  it('lazy', () => {
    assert.deepStrictEqual(
      DSL.lazy(
        'A',
        DSL.type({
          a: DSL.number,
          b: DSL.literalsOr([null], DSL.$ref('A'))
        })
      ),
      {
        _tag: 'lazy',
        dsl: {
          _tag: 'type',
          properties: {
            a: { _tag: 'number' },
            b: { _tag: 'literalsOr', values: [null], dsl: { _tag: '$ref', id: 'A' }, id: undefined }
          },
          id: undefined
        },
        id: 'A'
      }
    )
  })

  it('declaration', () => {
    assert.deepStrictEqual(DSL.declaration('A', DSL.string), {
      id: 'A',
      dsl: { _tag: 'string' }
    })
  })
})
