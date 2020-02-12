/**
 * @since 3.0.0
 */
import * as fc from 'fast-check'
import { isNonEmpty, unsafeUpdateAt } from 'fp-ts/lib/Array'
import { Either, isLeft } from 'fp-ts/lib/Either'
import { not } from 'fp-ts/lib/function'
import * as A from './Arbitrary'
import * as G from './Guard'
import { Literal } from './Literal'
import * as S from './Schemable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export interface ArbitraryMutation<A> {
  /** the mutation */
  mutation: fc.Arbitrary<unknown>
  /** the corresponding valid arbitrary */
  arbitrary: fc.Arbitrary<A>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function make<A>(mutation: fc.Arbitrary<unknown>, arbitrary: fc.Arbitrary<A>): ArbitraryMutation<A> {
  return { mutation, arbitrary }
}

/**
 * @since 3.0.0
 */
export function literal<A extends Literal>(value: A): ArbitraryMutation<A> {
  return literals([value])
}

const literalsArbitrary: A.Arbitrary<Literal> = A.union([A.string, A.number, A.boolean, fc.constant(null)])

/**
 * @since 3.0.0
 */
export function literals<A extends Literal>(values: readonly [A, ...Array<A>]): ArbitraryMutation<A> {
  return make(literalsArbitrary.filter(not(G.literals(values).is)), A.literals(values))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(
  values: readonly [A, ...Array<A>],
  or: ArbitraryMutation<B>
): ArbitraryMutation<A | B> {
  return make(A.union([literals(values).mutation, or.mutation]), A.literalsOr(values, or.arbitrary))
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: ArbitraryMutation<string> = make(fc.oneof<number | boolean>(A.number, A.boolean), A.string)

/**
 * @since 3.0.0
 */
export const number: ArbitraryMutation<number> = make(fc.oneof<string | boolean>(A.string, A.boolean), A.number)

/**
 * @since 3.0.0
 */
export const boolean: ArbitraryMutation<boolean> = make(
  fc.oneof<string | number>(
    A.string,
    A.number,
    fc.oneof(fc.constant('true'), fc.constant('false'), fc.constant('0'), fc.constant('1'))
  ),
  A.boolean
)

/**
 * @since 3.0.0
 */
export const UnknownArray: ArbitraryMutation<Array<unknown>> = make(A.UnknownRecord, A.UnknownArray)

/**
 * @since 3.0.0
 */
export const UnknownRecord: ArbitraryMutation<Record<string, unknown>> = make(A.UnknownArray, A.UnknownRecord)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function parse<A, B>(from: ArbitraryMutation<A>, parser: (a: A) => Either<string, B>): ArbitraryMutation<B> {
  return make(
    from.arbitrary.filter(a => isLeft(parser(a))),
    A.parse(from.arbitrary, parser)
  )
}

/**
 * @since 3.0.0
 */
export function type<A>(properties: { [K in keyof A]: ArbitraryMutation<A[K]> }): ArbitraryMutation<A> {
  const keys = Object.keys(properties)
  if (keys.length === 0) {
    return make(fc.constant([]), fc.constant({} as A))
  }
  const mutations: Record<string, fc.Arbitrary<unknown>> = {}
  const arbitraries: { [K in keyof A]: fc.Arbitrary<A[K]> } = {} as any
  for (const k in properties) {
    mutations[k] = properties[k].mutation
    arbitraries[k] = properties[k].arbitrary
  }
  const key: fc.Arbitrary<string> = fc.oneof(...keys.map(key => fc.constant(key)))
  const arbitrary = A.type(arbitraries)
  return make(
    arbitrary.chain(a => key.chain(key => mutations[key].map(m => ({ ...a, [key]: m })))),
    arbitrary
  )
}

function nonEmpty(o: object): boolean {
  return Object.keys(o).length > 0
}

/**
 * @since 3.0.0
 */
export function partial<A>(properties: { [K in keyof A]: ArbitraryMutation<A[K]> }): ArbitraryMutation<Partial<A>> {
  const keys = Object.keys(properties)
  if (keys.length === 0) {
    return make(fc.constant([]), fc.constant({} as A))
  }
  const mutations: Record<string, fc.Arbitrary<unknown>> = {}
  const arbitraries: { [K in keyof A]: fc.Arbitrary<A[K]> } = {} as any
  for (const k in properties) {
    mutations[k] = properties[k].mutation
    arbitraries[k] = properties[k].arbitrary
  }
  const key: fc.Arbitrary<string> = fc.oneof(...keys.map(key => fc.constant(key)))
  const arbitrary = A.partial(arbitraries)
  return make(
    arbitrary.filter(nonEmpty).chain(a => key.chain(key => mutations[key].map(m => ({ ...a, [key]: m })))),
    arbitrary
  )
}

/**
 * @since 3.0.0
 */
export function record<A>(codomain: ArbitraryMutation<A>): ArbitraryMutation<Record<string, A>> {
  return make(A.record(codomain.mutation).filter(nonEmpty), A.record(codomain.arbitrary))
}

/**
 * @since 3.0.0
 */
export function array<A>(items: ArbitraryMutation<A>): ArbitraryMutation<Array<A>> {
  return make(A.array(items.mutation).filter(isNonEmpty), A.array(items.arbitrary))
}

/**
 * @since 3.0.0
 */
export function tuple<A, B>(left: ArbitraryMutation<A>, right: ArbitraryMutation<B>): ArbitraryMutation<[A, B]> {
  const mutations = [left.mutation, right.mutation]
  const index: fc.Arbitrary<0 | 1> = fc.oneof(fc.constant(0), fc.constant(1))
  const arbitrary = A.tuple(left.arbitrary, right.arbitrary)
  return make(
    arbitrary.chain(t => index.chain(i => mutations[i].map(m => unsafeUpdateAt(i, m, t)))),
    arbitrary
  )
}

/**
 * @since 3.0.0
 */
export function intersection<A, B>(left: ArbitraryMutation<A>, right: ArbitraryMutation<B>): ArbitraryMutation<A & B> {
  return make(A.intersection(left.mutation, right.mutation), A.intersection(left.arbitrary, right.arbitrary))
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(members: { [K in keyof A]: ArbitraryMutation<A[K] & Record<T, K>> }) => ArbitraryMutation<A[keyof A]> {
  const f = A.sum(tag)
  return (members: Record<string, ArbitraryMutation<any>>) => {
    const mutations: Record<string, fc.Arbitrary<any>> = {}
    const arbitraries: Record<string, fc.Arbitrary<any>> = {}
    for (const k in members) {
      mutations[k] = members[k].mutation
      arbitraries[k] = members[k].arbitrary
    }
    return make(f(mutations), f(arbitraries))
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => ArbitraryMutation<A>): ArbitraryMutation<A> {
  return make(
    A.lazy(() => f().mutation),
    A.lazy(() => f().arbitrary)
  )
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, ...Array<unknown>]>(
  members: { [K in keyof A]: ArbitraryMutation<A[K]> }
): ArbitraryMutation<A[number]> {
  const mutations = members.map(am => am.mutation)
  const arbitraries = members.map(am => am.arbitrary)
  return make(A.union(mutations as any), A.union(arbitraries as any))
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const URI = 'ArbitraryMutation'

/**
 * @since 3.0.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly ArbitraryMutation: ArbitraryMutation<A>
  }
}

/**
 * @since 3.0.0
 */
export const arbitraryMutation: S.Schemable<URI> & S.WithUnion<URI> & S.WithParse<URI> = {
  URI,
  literal,
  literals,
  literalsOr,
  string,
  number,
  boolean,
  UnknownArray,
  UnknownRecord,
  type,
  partial,
  record,
  array,
  tuple,
  intersection,
  sum,
  lazy: (_, f) => lazy(f),
  refinement: parse,
  parse,
  union
}
