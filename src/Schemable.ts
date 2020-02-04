/**
 * @since 3.0.0
 */
import { Kind, URIS } from 'fp-ts/lib/HKT'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { Either } from 'fp-ts/lib/Either'

/**
 * @since 3.0.0
 */
export type Literal = string | number | boolean | null

/**
 * @since 3.0.0
 */
export interface Schemable<F extends URIS> {
  readonly URI: F
  readonly literals: <A extends Literal>(values: NonEmptyArray<A>) => Kind<F, A>
  readonly literalsOr: <A extends Literal, B>(values: NonEmptyArray<A>, schema: Kind<F, B>) => Kind<F, A | B>
  readonly string: Kind<F, string>
  readonly number: Kind<F, number>
  readonly boolean: Kind<F, boolean>
  readonly UnknownArray: Kind<F, Array<unknown>>
  readonly UnknownRecord: Kind<F, Record<string, unknown>>
  readonly type: <A>(schemas: { [K in keyof A]: Kind<F, A[K]> }) => Kind<F, A>
  readonly partial: <A>(schemas: { [K in keyof A]: Kind<F, A[K]> }) => Kind<F, Partial<A>>
  readonly record: <A>(schema: Kind<F, A>) => Kind<F, Record<string, A>>
  readonly array: <A>(schema: Kind<F, A>) => Kind<F, Array<A>>
  readonly tuple: {
    <A, B, C, D, E>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>, Kind<F, E>]): Kind<F, [A, B, C, D, E]>
    <A, B, C, D>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>]): Kind<F, [A, B, C, D]>
    <A, B, C>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>]): Kind<F, [A, B, C]>
    <A, B>(schemas: [Kind<F, A>, Kind<F, B>]): Kind<F, [A, B]>
    <A>(schemas: [Kind<F, A>]): Kind<F, [A]>
  }
  readonly intersection: {
    <A, B, C, D, E>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>, Kind<F, E>]): Kind<F, A & B & C & D & E>
    <A, B, C, D>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>]): Kind<F, A & B & C & D>
    <A, B, C>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>]): Kind<F, A & B & C>
    <A, B>(schemas: [Kind<F, A>, Kind<F, B>]): Kind<F, A & B>
  }
  readonly sum: <T extends string>(
    tag: T
  ) => <A>(schemas: { [K in keyof A]: Kind<F, A[K] & Record<T, K>> }) => Kind<F, A[keyof A]>
  readonly lazy: <A>(f: () => Kind<F, A>) => Kind<F, A>
}

/**
 * @since 3.0.0
 */
export interface WithRefinement<F extends URIS> {
  readonly refinement: <A, B extends A>(schema: Kind<F, A>, parser: (a: A) => Either<string, B>) => Kind<F, B>
}

/**
 * @since 3.0.0
 */
export interface WithParse<F extends URIS> extends WithRefinement<F> {
  readonly parse: <A, B>(schema: Kind<F, A>, parser: (a: A) => Either<string, B>) => Kind<F, B>
}

/**
 * @since 3.0.0
 */
export interface WithUnion<F extends URIS> {
  readonly union: <A extends [unknown, ...Array<unknown>]>(
    schemas: { [K in keyof A]: Kind<F, A[K]> }
  ) => Kind<F, A[number]>
}

/**
 * @since 3.0.0
 */
export function memoize<A, B>(f: (a: A) => B): (a: A) => B {
  let cache = new Map()
  return a => {
    if (!cache.has(a)) {
      const b = f(a)
      cache.set(a, b)
      return b
    }
    return cache.get(a)
  }
}
