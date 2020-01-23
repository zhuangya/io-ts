import * as assert from 'assert'
import { right } from 'fp-ts/lib/Either'
import { URIS } from 'fp-ts/lib/HKT'
import * as D from '../src/Decoder'
import * as S from '../src/Schema'
import * as E from '../src/Encoder'
import * as G from '../src/Guard'

function getSchema<F extends URIS>(S: S.Schema<F>) {
  const Person = S.type({
    name: S.string,
    age: S.Int
  })
  return {
    Person
  }
}

describe('Schema', () => {
  it('should handle decoders', () => {
    const schema = getSchema(D.decoder)
    assert.deepStrictEqual(schema.Person.decode({ name: 'name', age: 46 }), right({ name: 'name', age: 46 }))
  })

  it('should handle encoders', () => {
    const schema = getSchema(E.encoder)
    assert.deepStrictEqual(schema.Person.encode({ name: 'name', age: 46 as S.Int }), { name: 'name', age: 46 })
  })

  it('should handle guards', () => {
    const schema = getSchema(G.guard)
    assert.deepStrictEqual(schema.Person.is({ name: 'name', age: 46 }), true)
  })
})
