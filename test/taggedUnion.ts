import * as assert from 'assert'
import * as t from '../src/index'
import { assertFailure, assertSuccess, NumberFromString } from './helpers'

const OptionNumber = t.union(
  [t.type({ type: t.literal('None') }, 'None'), t.type({ type: t.literal('Some'), value: t.number }, 'Some')],
  'OptionNumber'
)

const OptionNumberFromString = t.union(
  [t.type({ type: t.literal('None') }, 'None'), t.type({ type: t.literal('Some'), value: NumberFromString }, 'Some')],
  'OptionNumberFromString'
)

describe('taggedUnion', () => {
  describe('name', () => {
    it('should assign a default name', () => {
      const OptionNumber = t.union([
        t.type({ type: t.literal('None') }),
        t.type({ type: t.literal('Some'), value: t.number })
      ])
      assert.strictEqual(OptionNumber.name, '({ type: "None" } | { type: "Some", value: number })')
    })

    it('should accept a name', () => {
      const T = t.union(OptionNumber.types, 'T')
      assert.strictEqual(T.name, 'T')
    })
  })

  describe('is', () => {
    it('should check a isomorphic value', () => {
      assert.strictEqual(OptionNumber.is(null), false)
      assert.strictEqual(OptionNumber.is({}), false)
      assert.strictEqual(OptionNumber.is({ type: 'None' }), true)
      assert.strictEqual(OptionNumber.is({ type: 'Some' }), false)
      assert.strictEqual(OptionNumber.is({ type: 'Some', value: 'a' }), false)
      assert.strictEqual(OptionNumber.is({ type: 'Some', value: 1 }), true)
    })
  })

  describe('decode', () => {
    it('should decode a isomorphic value', () => {
      assertSuccess(OptionNumber.decode({ type: 'None' }))
      assertSuccess(OptionNumber.decode({ type: 'Some', value: 1 }))
    })

    it('should handle multiple tag candidates', () => {
      const A = t.type({ type: t.literal('A'), kind: t.literal('Kind') })
      const B = t.type({ type: t.literal('B'), kind: t.literal('Kind') })
      const U = t.union([A, B])
      assertSuccess(U.decode({ type: 'A', kind: 'Kind' }))
      assertSuccess(U.decode({ type: 'B', kind: 'Kind' }))
    })

    it('should handle intersections', () => {
      const A = t.intersection([t.type({ type: t.literal('A') }), t.partial({ a: t.string })])
      const B = t.type({ type: t.literal('B') })
      const U = t.union([A, B])
      assertSuccess(U.decode({ type: 'A' }))
      assertSuccess(U.decode({ type: 'B' }))
    })

    it('should handle unions', () => {
      const A = t.intersection([t.type({ type: t.literal('A') }), t.partial({ a: t.string })])
      const B = t.type({ type: t.literal('B') })
      const C = t.type({ type: t.literal('C') })
      const U = t.union([A, B])
      const U2 = t.union([U, C])
      assertSuccess(U2.decode({ type: 'A' }))
      assertSuccess(U2.decode({ type: 'B' }))
      assertSuccess(U2.decode({ type: 'C' }))
    })

    it('should decode a prismatic value', () => {
      assertSuccess(OptionNumberFromString.decode({ type: 'None' }))
      assertSuccess(OptionNumberFromString.decode({ type: 'Some', value: '1' }), { type: 'Some', value: 1 })
    })

    it('should fail validating an invalid value', () => {
      assertFailure(OptionNumber.decode(null), ['Invalid value null supplied to OptionNumber'])
      assertFailure(OptionNumber.decode({}), ['Invalid value undefined supplied to OptionNumber/type: "None" | "Some"'])
      assertFailure(OptionNumber.decode({ type: 'Some' }), [
        'Invalid value undefined supplied to OptionNumber/_: Some/value: number'
      ])
    })

    it('should work when tag values are numbers', () => {
      const T = t.union([t.type({ type: t.literal(1), a: t.string }), t.type({ type: t.literal(2), b: t.number })])
      assertSuccess(T.decode({ type: 1, a: 'a' }))
      assertFailure(T.decode({ type: 1, a: 1 }), [
        'Invalid value 1 supplied to ({ type: 1, a: string } | { type: 2, b: number })/_: { type: 1, a: string }/a: string'
      ])
      assertFailure(T.decode({ type: 2 }), [
        'Invalid value undefined supplied to ({ type: 1, a: string } | { type: 2, b: number })/_: { type: 2, b: number }/b: number'
      ])
    })

    it('should work when tag values are booleans', () => {
      const T = t.union([
        t.type({ type: t.literal(true), a: t.string }),
        t.type({ type: t.literal(false), b: t.number })
      ])
      assertSuccess(T.decode({ type: true, a: 'a' }))
      assertFailure(T.decode({ type: true, a: 1 }), [
        'Invalid value 1 supplied to ({ type: true, a: string } | { type: false, b: number })/_: { type: true, a: string }/a: string'
      ])
      assertFailure(T.decode({ type: false }), [
        'Invalid value undefined supplied to ({ type: true, a: string } | { type: false, b: number })/_: { type: false, b: number }/b: number'
      ])
    })

    it('should work when tag values are booleans', () => {
      const T = t.union([
        t.type({ type: t.literal(true), a: t.string }),
        t.type({ type: t.literal(false), b: t.number })
      ])
      assertSuccess(T.decode({ type: true, a: 'a' }))
      assertFailure(T.decode({ type: true, a: 1 }), [
        'Invalid value 1 supplied to ({ type: true, a: string } | { type: false, b: number })/_: { type: true, a: string }/a: string'
      ])
      assertFailure(T.decode({ type: false }), [
        'Invalid value undefined supplied to ({ type: true, a: string } | { type: false, b: number })/_: { type: false, b: number }/b: number'
      ])
    })

    it('should work when tag values are both strings and numbers with the same string representation', () => {
      const T = t.union([t.type({ type: t.literal(1), a: t.string }), t.type({ type: t.literal('1'), b: t.number })])
      assertSuccess(T.decode({ type: 1, a: 'a' }))
      assertFailure(T.decode({ type: 1, a: 1 }), [
        'Invalid value 1 supplied to ({ type: 1, a: string } | { type: "1", b: number })/_: { type: 1, a: string }/a: string'
      ])
      assertSuccess(T.decode({ type: '1', b: 1 }))
      assertFailure(T.decode({ type: '1' }), [
        'Invalid value undefined supplied to ({ type: 1, a: string } | { type: "1", b: number })/_: { type: "1", b: number }/b: number'
      ])
    })
  })

  describe('encode', () => {
    it('should encode a isomorphic value', () => {
      assert.deepEqual(OptionNumber.encode({ type: 'Some', value: 1 }), { type: 'Some', value: 1 })
    })

    it('should encode a prismatic value', () => {
      assert.deepEqual(OptionNumberFromString.encode({ type: 'Some', value: 1 }), { type: 'Some', value: '1' })
    })
  })
})

const TUA = t.type(
  {
    type: t.literal('a'),
    foo: t.string
  },
  'TUA'
)

const TUB = t.intersection(
  [
    t.type({
      type: t.literal('b')
    }),
    t.type({
      bar: t.number
    })
  ],
  'TUB'
)

const TUC = t.type(
  {
    type: t.literal('c'),
    baz: NumberFromString
  },
  'TUC'
)

const TUD = t.intersection(
  [
    t.type({
      bar: t.number
    }),
    t.type({
      type: t.literal('d')
    })
  ],
  'TUD'
)

const T = t.union([TUA, TUB, TUC, TUD])

describe('getTypeIndex', () => {
  const A = t.type({ type: t.literal('A'), a: t.string })
  const B = t.type({ type: t.literal('B'), b: t.number })
  const C = t.union([A, B])
  const I = t.intersection([
    t.type({
      type: t.literal('I')
    }),
    t.type({
      i: t.number
    })
  ])

  it('InterfaceType', () => {
    assert.deepEqual(t.getTypeIndex(t.string), {})
    assert.deepEqual(t.getTypeIndex(t.type({ a: t.string })), {})
    assert.deepEqual(t.getTypeIndex(A), { type: [['A', A]] })
  })

  it('UnionType', () => {
    assert.deepEqual(t.getTypeIndex(t.union([t.number, t.string])), {})
    assert.deepEqual(t.getTypeIndex(t.union([A, t.string])), {})
    assert.deepEqual(t.getTypeIndex(C), { type: [['A', A], ['B', B]] })
    assert.deepEqual(t.getTypeIndex(t.union([A, A])), { type: [['A', A]] })
    assert.deepEqual(t.getTypeIndex(t.union([A, B, t.type({ type: t.literal('A'), a: t.number })])), {})
  })

  it('IntersectionType', () => {
    assert.deepEqual(t.getTypeIndex(I), { type: [['I', I]] })
    const AA = t.intersection([A, A])
    assert.deepEqual(t.getTypeIndex(AA), { type: [['A', AA], ['A', AA]] })
    const AB = t.intersection([A, t.type({ type2: t.literal('B') })])
    assert.deepEqual(t.getTypeIndex(AB), { type: [['A', AB]], type2: [['B', AB]] })
  })
})

describe('getIndex', () => {
  it('0', () => {
    const A = t.type({ type: t.literal('A') })
    assert.deepEqual(t.getIndex([A, A]), { type: [['A', A]] })
  })

  it('1', () => {
    const A = t.type({ type: t.literal('A') })
    const B = t.type({ type: t.literal('A') })
    assert.deepEqual(t.getIndex([A, B]), {})
  })

  it('2', () => {
    const A = t.type({ type: t.literal('A') })
    const B = t.type({ type: t.literal('B') })
    const index = t.getIndex([A, B])
    assert.deepEqual(index, { type: [['A', A], ['B', B]] })
  })

  it('3', () => {
    assert.deepEqual(t.getIndex([TUA]), { type: [['a', TUA]] })
    assert.deepEqual(t.getIndex([TUA, TUB]), { type: [['a', TUA], ['b', TUB]] })
    assert.deepEqual(t.getIndex([TUC]), { type: [['c', TUC]] })
    assert.deepEqual(t.getIndex([TUA, TUB, TUC]), { type: [['a', TUA], ['b', TUB], ['c', TUC]] })
    assert.deepEqual(t.getIndex(T.types), { type: [['a', TUA], ['b', TUB], ['c', TUC], ['d', TUD]] })
  })
})
