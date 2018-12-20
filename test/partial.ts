import * as assert from 'assert'
import * as t from '../src/index'
import { assertFailure, assertSuccess, NumberFromString } from './helpers'

describe('partial', () => {
  describe('name', () => {
    it('should assign a default name', () => {
      const T = t.partial({ a: t.number })
      assert.strictEqual(T.name, 'Partial<{ a: number }>')
    })

    it('should accept a name', () => {
      const T = t.partial({ a: t.number }, 'T')
      assert.strictEqual(T.name, 'T')
    })
  })

  describe('is', () => {
    it('should check a isomorphic value', () => {
      const T = t.partial({ a: t.number })
      assert.strictEqual(T.is({}), true)
      assert.strictEqual(T.is({ a: 1 }), true)
      assert.strictEqual(T.is(undefined), false)
      assert.strictEqual(T.is({ a: 'foo' }), false)
    })

    it('should check a prismatic value', () => {
      const T = t.partial({ a: NumberFromString })
      assert.strictEqual(T.is({}), true)
      assert.strictEqual(T.is({ a: 1 }), true)
      assert.strictEqual(T.is(undefined), false)
      assert.strictEqual(T.is({ a: 'foo' }), false)
    })
  })

  describe('decode', () => {
    it('should decode a isomorphic value', () => {
      const T = t.partial({ a: t.number })
      assertSuccess(T.decode({}), {})
      assertSuccess(T.decode({ a: undefined }), { a: undefined })
      assertSuccess(T.decode({ a: 1 }), { a: 1 })
    })

    it('should strip unknown properties', () => {
      const T = t.partial({ a: t.number })
      assertSuccess(T.decode({ b: 'b' }), {})
    })

    it('should fail validating an invalid value', () => {
      const T = t.partial({ a: t.number })
      assertFailure(T.decode(null), ['Invalid value null supplied to Partial<{ a: number }>'])
      assertFailure(T.decode({ a: 's' }), [
        'Invalid value "s" supplied to Partial<{ a: number }>/a: (undefined | number)/_: undefined',
        'Invalid value "s" supplied to Partial<{ a: number }>/a: (undefined | number)/_: number'
      ])
    })
  })

  describe('encode', () => {
    it('should encode a isomorphic value', () => {
      const T = t.partial({ a: t.number })
      assert.deepEqual(T.encode({}), {})
      assert.deepEqual(T.encode({ a: undefined }), { a: undefined })
      assert.deepEqual(T.encode({ a: 1 }), { a: 1 })
    })

    it('should encode a prismatic value', () => {
      const T = t.partial({ a: NumberFromString })
      assert.deepEqual(T.encode({}), {})
      assert.deepEqual(T.encode({ a: undefined }), { a: undefined })
      assert.deepEqual(T.encode({ a: 1 }), { a: '1' })
    })

    it('should strip addditional properties', () => {
      const T = t.partial({ a: t.number })
      const x = { a: 1, b: 'b' }
      assert.deepEqual(T.encode(x), { a: 1 })
    })
  })
})
