/**
 * @since 3.0.0
 */
import * as fc from 'fast-check'
import { Literal } from './Literal'
import * as S from './Schemable'
import { intersect, ReadonlyNonEmptyArray, ReadonlyNonEmptyTuple } from './util'

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
export function literal<A extends Literal>(value: A): Arbitrary<A> {
  return fc.constant(value)
}

/**
 * @since 3.0.0
 */
export function literals<A extends Literal>(values: ReadonlyNonEmptyArray<A>): Arbitrary<A> {
  return fc.oneof(...values.map(a => fc.constant(a)))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(values: ReadonlyNonEmptyArray<A>, or: Arbitrary<B>): Arbitrary<A | B> {
  return fc.oneof<A | B>(literals(values), or)
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

// TODO: parse?
// /**
//  * @since 3.0.0
//  */
// export function parse<A, B>(from: Arbitrary<A>, parser: (a: A) => Either<string, B>): Arbitrary<B> {
//   return from
//     .map(parser)
//     .filter(isRight)
//     .map((e: any) => e.right)
// }

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
export function tuple<A, B>(left: Arbitrary<A>, right: Arbitrary<B>): Arbitrary<[A, B]> {
  return fc.tuple(left, right)
}

/**
 * @since 3.0.0
 */
export function intersection<A, B>(left: Arbitrary<A>, right: Arbitrary<B>): Arbitrary<A & B> {
  return fc.tuple(left, right).map(([a, b]) => intersect(a, b))
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  _tag: T
): <A>(members: { [K in keyof A]: Arbitrary<A[K] & Record<T, K>> }) => Arbitrary<A[keyof A]> {
  return (members: Record<string, Arbitrary<any>>) => {
    return fc.oneof(...Object.keys(members).map(k => members[k]))
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
export function union<A extends ReadonlyNonEmptyTuple<unknown>>(
  members: { [K in keyof A]: Arbitrary<A[K]> }
): Arbitrary<A[number]> {
  return fc.oneof(...members)
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
export const arbitrary: S.Schemable<URI> & S.WithUnion<URI> = {
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
  union
}
