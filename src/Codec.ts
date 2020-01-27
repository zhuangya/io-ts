/**
 * Breaking changes:
 * - remove all optional `name` arguments (use `withName` instead)
 * - remove `brand` combinator
 * - rename `recursive` to `lazy`
 *
 * FAQ
 * - is it possible to provide a custom message?
 *   - `parse`
 *   - `withMessage` (already existing codecs)
 * - how to change a field? (for example snake case to camel case)
 *   - `map`
 *
 * Open problems:
 * - is it possible to optimize unions (sum types)?
 *
 * Open questions:
 * - is it possible to define a Semigroup for DecodeError?
 * - is it possible to handle `enum`s?
 * - is it possible to define a Decoder which fails on additional fields?
 * - is it possible to get only the first error?
 * - readonly?
 *
 * Schemas:
 * - S.Schemable<URI>
 *   - Codec
 *   - Encoder
 *   - Eq
 * - S.Schemable<URI> & S.WithUnion<URI>
 *   - JsonSchema
 * - S.Schemable<URI> & S.WithParse<URI> & S.WithUnion<URI>
 *   - Arbitrary
 *   - Decoder
 *   - Guard
 *
 * @since 3.0.0
 */
import { Invariant1 } from 'fp-ts/lib/Invariant'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
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
export function constants<A>(as: NonEmptyArray<A>): Codec<A> {
  return make(D.constants(as), E.constants(as))
}

/**
 * @since 3.0.0
 */
export function constantsOr<A, B>(as: NonEmptyArray<A>, codec: Codec<B>): Codec<A | B> {
  return make(D.constantsOr(as, codec), E.constantsOr(as, codec))
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Codec<string> = make(D.string, E.string)

/**
 * @since 3.0.0
 */
export const number: Codec<number> = make(D.number, E.number)

/**
 * @since 3.0.0
 */
export const boolean: Codec<boolean> = make(D.boolean, E.boolean)

/**
 * @since 3.0.0
 */
export const UnknownArray: Codec<Array<unknown>> = make(D.UnknownArray, E.UnknownArray)

/**
 * @since 3.0.0
 */
export const UnknownRecord: Codec<Record<string, unknown>> = make(D.UnknownRecord, E.UnknownRecord)

/**
 * @since 3.0.0
 */
export const Int: Codec<S.Int> = make(D.Int, E.Int)

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

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(codecs: { [K in keyof A]: Codec<A[K] & Record<T, K>> }) => Codec<A[keyof A]> {
  const Dsum = D.sum(tag)
  const Esum = E.sum(tag)
  return codecs => make(Dsum(codecs), Esum(codecs))
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
export const codec: Invariant1<URI> & S.Schemable<URI> = {
  URI,
  imap: (fa, f, g) => make(D.decoder.map(fa, f), E.encoder.contramap(fa, g)),
  constants,
  constantsOr,
  string,
  number,
  boolean,
  Int,
  UnknownArray,
  UnknownRecord,
  type,
  partial,
  record,
  array,
  tuple,
  intersection,
  lazy,
  sum
}
