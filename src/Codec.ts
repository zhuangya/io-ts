/**
 * Breaking changes:
 * - remove all optional `name` arguments (use `withName` instead)
 * - `refinement`
 *   - `name` is mandatory
 * - remove `brand` combinator
 * - rename `recursive` to `lazy`
 *
 * TODO
 * - refactor DecodeError
 * - make expected optional
 * - add composeIso?
 *
 * @since 3.0.0
 */
import { Refinement } from 'fp-ts/lib/function'
import * as D from './Decoder'
import * as E from './Encoder'
import * as S from './Schemable'

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
export function make<A>(decoder: D.Decoder<A>, encoder: E.Encoder<A>): Codec<A> {
  return {
    decode: decoder.decode,
    encode: encoder.encode
  }
}

/**
 * @since 3.0.0
 */
export function fromDecoder<A>(decoder: D.Decoder<A>): Codec<A> {
  return make(decoder, E.id)
}

/**
 * @since 3.0.0
 */
export function literal<A extends string | number | boolean | null | undefined>(as: Array<A>): Codec<A> {
  return fromDecoder(D.literal(as))
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
export const Int: Codec<S.Int> = fromDecoder(D.Int)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function withExpected<A>(codec: Codec<A>, expected: string): Codec<A> {
  return make(D.withExpected(codec, expected), codec)
}

/**
 * @since 3.0.0
 */
export function refinement<A, B extends A>(codec: Codec<A>, refinement: Refinement<A, B>, expected: string): Codec<B> {
  return make(D.refinement(codec, refinement, expected), codec)
}

/**
 * @since 3.0.0
 */
export function type<A>(codecs: { [K in keyof A]: Codec<A[K]> }): Codec<A> {
  return make(D.type(codecs), E.type(codecs))
}

/**
 * @since 3.0.0
 */
export function partial<A>(codecs: { [K in keyof A]: Codec<A[K]> }): Codec<Partial<A>> {
  return make(D.partial(codecs), E.partial(codecs))
}

/**
 * @since 3.0.0
 */
export function record<A>(codec: Codec<A>): Codec<Record<string, A>> {
  return make(D.record(codec), E.record(codec))
}

/**
 * @since 3.0.0
 */
export function array<A>(codec: Codec<A>): Codec<Array<A>> {
  return make(D.array(codec), E.array(codec))
}

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>, Codec<E>]): Codec<[A, B, C, D, E]>
export function tuple<A, B, C, D>(codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>]): Codec<[A, B, C, D]>
export function tuple<A, B, C>(codecs: [Codec<A>, Codec<B>, Codec<C>]): Codec<[A, B, C]>
export function tuple<A, B>(codecs: [Codec<A>, Codec<B>]): Codec<[A, B]>
export function tuple<A>(codecs: [Codec<A>]): Codec<[A]>
export function tuple(codecs: any): Codec<any> {
  return make(D.tuple(codecs), E.tuple(codecs))
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
  return make(D.intersection<A, A>(codecs), E.intersection(codecs))
}

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => Codec<A>): Codec<A> {
  return make(D.lazy(f), E.lazy(f))
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const URI = 'Codec'

/**
 * @since 3.0.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly Codec: Codec<A>
  }
}

/**
 * @since 3.0.0
 */
export const codec: S.Schemable<URI> = {
  URI,
  literal,
  string,
  number,
  boolean,
  Int,
  refinement: refinement as S.Schemable<URI>['refinement'],
  UnknownArray,
  UnknownRecord,
  type,
  partial,
  record,
  array,
  tuple,
  intersection,
  lazy
}
