/**
 * @since 3.0.0
 */
import { ReadonlyNonEmptyArray, concat } from './util'
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
  concat: (x, y) => and(concat(toArray(x), toArray(y)))
}

function toArray(e: DecodeError): ReadonlyNonEmptyArray<DecodeError> {
  return e._tag === 'And' && e.expected === undefined ? e.errors : [e]
}
