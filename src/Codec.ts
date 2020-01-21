/**
 * Breaking changes:
 * - remove all optional `name` arguments (use `withName` instead)
 * - `refinement`
 *   - `name` is mandatory
 * - remove `brand` combinator
 *
 * @since 3.0.0
 */
import { identity, Refinement } from 'fp-ts/lib/function'
import * as D from './Decoder'
import * as E from './Encoder'
import * as DE from './DecodeError'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export interface Codec<A> extends D.Decoder<A>, E.Encoder<A> {}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function fromDecoder<A>(decoder: D.Decoder<A>): Codec<A> {
  return {
    ...decoder,
    encode: identity
  }
}

/**
 * @since 3.0.0
 */
export function literal<L extends string | number | boolean>(literal: L): Codec<L> {
  return fromDecoder(D.literal(literal))
}

/**
 * @since 3.0.0
 */
export function keyof<A>(keys: Record<keyof A, unknown>): Codec<keyof A> {
  return fromDecoder(D.keyof(keys))
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Codec<string> = fromDecoder(D.string)

/**
 * @since 3.0.0
 */
export const number: Codec<number> = fromDecoder(D.number)

/**
 * @since 3.0.0
 */
export const boolean: Codec<boolean> = fromDecoder(D.boolean)

const _undefined: Codec<undefined> = fromDecoder(D.undefined)

const _null: Codec<null> = fromDecoder(D.null)

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
export const UnknownArray: Codec<Array<unknown>> = fromDecoder(D.UnknownArray)

/**
 * @since 3.0.0
 */
export const UnknownRecord: Codec<Record<string, unknown>> = fromDecoder(D.UnknownRecord)

/**
 * @since 3.0.0
 */
export type Int = D.Int

/**
 * @since 3.0.0
 */
export const Int: Codec<Int> = fromDecoder(D.Int)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function withName<A>(codec: Codec<A>, name: string): Codec<A> {
  return {
    ...D.withName(codec, name),
    encode: codec.encode
  }
}

/**
 * @since 3.0.0
 */
export function withMessage<A>(codec: Codec<A>, onError: (input: unknown, e: DE.DecodeError) => string): Codec<A> {
  return {
    ...D.withMessage(codec, onError),
    encode: codec.encode
  }
}

/**
 * @since 3.0.0
 */
export function refinement<A, B extends A>(codec: Codec<A>, refinement: Refinement<A, B>, name: string): Codec<B> {
  return {
    ...D.refinement(codec, refinement, name),
    encode: codec.encode
  }
}

/**
 * @since 3.0.0
 */
export function type<A>(codecs: { [K in keyof A]: Codec<A[K]> }): Codec<A> {
  return {
    ...D.type(codecs),
    ...E.type(codecs)
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(codecs: { [K in keyof A]: Codec<A[K]> }): Codec<Partial<A>> {
  return {
    ...D.partial(codecs),
    ...E.partial(codecs)
  }
}

/**
 * @since 3.0.0
 */
export function record<A>(codec: Codec<A>): Codec<Record<string, A>> {
  return {
    ...D.record(codec),
    ...E.record(codec)
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(codec: Codec<A>): Codec<Array<A>> {
  return {
    ...D.array(codec),
    ...E.array(codec)
  }
}

/**
 * @since 3.0.0
 */
export function tuple<A extends [unknown, unknown, ...Array<unknown>]>(
  codecs: { [K in keyof A]: Codec<A[K]> }
): Codec<A> {
  return {
    ...D.tuple<A>(codecs),
    ...E.tuple(codecs)
  }
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(
  codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>, Codec<E>],
  name?: string
): Codec<A & B & C & D & E>
export function intersection<A, B, C, D>(
  codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>],
  name?: string
): Codec<A & B & C & D>
export function intersection<A, B, C>(codecs: [Codec<A>, Codec<B>, Codec<C>]): Codec<A & B & C>
export function intersection<A, B>(codecs: [Codec<A>, Codec<B>]): Codec<A & B>
export function intersection<A>(codecs: any): Codec<A> {
  return {
    ...D.intersection<A, A>(codecs),
    ...E.intersection(codecs)
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  codecs: { [K in keyof A]: Codec<A[K]> }
): Codec<A[number]> {
  return {
    ...D.union(codecs),
    ...E.union(codecs)
  }
}

/**
 * @since 3.0.0
 */
export function recursive<A>(name: string, f: () => Codec<A>): Codec<A> {
  return {
    ...D.recursive(name, f),
    ...E.recursive(f)
  }
}
