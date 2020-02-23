/**
 * @since 3.0.0
 */
import { Literal } from './Literal'
import * as S from './Schemable'
import { hasOwnProperty, ReadonlyNonEmptyArray, ReadonlyNonEmptyTuple } from './util'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export interface Guard<A> {
  is: (u: unknown) => u is A
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function literal<A extends Literal>(value: A): Guard<A> {
  return {
    is: (u: unknown): u is A => u === value
  }
}

/**
 * @since 3.0.0
 */
export function literals<A extends Literal>(values: ReadonlyNonEmptyArray<A>): Guard<A> {
  return {
    is: (u: unknown): u is A => values.findIndex(a => a === u) !== -1
  }
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(values: ReadonlyNonEmptyArray<A>, or: Guard<B>): Guard<A | B> {
  return union([literals(values), or])
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const never: Guard<never> = {
  is: (_u): _u is never => false
}

/**
 * @since 3.0.0
 */
export const string: Guard<string> = {
  is: (u: unknown): u is string => typeof u === 'string'
}

/**
 * @since 3.0.0
 */
export const number: Guard<number> = {
  is: (u: unknown): u is number => typeof u === 'number'
}

/**
 * @since 3.0.0
 */
export const boolean: Guard<boolean> = {
  is: (u: unknown): u is boolean => typeof u === 'boolean'
}

/**
 * @since 3.0.0
 */
export const UnknownArray: Guard<Array<unknown>> = {
  is: Array.isArray
}

/**
 * @since 3.0.0
 */
export const UnknownRecord: Guard<Record<string, unknown>> = {
  is: (u: unknown): u is Record<string, unknown> => Object.prototype.toString.call(u) === '[object Object]'
}

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function refinement<A, B extends A>(from: Guard<A>, refinement: (a: A) => a is B): Guard<B> {
  return {
    is: (u: unknown): u is B => from.is(u) && refinement(u)
  }
}

/**
 * @since 3.0.0
 */
export function type<A>(properties: { [K in keyof A]: Guard<A[K]> }): Guard<A> {
  return refinement(UnknownRecord, (r): r is {
    [K in keyof A]: A[K]
  } => {
    for (const k in properties) {
      if (!properties[k].is(r[k])) {
        return false
      }
    }
    return true
  })
}

/**
 * @since 3.0.0
 */
export function partial<A>(properties: { [K in keyof A]: Guard<A[K]> }): Guard<Partial<A>> {
  return refinement(UnknownRecord, (r): r is Partial<A> => {
    for (const k in properties) {
      const v = r[k]
      if (v !== undefined && !properties[k].is(v)) {
        return false
      }
    }
    return true
  })
}

/**
 * @since 3.0.0
 */
export function record<A>(codomain: Guard<A>): Guard<Record<string, A>> {
  return refinement(UnknownRecord, (r): r is Record<string, A> => {
    for (const k in r) {
      if (!codomain.is(r[k])) {
        return false
      }
    }
    return true
  })
}

/**
 * @since 3.0.0
 */
export function array<A>(items: Guard<A>): Guard<Array<A>> {
  return refinement(UnknownArray, (us): us is Array<A> => us.every(items.is))
}

/**
 * @since 3.0.0
 */
export function tuple<A, B>(left: Guard<A>, right: Guard<B>): Guard<[A, B]> {
  return refinement(UnknownArray, (us): us is [A, B] => us.length === 2 && left.is(us[0]) && right.is(us[1]))
}

/**
 * @since 3.0.0
 */
export function intersection<A, B>(left: Guard<A>, right: Guard<B>): Guard<A & B> {
  return {
    is: (u: unknown): u is A & B => left.is(u) && right.is(u)
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends ReadonlyNonEmptyTuple<unknown>>(
  members: { [K in keyof A]: Guard<A[K]> }
): Guard<A[number]> {
  return {
    is: (u: unknown): u is A[number] => members.some(guard => guard.is(u))
  }
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(members: { [K in keyof A]: Guard<A[K] & Record<T, K>> }) => Guard<A[keyof A]> {
  return <A>(members: { [K in keyof A]: Guard<A[K] & Record<T, K>> }) => {
    return refinement(UnknownRecord, (r): r is { [K in keyof A]: A[K] & Record<T, K> }[keyof A] => {
      const v = r[tag]
      if (typeof v === 'string' && hasOwnProperty(members, v)) {
        return members[v].is(r)
      }
      return false
    })
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => Guard<A>): Guard<A> {
  const get = S.memoize<void, Guard<A>>(f)
  return {
    is: (u: unknown): u is A => get().is(u)
  }
}

/**
 * @since 3.0.0
 */
export function readonly<A>(mutable: Guard<A>): Guard<Readonly<A>> {
  return mutable
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const URI = 'Guard'

/**
 * @since 3.0.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly Guard: Guard<A>
  }
}

/**
 * @since 3.0.0
 */
export const guard: S.Schemable<URI> & S.WithUnion<URI> = {
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
  readonly,
  union
}
