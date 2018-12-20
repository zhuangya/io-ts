import * as assert from 'assert'
import * as t from '../src/index'
import { assertFailure, assertSuccess, NumberFromString } from './helpers'

describe('intersection', () => {
  describe('name', () => {
    it('should assign a default name', () => {
      const T = t.intersection([t.interface({ a: t.string }), t.interface({ b: t.number })])
      assert.strictEqual(T.name, '({ a: string } & { b: number })')
    })

    it('should accept a name', () => {
      const T = t.intersection([t.interface({ a: t.string }), t.interface({ b: t.number })], 'T')
      assert.strictEqual(T.name, 'T')
    })
  })

  describe('is', () => {
    it('should check a isomorphic value', () => {
      const T = t.intersection([t.interface({ a: t.string }), t.interface({ b: t.number })])
      assert.strictEqual(T.is({}), false)
      assert.strictEqual(T.is({ a: 'a' }), false)
      assert.strictEqual(T.is({ b: 1 }), false)
      assert.strictEqual(T.is({ a: 'a', b: 1 }), true)
    })

    it('should check a prismatic value', () => {
      const T = t.intersection([t.interface({ a: t.string }), t.interface({ b: NumberFromString })])
      assert.strictEqual(T.is({}), false)
      assert.strictEqual(T.is({ a: 'a' }), false)
      assert.strictEqual(T.is({ b: 1 }), false)
      assert.strictEqual(T.is({ a: 'a', b: 1 }), true)
    })
  })

  describe('decode', () => {
    it('should decode a isomorphic value', () => {
      const T = t.intersection([t.interface({ a: t.string }), t.interface({ b: t.number })])
      assertSuccess(T.decode({ a: 'a', b: 1 }))
    })

    it('should decode a prismatic value', () => {
      const T = t.intersection([t.interface({ a: t.string }), t.interface({ b: NumberFromString })])
      assertSuccess(T.decode({ a: 'a', b: '1' }), { a: 'a', b: 1 })
    })

    it('should strip additional properties', () => {
      const T = t.intersection([t.interface({ a: t.string }), t.interface({ b: t.number })])
      assertSuccess(T.decode({ a: 'a', b: 1, c: true }), { a: 'a', b: 1 })
    })

    it('should fail decoding an invalid value', () => {
      const T = t.intersection([t.interface({ a: t.string }), t.interface({ b: t.number })])
      assertFailure(T.decode({ a: 1 }), [
        'Invalid value 1 supplied to ({ a: string } & { b: number })/_: { a: string }/a: string',
        'Invalid value undefined supplied to ({ a: string } & { b: number })/_: { b: number }/b: number'
      ])
    })

    it('should handle primitive types', () => {
      const T1 = t.intersection([t.string, t.string])
      assertSuccess(T1.decode('foo'))
      const T2 = t.intersection([t.string, t.number])
      assertFailure(T2.decode('foo'), ['Invalid value "foo" supplied to (string & number)/_: number'])
    })
  })

  describe('encode', () => {
    it('should encode a isomorphic value', () => {
      const T = t.intersection([t.interface({ a: t.string }), t.interface({ b: t.number })])
      assert.deepEqual(T.encode({ a: 'a', b: 1 }), { a: 'a', b: 1 })
    })

    it('should encode a prismatic value', () => {
      const T = t.intersection([t.interface({ a: t.string }), t.interface({ b: NumberFromString })])
      assert.deepEqual(T.encode({ a: 'a', b: 1 }), { a: 'a', b: '1' })
    })

    it('should strip additional properties', () => {
      const T = t.intersection([t.interface({ a: t.string }), t.interface({ b: t.number })])
      const x = { a: 'a', b: 1, c: true }
      assert.deepEqual(T.encode(x), { a: 'a', b: 1 })
    })
  })
})
