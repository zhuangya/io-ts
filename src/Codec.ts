/**
 * Breaking changes:
 * - remove `brand` combinator
 * - rename `recursive` to `lazy`
 * - intersections support two, spreaded arguments
 * - tuples support up to 3 spreaded arguments
 *
 * FAQ
 * - is it possible to provide a custom message?
 *   - `withMessage` (already existing codecs)
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
 * - Schemable<URI>
 *   - Eq
 *   - Encoder
 *   - Codec
 * - Schemable<URI> & WithUnion<URI>
 *   - Arbitrary
 *   - ArbitraryMutation
 *   - Compat
 *   - Decoder
 *   - DSL
 *   - Guard
 *   - Expression
 *   - JsonSchema
 *   - TypeNode
 *
 * @since 3.0.0
 */
import { Invariant1 } from 'fp-ts/lib/Invariant'
import * as D from './Decoder'
import * as E from './Encoder'
import { Literal } from './Literal'
import * as S from './Schemable'
import { ReadonlyNonEmptyArray } from './util'
import * as T from 'fp-ts/lib/Tree'

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
export function literal<A extends Literal>(value: A, id?: string): Codec<A> {
  return make(D.decoder.literal(value, id), E.encoder.literal(value, id))
}

/**
 * @since 3.0.0
 */
export function literals<A extends Literal>(values: ReadonlyNonEmptyArray<A>, id?: string): Codec<A> {
  return make(D.decoder.literals(values, id), E.encoder.literals(values, id))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(
  values: ReadonlyNonEmptyArray<A>,
  or: Codec<B>,
  id?: string
): Codec<A | B> {
  return make(D.decoder.literalsOr(values, or, id), E.encoder.literalsOr(values, or, id))
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Codec<string> = make(D.decoder.string, E.encoder.string)

/**
 * @since 3.0.0
 */
export const number: Codec<number> = make(D.decoder.number, E.encoder.number)

/**
 * @since 3.0.0
 */
export const boolean: Codec<boolean> = make(D.decoder.boolean, E.encoder.boolean)

/**
 * @since 3.0.0
 */
export const UnknownArray: Codec<Array<unknown>> = make(D.decoder.UnknownArray, E.encoder.UnknownArray)

/**
 * @since 3.0.0
 */
export const UnknownRecord: Codec<Record<string, unknown>> = make(D.decoder.UnknownRecord, E.encoder.UnknownRecord)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function withExpected<A>(
  codec: Codec<A>,
  expected: (actual: unknown, e: T.Tree<string>) => T.Tree<string>
): Codec<A> {
  return make(D.withExpected(codec, expected), codec)
}

/**
 * @since 3.0.0
 */
export function refinement<A, B extends A>(from: Codec<A>, refinement: (a: A) => a is B, id: string): Codec<B> {
  return make(D.refinement(from, refinement, id), from)
}

/**
 * @since 3.0.0
 */
export function type<A>(properties: { [K in keyof A]: Codec<A[K]> }, id?: string): Codec<A> {
  return make(D.decoder.type(properties, id), E.encoder.type(properties, id))
}

/**
 * @since 3.0.0
 */
export function partial<A>(properties: { [K in keyof A]: Codec<A[K]> }, id?: string): Codec<Partial<A>> {
  return make(D.decoder.partial(properties, id), E.encoder.partial(properties, id))
}

/**
 * @since 3.0.0
 */
export function record<A>(codomain: Codec<A>, id?: string): Codec<Record<string, A>> {
  return make(D.decoder.record(codomain, id), E.encoder.record(codomain, id))
}

/**
 * @since 3.0.0
 */
export function array<A>(items: Codec<A>, id?: string): Codec<Array<A>> {
  return make(D.decoder.array(items, id), E.encoder.array(items, id))
}

/**
 * @since 3.0.0
 */
export function tuple<A, B>(left: Codec<A>, right: Codec<B>, id?: string): Codec<[A, B]> {
  return make(D.decoder.tuple(left, right, id), E.encoder.tuple(left, right, id))
}

/**
 * @since 3.0.0
 */
export function intersection<A, B>(left: Codec<A>, right: Codec<B>, id?: string): Codec<A & B> {
  return make(D.decoder.intersection(left, right, id), E.encoder.intersection(left, right, id))
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(members: { [K in keyof A]: Codec<A[K] & Record<T, K>> }, id?: string) => Codec<A[keyof A]> {
  const sumD = D.decoder.sum(tag)
  const sumE = E.encoder.sum(tag)
  return (members, id) => make(sumD(members, id), sumE(members, id))
}

/**
 * @since 3.0.0
 */
export function lazy<A>(id: string, f: () => Codec<A>): Codec<A> {
  return make(D.decoder.lazy(id, f), E.encoder.lazy(id, f))
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
  lazy
}
