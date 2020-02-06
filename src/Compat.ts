/**
 * Missing
 *   - `pipe` method
 *   - `null` primitive
 *   - `undefined` primitive
 *   - `void` primitive
 *   - `unknown` primitive
 * @since 3.0.0
 */
import { Either } from 'fp-ts/lib/Either'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as C from './Codec'
import * as G from './Guard'
import * as D from './Decoder'
import { Literal, Schemable, WithRefinement, WithUnion } from './Schemable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * Laws: same as `Codec`
 *
 * @since 3.0.0
 */
export interface Compat<A> extends C.Codec<A>, G.Guard<A> {}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function make<A>(is: G.Guard<A>['is'], decode: C.Codec<A>['decode'], encode: C.Codec<A>['encode']): Compat<A> {
  return {
    is,
    decode,
    encode
  }
}

/**
 * @since 3.0.0
 */
export function literals<A extends Literal>(values: NonEmptyArray<A>, id?: string): Compat<A> {
  const codec = C.literals(values, id)
  return make(G.literals(values).is, codec.decode, codec.encode)
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(
  values: NonEmptyArray<A>,
  compat: Compat<B>,
  id?: string
): Compat<A | B> {
  return union([literals(values), compat], id)
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Compat<string> = make(G.string.is, C.string.decode, C.string.encode)

/**
 * @since 3.0.0
 */
export const number: Compat<number> = make(G.number.is, C.number.decode, C.number.encode)

/**
 * @since 3.0.0
 */
export const boolean: Compat<boolean> = make(G.boolean.is, C.boolean.decode, C.boolean.encode)

/**
 * @since 3.0.0
 */
export const UnknownArray: Compat<Array<unknown>> = make(
  G.UnknownArray.is,
  C.UnknownArray.decode,
  C.UnknownArray.encode
)

/**
 * @since 3.0.0
 */
export const UnknownRecord: Compat<Record<string, unknown>> = make(
  G.UnknownRecord.is,
  C.UnknownRecord.decode,
  C.UnknownRecord.encode
)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function refinement<A, B extends A>(
  compat: Compat<A>,
  parser: (a: A) => Either<string, B>,
  id?: string
): Compat<B> {
  const codec = C.refinement(compat, parser, id)
  return make(G.refinement(compat, parser).is, codec.decode, codec.encode)
}

/**
 * @since 3.0.0
 */
export function type<A>(compats: { [K in keyof A]: Compat<A[K]> }, id?: string): Compat<A> {
  const codec = C.type(compats, id)
  return make(G.type(compats).is, codec.decode, codec.encode)
}

/**
 * @since 3.0.0
 */
export function partial<A>(compats: { [K in keyof A]: Compat<A[K]> }, id?: string): Compat<Partial<A>> {
  const codec = C.partial(compats, id)
  return make(G.partial(compats).is, codec.decode, codec.encode)
}

/**
 * @since 3.0.0
 */
export function record<A>(compat: Compat<A>, id?: string): Compat<Record<string, A>> {
  const codec = C.record(compat, id)
  return make(G.record(compat).is, codec.decode, codec.encode)
}

/**
 * @since 3.0.0
 */
export function array<A>(compat: Compat<A>, id?: string): Compat<Array<A>> {
  const codec = C.array(compat, id)
  return make(G.array(compat).is, codec.decode, codec.encode)
}

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(
  compats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>, Compat<E>],
  id?: string
): Compat<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  compats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>],
  id?: string
): Compat<[A, B, C, D]>
export function tuple<A, B, C>(compats: [Compat<A>, Compat<B>, Compat<C>], id?: string): Compat<[A, B, C]>
export function tuple<A, B>(compats: [Compat<A>, Compat<B>], id?: string): Compat<[A, B]>
export function tuple<A>(compats: [Compat<A>], id?: string): Compat<[A]>
export function tuple(compats: any, id?: string): Compat<any> {
  const codec = C.tuple(compats, id)
  return make(G.tuple(compats).is, codec.decode, codec.encode)
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(
  compats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>, Compat<E>],
  id?: string
): Compat<A & B & C & D & E>
export function intersection<A, B, C, D>(
  compats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>],
  id?: string
): Compat<A & B & C & D>
export function intersection<A, B, C>(compats: [Compat<A>, Compat<B>, Compat<C>], id?: string): Compat<A & B & C>
export function intersection<A, B>(compats: [Compat<A>, Compat<B>], id?: string): Compat<A & B>
export function intersection<A>(compats: any, id?: string): Compat<A> {
  const codec = C.intersection<A, A>(compats, id)
  return make(G.intersection<A, A>(compats).is, codec.decode, codec.encode)
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, ...Array<unknown>]>(
  compats: { [K in keyof A]: Compat<A[K]> },
  id?: string
): Compat<A[number]> {
  return make(G.union(compats).is, D.union(compats, id).decode, a => {
    for (const compat of compats) {
      if (compat.is(a)) {
        return compat.encode(a)
      }
    }
  })
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(compats: { [K in keyof A]: Compat<A[K] & Record<T, K>> }, id?: string) => Compat<A[keyof A]> {
  const Csum = C.sum(tag)
  const Gsum = G.sum(tag)
  return (compats, id) => {
    const codec = Csum(compats, id)
    return make(Gsum(compats).is, codec.decode, codec.encode)
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => Compat<A>): Compat<A> {
  const codec = C.lazy(f)
  return make(G.lazy(f).is, codec.decode, codec.encode)
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const URI = 'Compat'

/**
 * @since 3.0.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly Compat: Compat<A>
  }
}

/**
 * @since 3.0.0
 */
export const compat: Schemable<URI> & WithRefinement<URI> & WithUnion<URI> = {
  URI,
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
  refinement: refinement as WithRefinement<URI>['refinement'],
  union
}
