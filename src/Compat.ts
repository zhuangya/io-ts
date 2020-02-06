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
export function make<A>(codec: C.Codec<A>, guard: G.Guard<A>): Compat<A> {
  return {
    is: guard.is,
    decode: codec.decode,
    encode: codec.encode
  }
}

/**
 * @since 3.0.0
 */
export function literals<A extends Literal>(values: NonEmptyArray<A>, id?: string): Compat<A> {
  return make(C.literals(values, id), G.literals(values))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(
  values: NonEmptyArray<A>,
  compat: Compat<B>,
  id?: string
): Compat<A | B> {
  return make(C.literalsOr(values, compat, id), G.literalsOr(values, compat))
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Compat<string> = make(C.string, G.string)

/**
 * @since 3.0.0
 */
export const number: Compat<number> = make(C.number, G.number)

/**
 * @since 3.0.0
 */
export const boolean: Compat<boolean> = make(C.boolean, G.boolean)

/**
 * @since 3.0.0
 */
export const UnknownArray: Compat<Array<unknown>> = make(C.UnknownArray, G.UnknownArray)

/**
 * @since 3.0.0
 */
export const UnknownRecord: Compat<Record<string, unknown>> = make(C.UnknownRecord, G.UnknownRecord)

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
  return make(C.refinement(compat, parser, id), G.guard.refinement(compat, parser))
}

/**
 * @since 3.0.0
 */
export function type<A>(compats: { [K in keyof A]: Compat<A[K]> }, id?: string): Compat<A> {
  return make(C.type(compats, id), G.type(compats))
}

/**
 * @since 3.0.0
 */
export function partial<A>(compats: { [K in keyof A]: Compat<A[K]> }, id?: string): Compat<Partial<A>> {
  return make(C.partial(compats, id), G.partial(compats))
}

/**
 * @since 3.0.0
 */
export function record<A>(compat: Compat<A>, id?: string): Compat<Record<string, A>> {
  return make(C.record(compat, id), G.record(compat))
}

/**
 * @since 3.0.0
 */
export function array<A>(compat: Compat<A>, id?: string): Compat<Array<A>> {
  return make(C.array(compat, id), G.array(compat))
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
  return make(C.tuple(compats, id), G.tuple(compats))
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
  return make(C.intersection<A, A>(compats, id), G.intersection<A, A>(compats))
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, ...Array<unknown>]>(
  compats: { [K in keyof A]: Compat<A[K]> },
  id?: string
): Compat<A[number]> {
  const codec = C.make(D.union(compats, id), {
    encode: a => {
      for (const compat of compats) {
        if (compat.is(a)) {
          return compat.encode(a)
        }
      }
    }
  })
  return make(codec, G.union(compats))
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
    return make(Csum(compats, id), Gsum(compats))
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(id: string, f: () => Compat<A>): Compat<A> {
  return make(C.lazy(id, f), G.lazy(f))
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
