import * as assert from 'assert'
import * as DSL from '../src/DSL'

describe('DSL', () => {
  it('$ref', () => {
    assert.deepStrictEqual(DSL.$ref('Person'), { _tag: '$ref', id: 'Person' })
  })

  it('literals', () => {
    assert.deepStrictEqual(DSL.literals(['a', 1]), { _tag: 'literals', values: ['a', 1] })
  })

  it('literalsOr', () => {
    const expression = DSL.literalsOr([null], DSL.type({ a: DSL.string, b: DSL.number }))
    assert.deepStrictEqual(expression, {
      _tag: 'literalsOr',
      values: [null],
      model: {
        _tag: 'type',
        models: {
          a: { _tag: 'string' },
          b: { _tag: 'number' }
        }
      }
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
      models: {
        a: { _tag: 'string' },
        b: { _tag: 'number' }
      }
    })
  })

  it('partial', () => {
    const expression = DSL.partial({ a: DSL.string, b: DSL.number })
    assert.deepStrictEqual(expression, {
      _tag: 'partial',
      models: {
        a: { _tag: 'string' },
        b: { _tag: 'number' }
      }
    })
  })

  it('record', () => {
    const expression = DSL.record(DSL.number)
    assert.deepStrictEqual(expression, { _tag: 'record', model: { _tag: 'number' } })
  })

  it('array', () => {
    const expression = DSL.array(DSL.number)
    assert.deepStrictEqual(expression, { _tag: 'array', model: { _tag: 'number' } })
  })

  it('tuple', () => {
    const expression = DSL.tuple([DSL.string, DSL.number])
    assert.deepStrictEqual(expression, { _tag: 'tuple', models: [{ _tag: 'string' }, { _tag: 'number' }] })
  })

  it('intersection', () => {
    const expression = DSL.intersection([
      DSL.type({ a: DSL.string }),
      DSL.type({ b: DSL.number }),
      DSL.type({ c: DSL.boolean })
    ])
    assert.deepStrictEqual(expression, {
      _tag: 'intersection',
      models: [
        {
          _tag: 'type',
          models: {
            a: { _tag: 'string' }
          }
        },
        {
          _tag: 'type',
          models: {
            b: { _tag: 'number' }
          }
        },
        {
          _tag: 'type',
          models: {
            c: { _tag: 'boolean' }
          }
        }
      ]
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
      models: {
        A: {
          _tag: 'type',
          models: {
            _tag: { _tag: 'literals', values: ['A'] },
            a: { _tag: 'string' }
          }
        },
        B: {
          _tag: 'type',
          models: {
            _tag: { _tag: 'literals', values: ['B'] },
            b: { _tag: 'number' }
          }
        }
      }
    })
  })

  it('union', () => {
    const expression = DSL.union([DSL.string, DSL.number, DSL.boolean])
    assert.deepStrictEqual(expression, {
      _tag: 'union',
      models: [{ _tag: 'string' }, { _tag: 'number' }, { _tag: 'boolean' }]
    })
  })

  it('lazy', () => {
    assert.deepStrictEqual(
      DSL.lazy(
        DSL.type({
          a: DSL.number,
          b: DSL.literalsOr([null], DSL.$ref('A'))
        })
      ),
      {
        _tag: 'lazy',
        model: {
          _tag: 'type',
          models: {
            a: { _tag: 'number' },
            b: { _tag: 'literalsOr', values: [null], model: { _tag: '$ref', id: 'A' } }
          }
        }
      }
    )
  })

  it('declaration', () => {
    assert.deepStrictEqual(DSL.declaration('A', DSL.string), {
      id: 'A',
      model: { _tag: 'string' }
    })
  })
})
