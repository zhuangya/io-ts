/**
 * @since 3.0.0
 */

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
export function literal<A extends string | number | boolean>(a: A): Guard<A> {
  return {
    is: (u: unknown): u is A => u === a
  }
}

/**
 * @since 3.0.0
 */
export function keyof<A>(keys: Record<keyof A, unknown>): Guard<keyof A> {
  return {
    is: (u: unknown): u is keyof A => typeof u === 'string' && Object.prototype.hasOwnProperty.call(keys, u)
  }
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

const _undefined: Guard<undefined> = {
  is: (u: unknown): u is undefined => u === undefined
}

const _null: Guard<null> = {
  is: (u: unknown): u is null => u === null
}

export {
  /**
   * @since 3.0.0
   */
  _undefined as undefined,
  /**
   * @since 3.0.0
   */
  _null as null
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
export function tuple<A extends [unknown, unknown, ...Array<unknown>]>(
  guards: { [K in keyof A]: Guard<A[K]> }
): Guard<A> {
  return {
    is: (u: unknown): u is A =>
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
  let memoized: Guard<A>
  function getMemoized(): Guard<A> {
    if (!memoized) {
      memoized = f()
    }
    return memoized
  }
  return {
    is: (u: unknown): u is A => getMemoized().is(u)
  }
}
