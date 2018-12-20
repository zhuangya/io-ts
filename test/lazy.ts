import * as assert from 'assert'
import * as t from '../src/index'
import { assertFailure, assertSuccess, NumberFromString } from './helpers'

type T = {
  a: number
  b: T | undefined | null
}

const T: t.LazyType<T, T> = t.lazy('T', () =>
  t.interface({
    a: t.number,
    b: t.union([T, t.undefined, t.null])
  })
)

type O = {
  a: string
  b: O | undefined | null
}
const P: t.LazyType<T, O> = t.lazy('P', () =>
  t.interface({
    a: NumberFromString,
    b: t.union([P, t.undefined, t.null])
  })
)

describe('lazy', () => {
  describe('is', () => {
    it('should check a isomorphic value', () => {
      assert.strictEqual(T.is({ a: 1, b: null }), true)
      assert.strictEqual(T.is({ a: 1, b: { a: 2, b: null } }), true)
      assert.strictEqual(T.is({ a: 1, b: {} }), false)
    })
  })

  describe('decode', () => {
    it('should decode a isomorphic value', () => {
      assertSuccess(T.decode({ a: 1, b: null }))
      assertSuccess(T.decode({ a: 1, b: { a: 2, b: null } }))
    })

    it('should decode a prismatic value', () => {
      assertSuccess(P.decode({ a: '1', b: null }), { a: 1, b: null })
      assertSuccess(P.decode({ a: '1', b: { a: '2', b: null } }), { a: 1, b: { a: 2, b: null } })
    })

    it('should fail while decoding an invalid value', () => {
      assertFailure(T.decode(1), ['Invalid value 1 supplied to T'])
      assertFailure(T.decode({}), ['Invalid value undefined supplied to T/a: number'])
      assertFailure(T.decode({ a: 1, b: {} }), [
        'Invalid value undefined supplied to T/b: (T | undefined | null)/_: T/a: number',
        'Invalid value {} supplied to T/b: (T | undefined | null)/_: undefined',
        'Invalid value {} supplied to T/b: (T | undefined | null)/_: null'
      ])
    })

    it('should support mutually recursive types', () => {
      type A = {
        b: B | null
      }
      type B = {
        a: A | null
      }
      const A: t.LazyType<A, A> = t.lazy('A', () =>
        t.interface({
          b: t.union([B, t.null])
        })
      )
      const B = t.lazy('B', () =>
        t.interface({
          a: t.union([A, t.null])
        })
      )
      assert.strictEqual(A.is({ b: { a: null } }), true)
      assert.strictEqual(A.is({ b: { a: { b: { a: null } } } }), true)
    })
  })

  describe('encode', () => {
    it('should encode a isomorphic value', () => {
      assert.deepEqual(T.encode({ a: 1, b: null }), { a: 1, b: null })
      assert.deepEqual(T.encode({ a: 1, b: { a: 2, b: null } }), { a: 1, b: { a: 2, b: null } })
    })

    it('should encode a prismatic value', () => {
      assert.deepEqual(P.encode({ a: 1, b: null }), { a: '1', b: null })
      assert.deepEqual(P.encode({ a: 1, b: { a: 2, b: null } }), { a: '1', b: { a: '2', b: null } })
    })
  })
})
