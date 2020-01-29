/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const'
import * as S from './Schemable'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { showLiteral } from './util'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export type Static<A> = C.Const<string, A>

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function make<A>(s: string): Static<A> {
  return C.make(s)
}

/**
 * @since 3.0.0
 */
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): Static<A> {
  return make(`(${values.map(showLiteral).join(' | ')})`)
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal, B>(values: NonEmptyArray<A>, type: Static<B>): Static<A | B> {
  return make(union([literals(values), type]))
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Static<string> = make('string')

/**
 * @since 3.0.0
 */
export const number: Static<number> = make('number')

/**
 * @since 3.0.0
 */
export const boolean: Static<boolean> = make('boolean')

/**
 * @since 3.0.0
 */
export const UnknownArray: Static<Array<unknown>> = make('array')

/**
 * @since 3.0.0
 */
export const UnknownRecord: Static<Record<string, unknown>> = make('object')

/**
 * @since 3.0.0
 */
export const Int: Static<S.Int> = make('Int')

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function type<A>(types: { [K in keyof A]: Static<A[K]> }): Static<A> {
  return make(
    `{ ${Object.keys(types)
      .map(k => `${k}: ${(types as any)[k]};`)
      .join(' ')} }`
  )
}

/**
 * @since 3.0.0
 */
export function partial<A>(types: { [K in keyof A]: Static<A[K]> }): Static<Partial<A>> {
  return make(`Partial<${type(types)}>`)
}

/**
 * @since 3.0.0
 */
export function record<A>(type: Static<A>): Static<Record<string, A>> {
  return make(`Record<string, ${type}>`)
}

/**
 * @since 3.0.0
 */
export function array<A>(type: Static<A>): Static<Array<A>> {
  return make(`Array<${type}>`)
}

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(
  types: [Static<A>, Static<B>, Static<C>, Static<D>, Static<E>]
): Static<[A, B, C, D, E]>
export function tuple<A, B, C, D>(types: [Static<A>, Static<B>, Static<C>, Static<D>]): Static<[A, B, C, D]>
export function tuple<A, B, C>(types: [Static<A>, Static<B>, Static<C>]): Static<[A, B, C]>
export function tuple<A, B>(types: [Static<A>, Static<B>]): Static<[A, B]>
export function tuple<A>(types: [Static<A>]): Static<[A]>
export function tuple(types: Array<Static<any>>): Static<any> {
  return make(`[${types.join(', ')}]`)
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(
  types: [Static<A>, Static<B>, Static<C>, Static<D>, Static<E>]
): Static<A & B & C & D & E>
export function intersection<A, B, C, D>(types: [Static<A>, Static<B>, Static<C>, Static<D>]): Static<A & B & C & D>
export function intersection<A, B, C>(types: [Static<A>, Static<B>, Static<C>]): Static<A & B & C>
export function intersection<A, B>(types: [Static<A>, Static<B>]): Static<A & B>
export function intersection(types: Array<Static<any>>): Static<any> {
  return make(`(${types.join(' & ')})`)
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  _tag: T
): <A>(types: { [K in keyof A]: Static<A[K] & Record<T, K>> }) => Static<A[keyof A]> {
  return types =>
    make(
      `(${Object.keys(types)
        .map(k => (types as any)[k])
        .join(' | ')})`
    )
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  types: { [K in keyof A]: Static<A[K]> }
): Static<A[number]> {
  return make(`(${types.join(' | ')})`)
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const URI = 'Static'

/**
 * @since 3.0.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly Static: Static<A>
  }
}

/**
 * @since 3.0.0
 */
export const s: S.Schemable<URI> & S.WithInt<URI> & S.WithUnion<URI> = {
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
  union
}
