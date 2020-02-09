/**
 * @since 3.0.0
 */
import { Either, isRight } from 'fp-ts/lib/Either'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { Literal } from './Literal'
import * as S from './Schemable'
import { hasOwnProperty } from './util'

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
export function literals<A extends Literal>(values: NonEmptyArray<A>): Guard<A> {
  return {
    is: (u: unknown): u is A => values.findIndex(a => a === u) !== -1
  }
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(values: NonEmptyArray<A>, guard: Guard<B>): Guard<A | B> {
  return union([literals(values), guard])
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

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function refinement<A, B extends A>(guard: Guard<A>, parser: (a: A) => Either<string, B>): Guard<B> {
  return {
    is: (u: unknown): u is B => guard.is(u) && isRight(parser(u))
  }
}

/**
 * @since 3.0.0
 */
export function type<A>(properties: { [K in keyof A]: Guard<A[K]> }): Guard<A> {
  return {
    is: (u: unknown): u is A => {
      if (!UnknownRecord.is(u)) {
        return false
      }
      for (const k in properties) {
        if (!properties[k].is(u[k])) {
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
export function partial<A>(properties: { [K in keyof A]: Guard<A[K]> }): Guard<Partial<A>> {
  return {
    is: (u: unknown): u is Partial<A> => {
      if (!UnknownRecord.is(u)) {
        return false
      }
      for (const k in properties) {
        const v = u[k]
        if (v !== undefined && !properties[k].is(v)) {
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
export function record<A>(codomain: Guard<A>): Guard<Record<string, A>> {
  return {
    is: (u: unknown): u is Record<string, A> => {
      if (!UnknownRecord.is(u)) {
        return false
      }
      for (const k in u) {
        if (!codomain.is(u[k])) {
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
export function array<A>(items: Guard<A>): Guard<Array<A>> {
  return {
    is: (u: unknown): u is Array<A> => UnknownArray.is(u) && u.every(items.is)
  }
}

/**
 * @since 3.0.0
 */
export function tuple2<A, B>(itemA: Guard<A>, itemB: Guard<B>): Guard<[A, B]> {
  return {
    is: (u: unknown): u is [A, B] => UnknownArray.is(u) && u.length === 2 && itemA.is(u[0]) && itemB.is(u[1])
  }
}

/**
 * @since 3.0.0
 */
export function tuple3<A, B, C>(itemA: Guard<A>, itemB: Guard<B>, itemC: Guard<C>): Guard<[A, B, C]> {
  return {
    is: (u: unknown): u is [A, B, C] =>
      UnknownArray.is(u) && u.length === 3 && itemA.is(u[0]) && itemB.is(u[1]) && itemC.is(u[2])
  }
}

/**
 * @since 3.0.0
 */
export function intersection<A, B>(guardA: Guard<A>, guardB: Guard<B>): Guard<A & B> {
  return {
    is: (u: unknown): u is A & B => guardA.is(u) && guardB.is(u)
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, ...Array<unknown>]>(
  guards: { [K in keyof A]: Guard<A[K]> }
): Guard<A[number]> {
  return {
    is: (u: unknown): u is A[number] => guards.some(guard => guard.is(u))
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

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => Guard<A>): Guard<A> {
  const get = S.memoize<void, Guard<A>>(f)
  return {
    is: (u: unknown): u is A => get().is(u)
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
export const guard: S.Schemable<URI> & S.WithUnion<URI> & S.WithRefinement<URI> = {
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
  tuple2,
  tuple3,
  intersection,
  sum,
  lazy: (_, f) => lazy(f),
  refinement: refinement as S.WithRefinement<URI>['refinement'],
  union
}
