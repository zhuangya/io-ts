import * as assert from 'assert'
import { right } from 'fp-ts/lib/Either'
import { URIS } from 'fp-ts/lib/HKT'
import * as D from '../src/Decoder'
import * as S from '../src/Schemable'
import * as E from '../src/Encoder'
import * as G from '../src/Guard'
import * as C from '../src/Codec'

const Person = <F extends URIS>(S: S.Schemable<F>) =>
  S.type({
    name: S.string,
    age: S.Int
  })

describe('Schemable', () => {
  it('should handle decoders', () => {
    assert.deepStrictEqual(Person(D.decoder).decode({ name: 'name', age: 46 }), right({ name: 'name', age: 46 }))
  })

  it('should handle encoders', () => {
    assert.deepStrictEqual(Person(E.encoder).encode({ name: 'name', age: 46 as S.Int }), { name: 'name', age: 46 })
  })

  it('should handle guards', () => {
    assert.deepStrictEqual(Person(G.guard).is({ name: 'name', age: 46 }), true)
  })

  it('should handle codecs', () => {
    assert.deepStrictEqual(Person(C.codec).decode({ name: 'name', age: 46 }), right({ name: 'name', age: 46 }))
    assert.deepStrictEqual(Person(E.encoder).encode({ name: 'name', age: 46 as S.Int }), { name: 'name', age: 46 })
  })
})
