/**
 * @since 3.0.0
 */
import * as A from 'fp-ts/lib/Array'
import { Either } from 'fp-ts/lib/Either'
import * as E from 'fp-ts/lib/Eq'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as R from 'fp-ts/lib/Record'
import * as G from './Guard'
import { Literal } from './Literal'
import * as S from './Schemable'
import { eqStrict, hasOwnProperty } from './util'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------
import Eq = E.Eq

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(as: NonEmptyArray<A>, eq: Eq<B>): Eq<A | B> {
  const literals = G.literals(as)
  return {
    equals: (x, y) => (literals.is(x) || literals.is(y) ? x === y : eq.equals(x, y))
  }
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Eq<string> = E.eqString

/**
 * @since 3.0.0
 */
export const number: Eq<number> = E.eqNumber

/**
 * @since 3.0.0
 */
export const boolean: Eq<boolean> = E.eqBoolean

/**
 * @since 3.0.0
 */
export const UnknownArray: Eq<Array<unknown>> = E.fromEquals((x, y) => x.length === y.length)

/**
 * @since 3.0.0
 */
export const UnknownRecord: Eq<Record<string, unknown>> = E.fromEquals((x, y) => {
  for (const k in x) {
    if (!hasOwnProperty(y, k)) {
      return false
    }
  }
  for (const k in y) {
    if (!hasOwnProperty(x, k)) {
      return false
    }
  }
  return true
})

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function refinement<A, B extends A>(eq: Eq<A>, _parser: (a: A) => Either<string, B>): Eq<B> {
  return eq
}

/**
 * @since 3.0.0
 */
export const type: <A>(eqs: { [K in keyof A]: Eq<A[K]> }) => Eq<A> = E.getStructEq

/**
 * @since 3.0.0
 */
export function partial<A>(eqs: { [K in keyof A]: Eq<A[K]> }): Eq<Partial<A>> {
  return {
    equals: (x, y) => {
      for (const k in eqs) {
        const xk = x[k]
        const yk = y[k]
        if (!(xk === undefined || yk === undefined ? xk === yk : eqs[k].equals(xk!, yk!))) {
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
export const record: <A>(codomain: Eq<A>) => Eq<Record<string, A>> = R.getEq

/**
 * @since 3.0.0
 */
export const array: <A>(eq: Eq<A>) => Eq<Array<A>> = A.getEq

/**
 * @since 3.0.0
 */
export const tuple2: <A, B>(itemA: Eq<A>, itemB: Eq<B>) => Eq<[A, B]> = E.getTupleEq

/**
 * @since 3.0.0
 */
export const tuple3: <A, B, C>(itemA: Eq<A>, itemB: Eq<B>, itemC: Eq<C>) => Eq<[A, B, C]> = E.getTupleEq

/**
 * @since 3.0.0
 */
export function intersection<A, B>(eqA: Eq<A>, eqB: Eq<B>): Eq<A & B> {
  return {
    equals: (x, y) => eqA.equals(x, y) && eqB.equals(x, y)
  }
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(members: { [K in keyof A]: Eq<A[K] & Record<T, K>> }) => Eq<A[keyof A]> {
  return (members: Record<string, Eq<any>>) => {
    return {
      equals: (x: Record<string, any>, y: Record<string, any>) => {
        const vx = x[tag]
        const vy = y[tag]
        if (vx !== vy) {
          return false
        }
        return members[vx].equals(x, y)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => Eq<A>): Eq<A> {
  const get = S.memoize<void, Eq<A>>(f)
  return {
    equals: (x, y) => get().equals(x, y)
  }
}

/**
 * @since 3.0.0
 */
export const eq: typeof E.eq & S.Schemable<E.URI> & S.WithRefinement<E.URI> = {
  ...E.eq,
  literal: () => eqStrict,
  literals: () => eqStrict,
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
  refinement: refinement as S.WithRefinement<E.URI>['refinement']
}
