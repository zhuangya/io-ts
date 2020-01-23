/**
 * @since 3.0.0
 */
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'

/**
 * @since 3.0.0
 */
export interface IndexedProduct {
  readonly _tag: 'IndexedProduct'
  readonly errors: NonEmptyArray<[number, DecodeError]>
}

/**
 * @since 3.0.0
 */
export function indexedProduct(errors: NonEmptyArray<[number, DecodeError]>): Detail {
  return { _tag: 'IndexedProduct', errors }
}

/**
 * @since 3.0.0
 */
export interface LabeledProduct {
  readonly _tag: 'LabeledProduct'
  readonly errors: NonEmptyArray<[string, DecodeError]>
}

/**
 * @since 3.0.0
 */
export function labeledProduct(errors: NonEmptyArray<[string, DecodeError]>): Detail {
  return { _tag: 'LabeledProduct', errors }
}

/**
 * @since 3.0.0
 */
export interface And {
  readonly _tag: 'And'
  readonly errors: NonEmptyArray<DecodeError>
}

/**
 * @since 3.0.0
 */
export function and(errors: NonEmptyArray<DecodeError>): Detail {
  return { _tag: 'And', errors }
}

/**
 * @since 3.0.0
 */
export interface Or {
  readonly _tag: 'Or'
  readonly errors: NonEmptyArray<DecodeError>
}

/**
 * @since 3.0.0
 */
export function or(errors: NonEmptyArray<DecodeError>): Detail {
  return { _tag: 'Or', errors }
}

/**
 * @since 3.0.0
 */
export type Detail = IndexedProduct | LabeledProduct | And | Or

/**
 * @since 3.0.0
 */
export interface DecodeError {
  readonly expected: string
  readonly actual: unknown
  readonly detail: Detail | undefined
}

/**
 * @since 3.0.0
 */
export function decodeError(expected: string, actual: unknown, detail?: Detail): DecodeError {
  return {
    expected,
    actual,
    detail
  }
}
