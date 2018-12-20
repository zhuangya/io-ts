import * as assert from 'assert'
import * as t from '../src/index'
import { assertFailure, assertSuccess, NumberFromString } from './helpers'

describe('tuple', () => {
  describe('name', () => {
    it('should assign a default name', () => {
      const T = t.tuple([t.number, t.string])
      assert.strictEqual(T.name, '[number, string]')
    })

    it('should accept a name', () => {
      const T = t.tuple([t.number, t.string], 'T')
      assert.strictEqual(T.name, 'T')
    })
  })

  describe('is', () => {
    it('should check a isomorphic value', () => {
      const T = t.tuple([t.number, t.string])
      assert.strictEqual(T.is([0, 'foo']), true)
      assert.strictEqual(T.is([0, 2]), false)
      assert.strictEqual(T.is(undefined), false)
      assert.strictEqual(T.is([0]), false)
    })

    it('should check a prismatic value', () => {
      const T = t.tuple([NumberFromString, t.string])
      assert.strictEqual(T.is([0, 'foo']), true)
      assert.strictEqual(T.is([0, 2]), false)
      assert.strictEqual(T.is(undefined), false)
      assert.strictEqual(T.is([0]), false)
    })

    it('should check for additional components', () => {
      const T = t.tuple([t.number, t.string])
      assert.strictEqual(T.is([0, 'foo', true]), false)
    })
  })

  describe('decode', () => {
    it('should decode a isomorphic value', () => {
      const T = t.tuple([t.number, t.string])
      assertSuccess(T.decode([1, 'a']), [1, 'a'])
    })

    it('should decode a prismatic value', () => {
      const T = t.tuple([NumberFromString, t.string])
      assertSuccess(T.decode(['1', 'a']), [1, 'a'])
    })

    it('should strip additional components', () => {
      const T = t.tuple([t.number, t.string])
      assertSuccess(T.decode([1, 'a', true]), [1, 'a'])
    })

    it('should fail validating an invalid value', () => {
      const T = t.tuple([t.number, t.string])
      assertFailure(T.decode(1), ['Invalid value 1 supplied to [number, string]'])
      assertFailure(T.decode([]), [
        'Invalid value undefined supplied to [number, string]/0: number',
        'Invalid value undefined supplied to [number, string]/1: string'
      ])
      assertFailure(T.decode([1]), ['Invalid value undefined supplied to [number, string]/1: string'])
      assertFailure(T.decode([1, 1]), ['Invalid value 1 supplied to [number, string]/1: string'])
    })
  })

  describe('encode', () => {
    it('should encode a isomorphic value', () => {
      const T = t.tuple([t.number, t.string])
      assert.deepEqual(T.encode([1, 'a']), [1, 'a'])
    })

    it('should encode a prismatic value', () => {
      const T = t.tuple([NumberFromString, t.string])
      assert.deepEqual(T.encode([1, 'a']), ['1', 'a'])
    })
  })
})
