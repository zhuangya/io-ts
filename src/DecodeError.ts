/**
 * @since 3.0.0
 */
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'

/**
 * @since 3.0.0
 */
export interface IndexedProduct {
  readonly _tag: 'IndexedProduct'
  readonly expected: string
  readonly actual: unknown
  readonly errors: NonEmptyArray<[number, DecodeError]>
}

/**
 * @since 3.0.0
 */
export function indexedProduct(
  expected: string,
  actual: unknown,
  errors: NonEmptyArray<[number, DecodeError]>
): DecodeError {
  return { _tag: 'IndexedProduct', expected, actual, errors }
}

/**
 * @since 3.0.0
 */
export interface LabeledProduct {
  readonly _tag: 'LabeledProduct'
  readonly expected: string
  readonly actual: unknown
  readonly errors: NonEmptyArray<[string, DecodeError]>
}

/**
 * @since 3.0.0
 */
export function labeledProduct(
  expected: string,
  actual: unknown,
  errors: NonEmptyArray<[string, DecodeError]>
): DecodeError {
  return { _tag: 'LabeledProduct', expected, actual, errors }
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
export type DecodeError = Leaf | And | Or | IndexedProduct | LabeledProduct
