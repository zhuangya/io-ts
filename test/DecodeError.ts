import * as assert from 'assert'
import * as DE from '../src/DecodeError'

describe('DecodeError', () => {
  it('semigroupDecodeError', () => {
    const a = DE.leaf(null, 'a')
    const b = DE.leaf(null, 'b')
    const c = DE.and([a], 'c')
    const d = DE.and([a])
    const e = DE.and([b], 'c')
    assert.deepStrictEqual(DE.semigroupDecodeError.concat(a, a), DE.and([a, a]))
    assert.deepStrictEqual(DE.semigroupDecodeError.concat(a, b), DE.and([a, b]))
    assert.deepStrictEqual(DE.semigroupDecodeError.concat(b, a), DE.and([b, a]))
    assert.deepStrictEqual(DE.semigroupDecodeError.concat(a, c), DE.and([a, c]))
    assert.deepStrictEqual(DE.semigroupDecodeError.concat(c, a), DE.and([c, a]))
    assert.deepStrictEqual(DE.semigroupDecodeError.concat(d, d), DE.and([a, a]))
    assert.deepStrictEqual(DE.semigroupDecodeError.concat(d, b), DE.and([a, b]))
    assert.deepStrictEqual(DE.semigroupDecodeError.concat(b, d), DE.and([b, a]))
    assert.deepStrictEqual(DE.semigroupDecodeError.concat(c, e), DE.and([a, b], 'c'))
    assert.deepStrictEqual(DE.semigroupDecodeError.concat(e, c), DE.and([b, a], 'c'))
  })
})
