import * as t from '../src'

//
// recursion
//

interface RecT1 {
  type: 'a'
  items: Array<RecT1>
}

const Rec1: t.LazyType<RecT1, RecT1> = t.lazy('T', () =>
  t.type({
    type: t.literal('a'),
    items: t.array(Rec1)
  })
)

// $ExpectError
const Rec2 = t.lazy<string>('T', () => {
  return t.type({
    type: t.literal('a'),
    items: t.array(Rec2)
  })
})

//
// literal
//

const L1 = t.literal('a')
type Assert1 = t.TypeOf<typeof L1> // $ExpectType "a"

//
// keyof
//

const K1 = t.keyof({ a: true, b: true })
type Assert2 = t.TypeOf<typeof K1> // $ExpectType "a" | "b"

//
// default types
//

type Assert3 = t.TypeOf<typeof t.null> // $ExpectType null

type Assert4 = t.TypeOf<typeof t.undefined> // $ExpectType undefined

type Assert5 = t.TypeOf<typeof t.string> // $ExpectType string

//
// array
//

const A1 = t.array(t.number)
type Assert7 = t.TypeOf<typeof A1> // $ExpectType number[]

//
// interface
//

const I1 = t.type({ name: t.string, age: t.number })
type Assert8 = t.TypeOf<typeof I1> // $ExpectType { name: string; age: number; }
// $ExpectError
const x6: t.TypeOf<typeof I1> = {}
// $ExpectError
const x7: t.TypeOf<typeof I1> = { name: 'name' }
// $ExpectError
const x8: t.TypeOf<typeof I1> = { age: 43 }
const x9: t.TypeOf<typeof I1> = { name: 'name', age: 43 }

const I2 = t.type({ name: t.string, father: t.type({ surname: t.string }) })
type I2T = t.TypeOf<typeof I2>
// $ExpectError
const x10: I2T = { name: 'name', father: {} }
const x11: I2T = { name: 'name', father: { surname: 'surname' } }

//
// dictionary
//

const D1 = t.dictionary(t.keyof({ a: true }), t.number)
type Assert9 = t.TypeOf<typeof D1> // $ExpectType { a: number; }
// $ExpectError
const x12: t.TypeOf<typeof D1> = { a: 's' }
// $ExpectError
const x12_2: t.TypeOf<typeof D1> = { c: 1 }
const x13: t.TypeOf<typeof D1> = { a: 1 }

//
// union
//

const U1 = t.union([t.string, t.number])
type Assert10 = t.TypeOf<typeof U1> // $ExpectType string | number

//
// intersection
//

const IN2 = t.intersection([t.type({ a: t.number }), t.type({ b: t.string })])
type Assert12 = t.TypeOf<typeof IN2>
type Assert12_a = Assert12['a'] // $ExpectType number
type Assert12_b = Assert12['b'] // $ExpectType string
// $ExpectError
const x17: t.TypeOf<typeof IN2> = { a: 1 }
const x18: t.TypeOf<typeof IN2> = { a: 1, b: 's' }

declare function testIntersectionInput<T>(x: t.Type<Record<keyof T, string>, any, unknown>): void
declare function testIntersectionOuput<T>(x: t.Type<any, Record<keyof T, string>, unknown>): void
const QueryString = t.intersection([
  t.interface({
    a: t.string
  }),
  t.interface({
    b: t.number
  })
])
// $ExpectError
testIntersectionInput(QueryString)
// $ExpectError
testIntersectionOuput(QueryString)

const IntersectionWithPrimitive = t.intersection([
  t.number,
  t.type({
    a: t.literal('a')
  })
])

type IntersectionWithPrimitive = t.TypeOf<typeof IntersectionWithPrimitive> // $ExpectType number & { a: "a"; }

//
// tuple
//

const T1 = t.tuple([t.string, t.number])
type Assert13 = t.TypeOf<typeof T1>
type Assert13_0 = Assert13[0] // $ExpectType string
type Assert13_1 = Assert13[1] // $ExpectType number

//
// partial
//

const P1 = t.partial({ name: t.string })
type Assert14 = t.TypeOf<typeof P1> // $ExpectType { name?: string | undefined; }
type P1T = t.TypeOf<typeof P1>
// $ExpectError
const x21: P1T = { name: 1 }
const x22: P1T = {}
const x23: P1T = { name: 's' }

//
// UnionToIntersection
//

type UnionToIntersection<U> = (U extends any ? (u: U) => void : never) extends ((u: infer I) => void) ? I : never

type UnionToIntersection1 = UnionToIntersection<string | string> // $ExpectType string
type UnionToIntersection2 = UnionToIntersection<string | number> // $ExpectType string & number
type UnionToIntersection3 = UnionToIntersection<{ a: string } | { b: number }> // $ExpectType { a: string; } & { b: number; }
