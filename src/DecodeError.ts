/**
 * @since 3.0.0
 */

/**
 * @since 3.0.0
 */
export type NonEmpty<A> = readonly [A, ...Array<A>]

/**
 * @since 3.0.0
 */
export type IndexedError = readonly [number, DecodeError]

/**
 * @since 3.0.0
 */
export type LabeledError = readonly [string, DecodeError]

/**
 * @since 3.0.0
 */
export interface Indexed {
  readonly _tag: 'Indexed'
  readonly actual: unknown
  readonly errors: NonEmpty<IndexedError>
  readonly id: string | undefined
  readonly message: string | undefined
}

/**
 * @since 3.0.0
 */
export function indexed(actual: unknown, errors: NonEmpty<IndexedError>, id?: string, message?: string): DecodeError {
  return { _tag: 'Indexed', actual, errors, id, message }
}

/**
 * @since 3.0.0
 */
export interface Labeled {
  readonly _tag: 'Labeled'
  readonly actual: unknown
  readonly errors: NonEmpty<LabeledError>
  readonly id: string | undefined
  readonly message: string | undefined
}

/**
 * @since 3.0.0
 */
export function labeled(actual: unknown, errors: NonEmpty<LabeledError>, id?: string, message?: string): DecodeError {
  return { _tag: 'Labeled', actual, errors, id, message }
}

/**
 * @since 3.0.0
 */
export interface And {
  readonly _tag: 'And'
  readonly actual: unknown
  readonly errors: NonEmpty<DecodeError>
  readonly id: string | undefined
  readonly message: string | undefined
}

/**
 * @since 3.0.0
 */
export function and(actual: unknown, errors: NonEmpty<DecodeError>, id?: string, message?: string): DecodeError {
  return { _tag: 'And', actual, errors, id, message }
}

/**
 * @since 3.0.0
 */
export interface Or {
  readonly _tag: 'Or'
  readonly actual: unknown
  readonly errors: NonEmpty<DecodeError>
  readonly id: string | undefined
  readonly message: string | undefined
}

/**
 * @since 3.0.0
 */
export function or(actual: unknown, errors: NonEmpty<DecodeError>, id?: string, message?: string): DecodeError {
  return { _tag: 'Or', actual, errors, id, message }
}

/**
 * @since 3.0.0
 */
export interface Leaf {
  readonly _tag: 'Leaf'
  readonly actual: unknown
  readonly id: string | undefined
  readonly message: string | undefined
}

/**
 * @since 3.0.0
 */
export function leaf(actual: unknown, id?: string, message?: string): DecodeError {
  return {
    _tag: 'Leaf',
    actual,
    id,
    message
  }
}

/**
 * @since 3.0.0
 */
export type DecodeError = Leaf | And | Or | Indexed | Labeled
