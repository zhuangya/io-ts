import * as assert from 'assert'
import * as t from '../src/index'
import { assertFailure, assertSuccess, NumberFromString } from './helpers'

describe('union', () => {
  describe('name', () => {
    it('should assign a default name', () => {
      const T = t.union([t.string, t.number])
      assert.strictEqual(T.name, '(string | number)')
    })

    it('should accept a name', () => {
      const T = t.union([t.string, t.number], 'T')
      assert.strictEqual(T.name, 'T')
    })
  })

  describe('is', () => {
    it('should check a isomorphic value', () => {
      const T = t.union([t.string, t.number])
      assert.strictEqual(T.is(0), true)
      assert.strictEqual(T.is('foo'), true)
      assert.strictEqual(T.is(true), false)
    })

    it('should check a prismatic value', () => {
      const T = t.union([t.string, NumberFromString])
      assert.strictEqual(T.is(0), true)
      assert.strictEqual(T.is('foo'), true)
      assert.strictEqual(T.is(true), false)
    })
  })

  describe('decode', () => {
    it('should decode a isomorphic value', () => {
      const T = t.union([t.string, t.number])
      assertSuccess(T.decode('s'))
      assertSuccess(T.decode(1))
    })

    it('should fail decoding an invalid value', () => {
      const T = t.union([t.string, t.number])
      assertFailure(T.decode(true), [
        'Invalid value true supplied to (string | number)/_: string',
        'Invalid value true supplied to (string | number)/_: number'
      ])
    })
  })

  describe('encode', () => {
    it('should encode a prismatic value', () => {
      const T1 = t.union([t.interface({ a: NumberFromString }), t.number])
      assert.deepEqual(T1.encode({ a: 1 }), { a: '1' })
      assert.strictEqual(T1.encode(1), 1)
    })
  })
})
