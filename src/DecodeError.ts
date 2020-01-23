/**
 * @since 3.0.0
 */
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'

/**
 * @since 3.0.0
 */
export interface Indexed {
  readonly _tag: 'Indexed'
  readonly expected: string
  readonly actual: unknown
  readonly errors: NonEmptyArray<[number, DecodeError]>
}

/**
 * @since 3.0.0
 */
export function indexed(expected: string, actual: unknown, errors: NonEmptyArray<[number, DecodeError]>): DecodeError {
  return { _tag: 'Indexed', expected, actual, errors }
}

/**
 * @since 3.0.0
 */
export interface Labeled {
  readonly _tag: 'Labeled'
  readonly expected: string
  readonly actual: unknown
  readonly errors: NonEmptyArray<[string, DecodeError]>
}

/**
 * @since 3.0.0
 */
export function labeled(expected: string, actual: unknown, errors: NonEmptyArray<[string, DecodeError]>): DecodeError {
  return { _tag: 'Labeled', expected, actual, errors }
}

/**
 * @since 3.0.0
 */
export interface And {
  readonly _tag: 'And'
  readonly expected: string
  readonly actual: unknown
  readonly errors: NonEmptyArray<DecodeError>
}

/**
 * @since 3.0.0
 */
export function and(expected: string, actual: unknown, errors: NonEmptyArray<DecodeError>): DecodeError {
  return { _tag: 'And', expected, actual, errors }
}

/**
 * @since 3.0.0
 */
export interface Or {
  readonly _tag: 'Or'
  readonly expected: string
  readonly actual: unknown
  readonly errors: NonEmptyArray<DecodeError>
}

/**
 * @since 3.0.0
 */
export function or(expected: string, actual: unknown, errors: NonEmptyArray<DecodeError>): DecodeError {
  return { _tag: 'Or', expected, actual, errors }
}

/**
 * @since 3.0.0
 */
export interface Leaf {
  readonly _tag: 'Leaf'
  readonly expected: string
  readonly actual: unknown
}

/**
 * @since 3.0.0
 */
export function leaf(expected: string, actual: unknown): DecodeError {
  return {
    _tag: 'Leaf',
    expected,
    actual
  }
}

/**
 * @since 3.0.0
 */
export type DecodeError = Leaf | And | Or | Indexed | Labeled
