/**
 * @since 3.0.0
 */
import * as fc from 'fast-check'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as S from './Schemable'
import Arbitrary = fc.Arbitrary
import { Either } from 'fp-ts/lib/Either'

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function literals<A extends S.Literal>(as: NonEmptyArray<A>): Arbitrary<A> {
  return fc.oneof(...as.map(a => fc.constant(a)))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal, B>(as: NonEmptyArray<A>, arb: Arbitrary<B>): Arbitrary<A | B> {
  return fc.oneof<A | B>(literals(as), arb)
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
export function parse<A, B>(arb: Arbitrary<A>, parser: (a: A) => Either<string, B>): Arbitrary<B> {
  return arb.filter(a => parser(a)._tag === 'Right') as any
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
export function sum<T extends string>(
  tag: T
): <A>(arbs: { [K in keyof A]: Arbitrary<A[K]> }) => Arbitrary<{ [K in keyof A]: { [F in T]: K } & A[K] }[keyof A]> {
  return (arbs: any) => {
    return fc.oneof(...Object.keys(arbs).map(k => arbs[k].map((a: any) => ({ ...a, [tag]: k }))))
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  arbs: { [K in keyof A]: Arbitrary<A[K]> }
): Arbitrary<A[number]> {
  return fc.oneof(...arbs)
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
export const arbitrary: S.Schemable<URI> & S.WithParse<URI> & S.WithUnion<URI> = {
  URI,
  literals,
  literalsOr,
  string,
  number,
  boolean,
  Int,
  UnknownArray,
  UnknownRecord,
  type,
  partial,
  record,
  array,
  tuple,
  intersection,
  sum,
  parse,
  union
}
