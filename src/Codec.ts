/**
 * Breaking changes:
 * - `refinement`
 *   - `name` is mandatory
 * - removed `brand` combinator
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
export function literal<L extends string | number | boolean>(literal: L, name?: string): Codec<L> {
  return fromDecoder(D.literal(literal, name))
}

/**
 * @since 3.0.0
 */
export function keyof<A>(keys: Record<keyof A, unknown>, name?: string): Codec<keyof A> {
  return fromDecoder(D.keyof(keys, name))
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
export function type<A>(codecs: { [K in keyof A]: Codec<A[K]> }, name?: string): Codec<A> {
  return {
    ...D.type(codecs, name),
    ...E.type(codecs)
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(codecs: { [K in keyof A]: Codec<A[K]> }, name?: string): Codec<Partial<A>> {
  return {
    ...D.partial(codecs, name),
    ...E.partial(codecs)
  }
}

/**
 * @since 3.0.0
 */
export function record<A>(codec: Codec<A>, name?: string): Codec<Record<string, A>> {
  return {
    ...D.record(codec, name),
    ...E.record(codec)
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(codec: Codec<A>, name?: string): Codec<Array<A>> {
  return {
    ...D.array(codec, name),
    ...E.array(codec)
  }
}

/**
 * @since 3.0.0
 */
export function tuple<A extends [unknown, ...Array<unknown>]>(
  codecs: { [K in keyof A]: Codec<A[K]> },
  name?: string
): Codec<A> {
  return {
    ...D.tuple<A>(codecs, name),
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
export function intersection<A, B, C>(codecs: [Codec<A>, Codec<B>, Codec<C>], name?: string): Codec<A & B & C>
export function intersection<A, B>(codecs: [Codec<A>, Codec<B>], name?: string): Codec<A & B>
export function intersection<A>(codecs: any, name?: string): Codec<A> {
  return {
    ...D.intersection<A, A>(codecs, name),
    ...E.intersection(codecs)
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  codecs: { [K in keyof A]: Codec<A[K]> },
  name?: string
): Codec<A[number]> {
  return {
    ...D.union(codecs, name),
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
