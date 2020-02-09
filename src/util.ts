/**
 * @since 3.0.0
 */
import { Eq, strictEqual } from 'fp-ts/lib/Eq'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'

/**
 * @since 3.0.0
 * @internal
 */
export function isNonEmpty<A>(as: Array<A>): as is NonEmptyArray<A> {
  return as.length > 0
}

/**
 * @since 3.0.0
 * @internal
 */
export function hasOwnProperty<O extends object>(o: O, k: string): k is keyof O & string {
  return Object.prototype.hasOwnProperty.call(o, k)
}

/**
 * @since 3.0.0
 * @internal
 */
export const eqStrict: Eq<unknown> = {
  equals: strictEqual
}

function typeOf(x: unknown): string {
  return x === null ? 'null' : typeof x
}

/**
 * @since 3.0.0
 * @internal
 */
export function intersect<A, B>(a: A, b: B): A & B {
  if (a !== undefined && b !== undefined) {
    const tx = typeOf(a)
    const ty = typeOf(b)
    if (tx === 'object' || ty === 'object') {
      return Object.assign({}, a, b)
    }
  }
  return b as any
}
