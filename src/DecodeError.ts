/**
 * @since 3.0.0
 */
import { ReadonlyNonEmptyArray, concat, snoc } from './util'
import { Semigroup } from 'fp-ts/lib/Semigroup'

/**
 * @since 3.0.0
 */
export interface Indexed {
  readonly _tag: 'Indexed'
  readonly actual: unknown
  readonly errors: ReadonlyNonEmptyArray<readonly [number, DecodeError]>
  readonly expected: string | undefined
}

/**
 * @since 3.0.0
 */
export function indexed(
  actual: unknown,
  errors: ReadonlyNonEmptyArray<readonly [number, DecodeError]>,
  expected?: string
): DecodeError {
  return { _tag: 'Indexed', actual, errors, expected }
}

/**
 * @since 3.0.0
 */
export interface Labeled {
  readonly _tag: 'Labeled'
  readonly actual: unknown
  readonly errors: ReadonlyNonEmptyArray<readonly [string, DecodeError]>
  readonly expected: string | undefined
}

/**
 * @since 3.0.0
 */
export function labeled(
  actual: unknown,
  errors: ReadonlyNonEmptyArray<readonly [string, DecodeError]>,
  expected?: string
): DecodeError {
  return { _tag: 'Labeled', actual, errors, expected }
}

/**
 * @since 3.0.0
 */
export interface And {
  readonly _tag: 'And'
  readonly errors: ReadonlyNonEmptyArray<DecodeError>
  readonly expected: string | undefined
}

/**
 * @since 3.0.0
 */
export function and(errors: ReadonlyNonEmptyArray<DecodeError>, expected?: string): DecodeError {
  return { _tag: 'And', errors, expected }
}

/**
 * @since 3.0.0
 */
export interface Leaf {
  readonly _tag: 'Leaf'
  readonly actual: unknown
  readonly expected: string | undefined
}

/**
 * @since 3.0.0
 */
export function leaf(actual: unknown, expected?: string): DecodeError {
  return {
    _tag: 'Leaf',
    actual,
    expected
  }
}

/**
 * @since 3.0.0
 */
export type DecodeError = Leaf | And | Indexed | Labeled

/**
 * @since 3.0.0
 */
export const semigroupDecodeError: Semigroup<DecodeError> = {
  concat: (x, y) => {
    if (x._tag === 'And') {
      if (x.expected === undefined) {
        if (y._tag === 'And' && y.expected === undefined) {
          return and(concat(x.errors, y.errors))
        } else {
          return and(snoc(x.errors, y))
        }
      } else {
        if (y._tag === 'And' && y.expected === x.expected) {
          return and(concat(x.errors, y.errors), x.expected)
        }
      }
    } else if (y._tag === 'And' && y.expected === undefined) {
      return and([x, ...y.errors])
    }
    return and([x, y])
  }
}
