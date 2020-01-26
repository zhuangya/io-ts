/**
 * @since 3.0.0
 */
import { Eq } from 'fp-ts/lib/Eq'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as S from './Schemable'

/**
 * @since 3.0.0
 */
export function isNonEmpty<A>(as: Array<A>): as is NonEmptyArray<A> {
  return as.length > 0
}

/**
 * @since 3.0.0
 */
export function hasOwnProperty<O extends Record<string, unknown>>(o: O, k: string): k is keyof O & string {
  return Object.prototype.hasOwnProperty.call(o, k)
}

/**
 * @since 3.0.0
 */
export function showLiteral(a: S.Literal): string {
  return a === undefined ? 'undefined' : JSON.stringify(a)
}

/**
 * @since 3.0.0
 */
export const strict: Eq<unknown> = {
  equals: (x, y) => x === y
}

/**
 * @since 3.0.0
 */
export const always: Eq<unknown> = {
  equals: () => true
}

/**
 * @since 3.0.0
 */
export function memoize<A>(f: () => A): () => A {
  let cache: A
  let isEmpty: boolean = true
  return () => {
    if (isEmpty) {
      cache = f()
      isEmpty = false
    }
    return cache
  }
}
