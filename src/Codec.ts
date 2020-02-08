/**
 * Breaking changes:
 * - remove `brand` combinator
 * - rename `recursive` to `lazy`
 *
 * FAQ
 * - is it possible to provide a custom message?
 *   - `withMessage` (already existing codecs)
 *   - `refinement`
 *   - `parse`
 * - how to change a field? (for example snake case to camel case)
 *   - `map`
 *
 * Open questions:
 * - is it possible to define a Semigroup for DecodeError?
 * - is it possible to handle `enum`s?
 * - is it possible to define a Decoder which fails on additional properties?
 * - is it possible to get only the first error?
 * - readonly support?
 * - Is there a way to generate newtypes?
 * - Is there a way to generate branded types + smart constructors based on a user provided predicate?
 *
 * Schemas:
 * - Schemable<URI> & WithRefinement<URI>
 *   - Codec
 *   - Encoder
 *   - Eq
 * - Schemable<URI> & WithUnion<URI>
 *   - JsonSchema
 *   - DSL
 *   - Expression
 *   - TypeNode
 * - Schemable<URI> & WithUnion<URI> & WithRefinement<URI>
 *   - Compat
 *   - Guard
 * - Schemable<URI> & WithUnion<URI> & WithParse<URI>
 *   - Arbitrary
 *   - ArbitraryMutation
 *   - Decoder
 *
 * @since 3.0.0
 */
import { Either } from 'fp-ts/lib/Either'
import { Invariant1 } from 'fp-ts/lib/Invariant'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as DE from './DecodeError'
import { Decoder, decoder, withMessage as withMessageD } from './Decoder'
import { Encoder, encoder } from './Encoder'
import { Literal, Schemable, WithRefinement } from './Schemable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * Laws:
 *
 * 1. `pipe(codec.decode(u), E.fold(() => u, codec.encode) = u` for all `u` in `unknown`
 * 2. `codec.decode(codec.encode(a)) = E.right(a)` for all `a` in `A`
 *
 * @since 3.0.0
 */
export interface Codec<A> extends Decoder<A>, Encoder<A> {}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function make<A>(decoder: Decoder<A>, encoder: Encoder<A>): Codec<A> {
  return {
    decode: decoder.decode,
    encode: encoder.encode
  }
}

/**
 * @since 3.0.0
 */
export function literal<A extends Literal>(value: A, id?: string): Codec<A> {
  return make(decoder.literal(value, id), encoder.literal(value, id))
}

/**
 * @since 3.0.0
 */
export function literals<A extends Literal>(values: NonEmptyArray<A>, id?: string): Codec<A> {
  return make(decoder.literals(values, id), encoder.literals(values, id))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(values: NonEmptyArray<A>, codec: Codec<B>, id?: string): Codec<A | B> {
  return make(decoder.literalsOr(values, codec, id), encoder.literalsOr(values, codec, id))
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Codec<string> = make(decoder.string, encoder.string)

/**
 * @since 3.0.0
 */
export const number: Codec<number> = make(decoder.number, encoder.number)

/**
 * @since 3.0.0
 */
export const boolean: Codec<boolean> = make(decoder.boolean, encoder.boolean)

/**
 * @since 3.0.0
 */
export const UnknownArray: Codec<Array<unknown>> = make(decoder.UnknownArray, encoder.UnknownArray)

/**
 * @since 3.0.0
 */
export const UnknownRecord: Codec<Record<string, unknown>> = make(decoder.UnknownRecord, encoder.UnknownRecord)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function withMessage<A>(codec: Codec<A>, message: (e: DE.DecodeError) => string): Codec<A> {
  return make(withMessageD(codec, message), codec)
}

/**
 * @since 3.0.0
 */
export function refinement<A, B extends A>(
  codec: Codec<A>,
  parser: (a: A) => Either<string, B>,
  id?: string
): Codec<B> {
  return make(decoder.refinement(codec, parser, id), encoder.refinement(codec, parser, id))
}

/**
 * @since 3.0.0
 */
export function type<A>(properties: { [K in keyof A]: Codec<A[K]> }, id?: string): Codec<A> {
  return make(decoder.type(properties, id), encoder.type(properties, id))
}

/**
 * @since 3.0.0
 */
export function partial<A>(properties: { [K in keyof A]: Codec<A[K]> }, id?: string): Codec<Partial<A>> {
  return make(decoder.partial(properties, id), encoder.partial(properties, id))
}

/**
 * @since 3.0.0
 */
export function record<A>(codomain: Codec<A>, id?: string): Codec<Record<string, A>> {
  return make(decoder.record(codomain, id), encoder.record(codomain, id))
}

/**
 * @since 3.0.0
 */
export function array<A>(items: Codec<A>, id?: string): Codec<Array<A>> {
  return make(decoder.array(items, id), encoder.array(items, id))
}

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(
  items: [Codec<A>, Codec<B>, Codec<C>, Codec<D>, Codec<E>],
  id?: string
): Codec<[A, B, C, D, E]>
export function tuple<A, B, C, D>(items: [Codec<A>, Codec<B>, Codec<C>, Codec<D>], id?: string): Codec<[A, B, C, D]>
export function tuple<A, B, C>(items: [Codec<A>, Codec<B>, Codec<C>], id?: string): Codec<[A, B, C]>
export function tuple<A, B>(items: [Codec<A>, Codec<B>], id?: string): Codec<[A, B]>
export function tuple<A>(items: [Codec<A>], id?: string): Codec<[A]>
export function tuple(items: any, id?: string): Codec<any> {
  return make(decoder.tuple(items, id), encoder.tuple(items, id))
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(
  codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>, Codec<E>],
  id?: string
): Codec<A & B & C & D & E>
export function intersection<A, B, C, D>(
  codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>],
  id?: string
): Codec<A & B & C & D>
export function intersection<A, B, C>(codecs: [Codec<A>, Codec<B>, Codec<C>], id?: string): Codec<A & B & C>
export function intersection<A, B>(codecs: [Codec<A>, Codec<B>], id?: string): Codec<A & B>
export function intersection<A>(codecs: any, id?: string): Codec<A> {
  return make(decoder.intersection<A, A>(codecs, id), encoder.intersection(codecs, id))
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(codecs: { [K in keyof A]: Codec<A[K] & Record<T, K>> }, id?: string) => Codec<A[keyof A]> {
  const sumD = decoder.sum(tag)
  const sumE = encoder.sum(tag)
  return (codecs, id) => make(sumD(codecs, id), sumE(codecs, id))
}

/**
 * @since 3.0.0
 */
export function lazy<A>(id: string, f: () => Codec<A>): Codec<A> {
  return make(decoder.lazy(id, f), encoder.lazy(id, f))
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
export const codec: Invariant1<URI> & Schemable<URI> & WithRefinement<URI> = {
  URI,
  imap: (fa, f, g) => make(decoder.map(fa, f), encoder.contramap(fa, g)),
  literal,
  literals,
  literalsOr,
  string,
  number,
  boolean,
  UnknownArray,
  UnknownRecord,
  type,
  partial,
  record,
  array,
  tuple,
  intersection,
  sum,
  lazy,
  refinement: refinement as WithRefinement<URI>['refinement']
}
