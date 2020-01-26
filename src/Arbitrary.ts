/**
 * @since 3.0.0
 */
import * as fc from 'fast-check'
import { Refinement } from 'fp-ts/lib/function'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as S from './Schemable'
import Arbitrary = fc.Arbitrary

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function constants<A>(as: NonEmptyArray<A>): Arbitrary<A> {
  return fc.oneof(...as.map(a => fc.constant(a)))
}

/**
 * @since 3.0.0
 */
export function constantsOr<A, B>(as: NonEmptyArray<A>, arb: Arbitrary<B>): Arbitrary<A | B> {
  return fc.oneof<A | B>(constants(as), arb)
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Arbitrary<string> = fc.string()

/**
 * @since 3.0.0
 */
export const number: Arbitrary<number> = fc.float()

/**
 * @since 3.0.0
 */
export const boolean: Arbitrary<boolean> = fc.boolean()

/**
 * @since 3.0.0
 */
export const UnknownArray: Arbitrary<Array<unknown>> = fc.array(fc.anything())

/**
 * @since 3.0.0
 */
export const UnknownRecord: Arbitrary<Record<string, unknown>> = fc.dictionary(string, fc.anything())

/**
 * @since 3.0.0
 */
export const Int: Arbitrary<S.Int> = fc.integer() as any

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function refinement<A, B extends A>(arb: Arbitrary<A>, refinement: Refinement<A, B>): Arbitrary<B> {
  return arb.filter(refinement) as any
}

/**
 * @since 3.0.0
 */
export function type<A>(arbs: { [K in keyof A]: Arbitrary<A[K]> }): Arbitrary<A> {
  return fc.record(arbs)
}

/**
 * @since 3.0.0
 */
export function partial<A>(arbs: { [K in keyof A]: Arbitrary<A[K]> }): Arbitrary<Partial<A>> {
  return fc.record(arbs, { withDeletedKeys: true })
}

/**
 * @since 3.0.0
 */
export function record<A>(arb: Arbitrary<A>): Arbitrary<Record<string, A>> {
  return fc.dictionary(string, arb)
}

/**
 * @since 3.0.0
 */
export function array<A>(arb: Arbitrary<A>): Arbitrary<Array<A>> {
  return fc.array(arb)
}

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(
  arbs: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>, Arbitrary<D>, Arbitrary<E>]
): Arbitrary<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  arbs: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>, Arbitrary<D>]
): Arbitrary<[A, B, C, D]>
export function tuple<A, B, C>(arbs: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>]): Arbitrary<[A, B, C]>
export function tuple<A, B>(arbs: [Arbitrary<A>, Arbitrary<B>]): Arbitrary<[A, B]>
export function tuple<A>(arbs: [Arbitrary<A>]): Arbitrary<[A]>
export function tuple(arbs: Array<Arbitrary<any>>): Arbitrary<any> {
  return fc.genericTuple(arbs)
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(
  arbs: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>, Arbitrary<D>, Arbitrary<E>],
  name?: string
): Arbitrary<A & B & C & D & E>
export function intersection<A, B, C, D>(
  arbs: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>, Arbitrary<D>],
  name?: string
): Arbitrary<A & B & C & D>
export function intersection<A, B, C>(arbs: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>]): Arbitrary<A & B & C>
export function intersection<A, B>(arbs: [Arbitrary<A>, Arbitrary<B>]): Arbitrary<A & B>
export function intersection(arbs: Array<Arbitrary<any>>): Arbitrary<any> {
  return fc.genericTuple(arbs).map(as => Object.assign({}, ...as))
}

/**
 * @since 3.0.0
 */
export function lazy<A>(f: (iterations: number) => Arbitrary<A>): Arbitrary<A> {
  let iterations = 0
  const get = () => {
    return f(iterations)
  }
  return fc.constant(null).chain(() => get())
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(def: { [K in keyof A]: Arbitrary<A[K]> }) => Arbitrary<{ [K in keyof A]: { [F in T]: K } & A[K] }[keyof A]> {
  return (def: any) => {
    return fc.oneof(...Object.keys(def).map(k => def[k].map((a: any) => ({ ...a, [tag]: k }))))
  }
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const URI = 'Arbitrary'

/**
 * @since 3.0.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly Arbitrary: Arbitrary<A>
  }
}

/**
 * @since 3.0.0
 */
export const arbitrary: S.Schemable<URI> = {
  URI,
  constants,
  constantsOr,
  string,
  number,
  boolean,
  Int,
  refinement: refinement as S.Schemable<URI>['refinement'],
  UnknownArray,
  UnknownRecord,
  type,
  partial,
  record,
  array,
  tuple,
  intersection,
  lazy,
  sum
}
