import * as assert from 'assert'
import * as DE from '../src/DecodeError'

describe('DecodeError', () => {
  it('semigroupDecodeError', () => {
    const a = DE.and([DE.leaf(null, 'a')], 'a')
    const b = DE.and([DE.leaf(null, 'b')], 'b')
    const leaf = DE.leaf(null, 'l')
    const c = DE.and([DE.leaf(null, 'c')])
    assert.deepStrictEqual(DE.semigroupDecodeError.concat(a, leaf), DE.and([a, leaf]))
    assert.deepStrictEqual(DE.semigroupDecodeError.concat(leaf, a), DE.and([leaf, a]))
    assert.deepStrictEqual(DE.semigroupDecodeError.concat(a, b), DE.and([a, b]))
    assert.deepStrictEqual(DE.semigroupDecodeError.concat(c, a), DE.and([DE.leaf(null, 'c'), a]))
  })
})
