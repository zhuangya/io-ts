/**
 * @since 3.0.0
 */
import { Either } from 'fp-ts/lib/Either'
import { Kind, URIS } from 'fp-ts/lib/HKT'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { Literal } from './Literal'

/**
 * @since 3.0.0
 */
export interface Schemable<S extends URIS> {
  readonly URI: S
  readonly literal: <A extends Literal>(value: A, id?: string) => Kind<S, A>
  readonly literals: <A extends Literal>(values: NonEmptyArray<A>, id?: string) => Kind<S, A>
  readonly literalsOr: <A extends Literal, B>(values: NonEmptyArray<A>, or: Kind<S, B>, id?: string) => Kind<S, A | B>
  readonly string: Kind<S, string>
  readonly number: Kind<S, number>
  readonly boolean: Kind<S, boolean>
  readonly UnknownArray: Kind<S, Array<unknown>>
  readonly UnknownRecord: Kind<S, Record<string, unknown>>
  readonly type: <A>(properties: { [K in keyof A]: Kind<S, A[K]> }, id?: string) => Kind<S, A>
  readonly partial: <A>(properties: { [K in keyof A]: Kind<S, A[K]> }, id?: string) => Kind<S, Partial<A>>
  readonly record: <A>(codomain: Kind<S, A>, id?: string) => Kind<S, Record<string, A>>
  readonly array: <A>(items: Kind<S, A>, id?: string) => Kind<S, Array<A>>
  readonly tuple2: <A, B>(itemA: Kind<S, A>, itemB: Kind<S, B>, id?: string) => Kind<S, [A, B]>
  readonly tuple3: <A, B, C>(itemA: Kind<S, A>, itemB: Kind<S, B>, itemC: Kind<S, C>, id?: string) => Kind<S, [A, B, C]>
  readonly intersection: <A, B>(schemaA: Kind<S, A>, schemaB: Kind<S, B>, id?: string) => Kind<S, A & B>
  readonly sum: <T extends string>(
    tag: T
  ) => <A>(members: { [K in keyof A]: Kind<S, A[K] & Record<T, K>> }, id?: string) => Kind<S, A[keyof A]>
  readonly lazy: <A>(id: string, f: () => Kind<S, A>) => Kind<S, A>
}

/**
 * @since 3.0.0
 */
export interface WithUnion<S extends URIS> {
  readonly union: <A extends [unknown, ...Array<unknown>]>(
    schemas: { [K in keyof A]: Kind<S, A[K]> },
    id?: string
  ) => Kind<S, A[number]>
}

/**
 * @since 3.0.0
 */
export interface WithRefinement<S extends URIS> {
  readonly refinement: <A, B extends A>(
    schema: Kind<S, A>,
    parser: (a: A) => Either<string, B>,
    id?: string
  ) => Kind<S, B>
}

/**
 * @since 3.0.0
 */
export interface WithParse<S extends URIS> extends WithRefinement<S> {
  readonly parse: <A, B>(schema: Kind<S, A>, parser: (a: A) => Either<string, B>, id?: string) => Kind<S, B>
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
