/**
 * @since 3.0.0
 */
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as S from './Schemable'
import { hasOwnProperty, memoize } from './util'
import { Either } from 'fp-ts/lib/Either'

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
export function constants<A>(as: NonEmptyArray<A>): Guard<A> {
  const head = as[0]
  const is =
    as.length === 1 ? (u: unknown): u is A => u === head : (u: unknown): u is A => as.findIndex(a => a === u) !== -1
  return {
    is
  }
}

/**
 * @since 3.0.0
 */
export function constantsOr<A, B>(as: NonEmptyArray<A>, guard: Guard<B>): Guard<A | B> {
  return union([constants(as), guard])
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

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
  is: (u: unknown): u is Record<string, unknown> => {
    const s = Object.prototype.toString.call(u)
    return s === '[object Object]' || s === '[object Window]'
  }
}

/**
 * @since 3.0.0
 */
export const Int: Guard<S.Int> = {
  is: (u: unknown): u is S.Int => number.is(u) && Number.isInteger(u)
}

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function parse<A, B>(guard: Guard<A>, parser: (a: A) => Either<string, B>): Guard<B> {
  return {
    is: (u: unknown): u is B => guard.is(u) && parser(u)._tag === 'Right'
  }
}

/**
 * @since 3.0.0
 */
export function type<A>(guards: { [K in keyof A]: Guard<A[K]> }): Guard<A> {
  return {
    is: (u: unknown): u is A => {
      if (!UnknownRecord.is(u)) {
        return false
      }
      for (const k in guards) {
        if (!guards[k].is(u[k])) {
          return false
        }
      }
      return true
    }
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(guards: { [K in keyof A]: Guard<A[K]> }): Guard<Partial<A>> {
  return {
    is: (u: unknown): u is Partial<A> => {
      if (!UnknownRecord.is(u)) {
        return false
      }
      for (const k in guards) {
        const v = u[k]
        if (v !== undefined && !guards[k].is(v)) {
          return false
        }
      }
      return true
    }
  }
}

/**
 * @since 3.0.0
 */
export function record<A>(guard: Guard<A>): Guard<Record<string, A>> {
  return {
    is: (u: unknown): u is Record<string, A> => {
      if (!UnknownRecord.is(u)) {
        return false
      }
      for (const k in u) {
        if (!guard.is(u[k])) {
          return false
        }
      }
      return true
    }
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(guard: Guard<A>): Guard<Array<A>> {
  return {
    is: (u: unknown): u is Array<A> => UnknownArray.is(u) && u.every(guard.is)
  }
}

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(guards: [Guard<A>, Guard<B>, Guard<C>, Guard<D>, Guard<E>]): Guard<[A, B, C, D, E]>
export function tuple<A, B, C, D>(guards: [Guard<A>, Guard<B>, Guard<C>, Guard<D>]): Guard<[A, B, C, D]>
export function tuple<A, B, C>(guards: [Guard<A>, Guard<B>, Guard<C>]): Guard<[A, B, C]>
export function tuple<A, B>(guards: [Guard<A>, Guard<B>]): Guard<[A, B]>
export function tuple<A>(guards: [Guard<A>]): Guard<[A]>
export function tuple(guards: Array<Guard<unknown>>): Guard<Array<unknown>> {
  return {
    is: (u: unknown): u is Array<unknown> =>
      UnknownArray.is(u) && u.length === guards.length && guards.every((guard, i) => guard.is(u[i]))
  }
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(
  guards: [Guard<A>, Guard<B>, Guard<C>, Guard<D>, Guard<E>]
): Guard<A & B & C & D & E>
export function intersection<A, B, C, D>(guards: [Guard<A>, Guard<B>, Guard<C>, Guard<D>]): Guard<A & B & C & D>
export function intersection<A, B, C>(guards: [Guard<A>, Guard<B>, Guard<C>]): Guard<A & B & C>
export function intersection<A, B>(guards: [Guard<A>, Guard<B>]): Guard<A & B>
export function intersection<A>(guards: Array<Guard<A>>): Guard<A> {
  return {
    is: (u: unknown): u is A => guards.every(guard => guard.is(u))
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  guards: { [K in keyof A]: Guard<A[K]> }
): Guard<A[number]> {
  return {
    is: (u: unknown): u is A[number] => guards.some(guard => guard.is(u))
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => Guard<A>): Guard<A> {
  const get = memoize(f)
  return {
    is: (u: unknown): u is A => get().is(u)
  }
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(guards: { [K in keyof A]: Guard<A[K] & Record<T, K>> }) => Guard<A[keyof A]> {
  return <A>(guards: { [K in keyof A]: Guard<A[K] & Record<T, K>> }) => {
    return {
      is: (u): u is A[keyof A] => {
        if (!UnknownRecord.is(u)) {
          return false
        }
        const v = u[tag]
        if (typeof v === 'string' && hasOwnProperty(guards, v)) {
          return guards[v].is(u)
        }
        return false
      }
    }
  }
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
export const guard: S.Schemable<URI> & S.WithLazy<URI> & S.WithParse<URI> & S.WithUnion<URI> = {
  URI,
  constants,
  constantsOr,
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
  lazy,
  parse,
  union
}
