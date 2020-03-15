/**
 * @since 3.0.0
 */

/**
 * @internal
 */
export function hasOwnProperty<O extends object>(o: O, k: string): k is keyof O & string {
  return Object.prototype.hasOwnProperty.call(o, k)
}

function typeOf(x: unknown): string {
  return x === null ? 'null' : typeof x
}

/**
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

/**
 * @internal
 */
export type ReadonlyNonEmptyTuple<A> = readonly [A, ...ReadonlyArray<A>]

/**
 * @internal
 */
export function map<A, B>(ne: ReadonlyNonEmptyTuple<A>, f: (a: A) => B): ReadonlyNonEmptyTuple<B> {
  return [f(ne[0]), ...ne.slice(1).map(f)]
}

/**
 * @internal
 * @since 3.0.0
 */
export interface ReadonlyNonEmptyArray<A> extends ReadonlyArray<A> {
  readonly 0: A
}
