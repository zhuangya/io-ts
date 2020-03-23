/**
 * @since 3.0.0
 */
import * as fc from 'fast-check'
import { Literal } from './Literal'
import * as S from './Schemable'
import { intersect } from './util'

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
export function literal<A extends Literal, B extends ReadonlyArray<Literal>>(
  value: A,
  ...values: B
): Arbitrary<A | B[number]> {
  return fc.oneof(fc.constant(value), ...values.map(v => fc.constant(v)))
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
  const keys = fc.oneof(...Object.keys(properties).map(p => fc.constant(p)))
  return keys.chain(key =>
    fc.record(properties).map(o => {
      delete (o as any)[key]
      return o
    })
  )
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
export function tuple<A extends ReadonlyArray<unknown>>(
  ...components: { [K in keyof A]: Arbitrary<A[K]> }
): Arbitrary<A> {
  if (components.length === 0) {
    return fc.constant([]) as any
  }
  return (fc.tuple as any)(...components)
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
  return (members: Record<string, Arbitrary<any>>) => fc.oneof(...Object.keys(members).map(k => members[k]))
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
export function union<A extends ReadonlyArray<unknown>>(
  ...members: { [K in keyof A]: Arbitrary<A[K]> }
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
  string,
  number,
  boolean,
  UnknownArray,
  UnknownRecord,
  type,
  partial,
  record,
  array,
  tuple: tuple as S.Schemable<URI>['tuple'],
  intersection,
  sum,
  lazy: (_, f) => lazy(f),
  union
}
