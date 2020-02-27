/**
 * @since 3.0.0
 */
import { Kind, URIS } from 'fp-ts/lib/HKT'
import { Literal } from './Literal'
import { ReadonlyNonEmptyArray, ReadonlyNonEmptyTuple } from './util'

/**
 * @since 3.0.0
 */
export interface Schemable<S extends URIS> {
  readonly URI: S
  readonly literal: <A extends Literal>(value: A, id?: string) => Kind<S, A>
  readonly literals: <A extends Literal>(values: ReadonlyNonEmptyArray<A>, id?: string) => Kind<S, A>
  readonly literalsOr: <A extends Literal, B>(
    values: ReadonlyNonEmptyArray<A>,
    or: Kind<S, B>,
    id?: string
  ) => Kind<S, A | B>
  readonly string: Kind<S, string>
  readonly number: Kind<S, number>
  readonly boolean: Kind<S, boolean>
  readonly UnknownArray: Kind<S, Array<unknown>>
  readonly UnknownRecord: Kind<S, Record<string, unknown>>
  readonly type: <A>(properties: { [K in keyof A]: Kind<S, A[K]> }, id?: string) => Kind<S, A>
  readonly partial: <A>(properties: { [K in keyof A]: Kind<S, A[K]> }, id?: string) => Kind<S, Partial<A>>
  readonly record: <A>(codomain: Kind<S, A>, id?: string) => Kind<S, Record<string, A>>
  readonly array: <A>(items: Kind<S, A>, id?: string) => Kind<S, Array<A>>
  readonly tuple: <A, B>(left: Kind<S, A>, right: Kind<S, B>, id?: string) => Kind<S, [A, B]>
  readonly intersection: <A, B>(left: Kind<S, A>, right: Kind<S, B>, id?: string) => Kind<S, A & B>
  readonly sum: <T extends string>(
    tag: T
  ) => <A>(members: { [K in keyof A]: Kind<S, A[K] & Record<T, K>> }, id?: string) => Kind<S, A[keyof A]>
  readonly lazy: <A>(id: string, f: () => Kind<S, A>) => Kind<S, A>
}

/**
 * @since 3.0.0
 */
export interface WithUnion<S extends URIS> {
  readonly union: <A extends ReadonlyNonEmptyTuple<unknown>>(
    members: { [K in keyof A]: Kind<S, A[K]> },
    id?: string
  ) => Kind<S, A[number]>
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
