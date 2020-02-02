/**
 * Breaking changes:
 * - remove all optional `name` arguments (use `withName` instead)
 * - remove `brand` combinator
 * - rename `recursive` to `lazy`
 *
 * FAQ
 * - is it possible to provide a custom message?
 *   - `refinement`
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
 * - does it support recursion in schemas?
 * - Is there a way to generate newtypes?
 * - Is there a way to generate branded types + smart constructors based on a user provided predicate?
 *
 * Schemas:
 * - S.Schemable<URI> & S.WithRefinement<URI>
 *   - Codec
 *   - Encoder
 *   - Eq
 * - S.Schemable<URI> & S.WithUnion<URI>
 *   - JsonSchema
 *   - Static
 * - S.Schemable<URI> & S.WithRefinement<URI> & S.WithUnion<URI>
 *   - Arbitrary
 *   - ArbitraryMutation
 *   - Decoder
 *   - Guard
 *   - DSL
 *
 * @since 3.0.0
 */
import { Invariant1 } from 'fp-ts/lib/Invariant'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as D from './Decoder'
import * as E from './Encoder'
import * as S from './Schemable'
import { Either, isRight } from 'fp-ts/lib/Either'

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
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): Codec<A> {
  return make(D.literals(values), E.literals(values))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal, B>(values: NonEmptyArray<A>, codec: Codec<B>): Codec<A | B> {
  return make(D.literalsOr(values, codec), E.literalsOr(values, codec))
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
export function refinement<A, B extends A>(codec: Codec<A>, parser: (a: A) => Either<string, B>): Codec<B> {
  return make(D.parse(codec, parser), codec)
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
export function sum<T extends string>(
  tag: T
): <A>(codecs: { [K in keyof A]: Codec<A[K] & Record<T, K>> }) => Codec<A[keyof A]> {
  const Dsum = D.sum(tag)
  const Esum = E.sum(tag)
  return codecs => make(Dsum(codecs), Esum(codecs))
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
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  codecs: { [K in keyof A]: Codec<A[K]> }
): Codec<A[number]> {
  return make(D.union(codecs), {
    encode: a => {
      for (const codec of codecs) {
        try {
          const o = codec.encode(a)
          if (isRight(codec.decode(o))) {
            return o
          }
        } catch (e) {
          continue
        }
      }
    }
  })
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
export const codec: Invariant1<URI> & S.Schemable<URI> & S.WithRefinement<URI> & S.WithUnion<URI> = {
  URI,
  imap: (fa, f, g) => make(D.decoder.map(fa, f), E.encoder.contramap(fa, g)),
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
  refinement: refinement as S.WithRefinement<URI>['refinement'],
  union
}
