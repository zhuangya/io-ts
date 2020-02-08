/**
 * @since 3.0.0
 */
import * as fc from 'fast-check'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as S from './Schemable'
import { Either, isRight } from 'fp-ts/lib/Either'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export interface Arbitrary<A> extends fc.Arbitrary<A> {}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function literal<A extends S.Literal>(value: A): Arbitrary<A> {
  return fc.constant(value)
}

/**
 * @since 3.0.0
 */
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): Arbitrary<A> {
  return fc.oneof(...values.map(a => fc.constant(a)))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal, B>(values: NonEmptyArray<A>, arb: Arbitrary<B>): Arbitrary<A | B> {
  return fc.oneof<A | B>(literals(values), arb)
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Arbitrary<string> = fc.oneof(
  fc.string(),
  fc.asciiString(),
  fc.fullUnicodeString(),
  fc.hexaString(),
  fc.lorem()
)

/**
 * @since 3.0.0
 */
export const number: Arbitrary<number> = fc.oneof(fc.float(), fc.double(), fc.integer())

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

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function parse<A, B>(arb: Arbitrary<A>, parser: (a: A) => Either<string, B>): Arbitrary<B> {
  return arb
    .map(parser)
    .filter(isRight)
    .map((e: any) => e.right)
}

/**
 * @since 3.0.0
 */
export function type<A>(properties: { [K in keyof A]: Arbitrary<A[K]> }): Arbitrary<A> {
  return fc.record(properties)
}

/**
 * @since 3.0.0
 */
export function partial<A>(properties: { [K in keyof A]: Arbitrary<A[K]> }): Arbitrary<Partial<A>> {
  return fc.record(properties, { withDeletedKeys: true })
}

/**
 * @since 3.0.0
 */
export function record<A>(codomain: Arbitrary<A>): Arbitrary<Record<string, A>> {
  return fc.dictionary(string, codomain)
}

/**
 * @since 3.0.0
 */
export function array<A>(items: Arbitrary<A>): Arbitrary<Array<A>> {
  return fc.array(items)
}

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(
  items: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>, Arbitrary<D>, Arbitrary<E>]
): Arbitrary<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  items: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>, Arbitrary<D>]
): Arbitrary<[A, B, C, D]>
export function tuple<A, B, C>(items: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>]): Arbitrary<[A, B, C]>
export function tuple<A, B>(items: [Arbitrary<A>, Arbitrary<B>]): Arbitrary<[A, B]>
export function tuple<A>(items: [Arbitrary<A>]): Arbitrary<[A]>
export function tuple(items: Array<Arbitrary<unknown>>): Arbitrary<unknown> {
  return fc.genericTuple(items)
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
  _tag: T
): <A>(arbs: { [K in keyof A]: Arbitrary<A[K]> }) => Arbitrary<{ [K in keyof A]: { [F in T]: K } & A[K] }[keyof A]> {
  return (arbs: any) => {
    return fc.oneof(...Object.keys(arbs).map(k => arbs[k]))
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => Arbitrary<A>): Arbitrary<A> {
  const get = S.memoize<void, Arbitrary<A>>(f)
  return fc.constant(null).chain(() => get())
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, ...Array<unknown>]>(
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
export const arbitrary: S.Schemable<URI> & S.WithUnion<URI> & S.WithParse<URI> = {
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
