import * as assert from 'assert'
import * as E from 'fp-ts/lib/Either'
import * as D from '../src/Decoder'
import { mapLeft } from '../src/Tree'

describe('Tree', () => {
  it('should draw a tree', () => {
    const codec = D.type({
      a: D.string
    })
    assert.deepStrictEqual(mapLeft(codec.decode({ a: 'a' })), E.right({ a: 'a' }))
    assert.deepStrictEqual(
      mapLeft(codec.decode({ a: 1 })),
      E.left(`required property "a"
└─ cannot decode 1, should be string`)
    )
  })
})
