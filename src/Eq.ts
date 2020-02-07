/**
 * @since 3.0.0
 */
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Eq'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as R from 'fp-ts/lib/Record'
import * as G from './Guard'
import * as S from './Schemable'
import { eqStrict, hasOwnProperty } from './util'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------
import Eq = E.Eq
import { Either } from 'fp-ts/lib/Either'

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function literals<A extends S.Literal>(_as: NonEmptyArray<A>): Eq<A> {
  return eqStrict
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal, B>(as: NonEmptyArray<A>, eq: Eq<B>): Eq<A | B> {
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
export function tuple<A, B, C, D, E>(eqs: [Eq<A>, Eq<B>, Eq<C>, Eq<D>, Eq<E>]): Eq<[A, B, C, D, E]>
export function tuple<A, B, C, D>(eqs: [Eq<A>, Eq<B>, Eq<C>, Eq<D>]): Eq<[A, B, C, D]>
export function tuple<A, B, C>(eqs: [Eq<A>, Eq<B>, Eq<C>]): Eq<[A, B, C]>
export function tuple<A, B>(eqs: [Eq<A>, Eq<B>]): Eq<[A, B]>
export function tuple<A>(eqs: [Eq<A>]): Eq<[A]>
export function tuple(eqs: Array<Eq<unknown>>): Eq<Array<unknown>> {
  return E.getTupleEq(...eqs)
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(eqs: [Eq<A>, Eq<B>, Eq<C>, Eq<D>, Eq<E>]): Eq<A & B & C & D & E>
export function intersection<A, B, C, D>(eqs: [Eq<A>, Eq<B>, Eq<C>, Eq<D>]): Eq<A & B & C & D>
export function intersection<A, B, C>(eqs: [Eq<A>, Eq<B>, Eq<C>]): Eq<A & B & C>
export function intersection<A, B>(eqs: [Eq<A>, Eq<B>]): Eq<A & B>
export function intersection<A>(eqs: Array<Eq<A>>): Eq<A> {
  return {
    equals: (x, y) => eqs.every(eq => eq.equals(x, y))
  }
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(tag: T): <A>(eqs: { [K in keyof A]: Eq<A[K] & Record<T, K>> }) => Eq<A[keyof A]> {
  return (eqs: any) => {
    return {
      equals: (x: any, y: any) => {
        const vx = x[tag]
        const vy = y[tag]
        if (vx !== vy) {
          return false
        }
        return eqs[vx].equals(x, y)
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
  refinement: refinement as S.WithRefinement<E.URI>['refinement']
}
