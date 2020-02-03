/**
 * @since 3.0.0
 */
import * as fc from 'fast-check'
import * as C from 'fp-ts/lib/Const'
import { Either, isLeft } from 'fp-ts/lib/Either'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as A from './Arbitrary'
import * as S from './Schemable'
import * as G from './Guard'
import { not } from 'fp-ts/lib/function'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export interface Model<A> extends fc.Arbitrary<unknown> {
  arb: fc.Arbitrary<A>
}

/**
 * @since 3.0.0
 */
export type ArbitraryMutation<A> = C.Const<Model<A>, A>

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function make<A>(mutation: fc.Arbitrary<unknown>, arb: fc.Arbitrary<A>): ArbitraryMutation<A> {
  return C.make(Object.assign(mutation, { arb }))
}

/**
 * @since 3.0.0
 */
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): ArbitraryMutation<A> {
  return make(fc.string().filter(not(G.literals(values).is)), A.literals(values))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal, B>(
  values: NonEmptyArray<A>,
  mutation: ArbitraryMutation<B>
): ArbitraryMutation<A | B> {
  return make(fc.oneof(literals(values), mutation), A.literalsOr(values, mutation.arb))
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
export const boolean: ArbitraryMutation<boolean> = make(fc.oneof<string | number>(A.string, A.number), A.boolean)

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
export function parse<A, B>(mutation: ArbitraryMutation<A>, parser: (a: A) => Either<string, B>): ArbitraryMutation<B> {
  return make(
    mutation.arb.filter(a => isLeft(parser(a))),
    A.parse(mutation.arb, parser)
  )
}

/**
 * @since 3.0.0
 */
export function type<A>(mutations: { [K in keyof A]: ArbitraryMutation<A[K]> }): ArbitraryMutation<A> {
  const muts: Record<string, fc.Arbitrary<unknown>> = {}
  const arbs: { [K in keyof A]: fc.Arbitrary<A[K]> } = {} as any
  for (const k in mutations) {
    muts[k] = mutations[k]
    arbs[k] = mutations[k].arb
  }
  return make(
    fc.record(muts, { withDeletedKeys: true }).filter(pru => Object.keys(pru).length > 0),
    A.type(arbs)
  )
}

/**
 * @since 3.0.0
 */
export function partial<A>(mutations: { [K in keyof A]: ArbitraryMutation<A[K]> }): ArbitraryMutation<Partial<A>> {
  const muts: Record<string, fc.Arbitrary<unknown>> = {}
  const arbs: { [K in keyof A]: fc.Arbitrary<A[K]> } = {} as any
  for (const k in mutations) {
    muts[k] = mutations[k]
    arbs[k] = mutations[k].arb
  }
  return make(
    A.partial(muts).filter(pru => Object.keys(pru).length > 0),
    A.partial(arbs)
  )
}

/**
 * @since 3.0.0
 */
export function record<A>(mutation: ArbitraryMutation<A>): ArbitraryMutation<Record<string, A>> {
  return make(
    A.record(mutation).filter(ru => Object.keys(ru).length > 0),
    A.record(mutation.arb)
  )
}

/**
 * @since 3.0.0
 */
export function array<A>(mutation: ArbitraryMutation<A>): ArbitraryMutation<Array<A>> {
  return make(
    A.array(mutation).filter(us => us.length > 0),
    A.array(mutation.arb)
  )
}

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(
  mutations: [
    ArbitraryMutation<A>,
    ArbitraryMutation<B>,
    ArbitraryMutation<C>,
    ArbitraryMutation<D>,
    ArbitraryMutation<E>
  ]
): ArbitraryMutation<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  mutations: [ArbitraryMutation<A>, ArbitraryMutation<B>, ArbitraryMutation<C>, ArbitraryMutation<D>]
): ArbitraryMutation<[A, B, C, D]>
export function tuple<A, B, C>(
  mutations: [ArbitraryMutation<A>, ArbitraryMutation<B>, ArbitraryMutation<C>]
): ArbitraryMutation<[A, B, C]>
export function tuple<A, B>(mutations: [ArbitraryMutation<A>, ArbitraryMutation<B>]): ArbitraryMutation<[A, B]>
export function tuple<A>(mutations: [ArbitraryMutation<A>]): ArbitraryMutation<[A]>
export function tuple(mutations: Array<ArbitraryMutation<any>>): ArbitraryMutation<any> {
  return make(A.tuple(mutations as any), A.tuple(mutations.map(m => m.arb) as any))
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(
  mutations: [
    ArbitraryMutation<A>,
    ArbitraryMutation<B>,
    ArbitraryMutation<C>,
    ArbitraryMutation<D>,
    ArbitraryMutation<E>
  ],
  name?: string
): ArbitraryMutation<A & B & C & D & E>
export function intersection<A, B, C, D>(
  mutations: [ArbitraryMutation<A>, ArbitraryMutation<B>, ArbitraryMutation<C>, ArbitraryMutation<D>],
  name?: string
): ArbitraryMutation<A & B & C & D>
export function intersection<A, B, C>(
  mutations: [ArbitraryMutation<A>, ArbitraryMutation<B>, ArbitraryMutation<C>]
): ArbitraryMutation<A & B & C>
export function intersection<A, B>(mutations: [ArbitraryMutation<A>, ArbitraryMutation<B>]): ArbitraryMutation<A & B>
export function intersection(mutations: Array<ArbitraryMutation<any>>): ArbitraryMutation<any> {
  return make(A.intersection(mutations as any), A.intersection(mutations.map(m => m.arb) as any))
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(
  mutations: { [K in keyof A]: ArbitraryMutation<A[K]> }
) => ArbitraryMutation<{ [K in keyof A]: { [F in T]: K } & A[K] }[keyof A]> {
  const f = A.sum(tag)
  return <A>(mutations: { [K in keyof A]: ArbitraryMutation<A[K]> }) => {
    const muts: Record<string, fc.Arbitrary<unknown>> = {}
    const arbs: { [K in keyof A]: fc.Arbitrary<A[K]> } = {} as any
    for (const k in mutations) {
      muts[k] = mutations[k].map(a => Object.assign(a, { [tag]: k }))
      arbs[k] = mutations[k].arb
    }

    return make(f(muts), f(arbs))
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => ArbitraryMutation<A>): ArbitraryMutation<A> {
  return make(
    A.lazy(f),
    A.lazy(() => f().arb)
  )
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, ...Array<unknown>]>(
  mutations: { [K in keyof A]: ArbitraryMutation<A[K]> }
): ArbitraryMutation<A[number]> {
  return make(A.union(mutations as any), A.union(mutations.map(m => m.arb) as any))
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
export const arbitraryMutation: S.Schemable<URI> & S.WithRefinement<URI> & S.WithUnion<URI> = {
  URI,
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
  lazy,
  refinement: parse,
  union
}
