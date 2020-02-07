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
import { Codec, codec } from './Codec'
import { Guard, guard } from './Guard'
import { decoder } from './Decoder'
import * as S from './Schemable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * Laws: same as `Codec`
 *
 * @since 3.0.0
 */
export interface Compat<A> extends Codec<A>, Guard<A> {}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function make<A>(codec: Codec<A>, guard: Guard<A>): Compat<A> {
  return {
    is: guard.is,
    decode: codec.decode,
    encode: codec.encode
  }
}

/**
 * @since 3.0.0
 */
export function literal<A extends S.Literal>(value: A, id?: string): Compat<A> {
  return make(codec.literal(value, id), guard.literal(value, id))
}

/**
 * @since 3.0.0
 */
export function literals<A extends S.Literal>(values: NonEmptyArray<A>, id?: string): Compat<A> {
  return make(codec.literals(values, id), guard.literals(values, id))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal, B>(
  values: NonEmptyArray<A>,
  compat: Compat<B>,
  id?: string
): Compat<A | B> {
  return make(codec.literalsOr(values, compat, id), guard.literalsOr(values, compat, id))
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Compat<string> = make(codec.string, guard.string)

/**
 * @since 3.0.0
 */
export const number: Compat<number> = make(codec.number, guard.number)

/**
 * @since 3.0.0
 */
export const boolean: Compat<boolean> = make(codec.boolean, guard.boolean)

/**
 * @since 3.0.0
 */
export const UnknownArray: Compat<Array<unknown>> = make(codec.UnknownArray, guard.UnknownArray)

/**
 * @since 3.0.0
 */
export const UnknownRecord: Compat<Record<string, unknown>> = make(codec.UnknownRecord, guard.UnknownRecord)

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
  return make(codec.refinement(compat, parser, id), guard.refinement(compat, parser, id))
}

/**
 * @since 3.0.0
 */
export function type<A>(properties: { [K in keyof A]: Compat<A[K]> }, id?: string): Compat<A> {
  return make(codec.type(properties, id), guard.type(properties, id))
}

/**
 * @since 3.0.0
 */
export function partial<A>(properties: { [K in keyof A]: Compat<A[K]> }, id?: string): Compat<Partial<A>> {
  return make(codec.partial(properties, id), guard.partial(properties, id))
}

/**
 * @since 3.0.0
 */
export function record<A>(codomain: Compat<A>, id?: string): Compat<Record<string, A>> {
  return make(codec.record(codomain, id), guard.record(codomain, id))
}

/**
 * @since 3.0.0
 */
export function array<A>(items: Compat<A>, id?: string): Compat<Array<A>> {
  return make(codec.array(items, id), guard.array(items, id))
}

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(
  items: [Compat<A>, Compat<B>, Compat<C>, Compat<D>, Compat<E>],
  id?: string
): Compat<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  compitemsats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>],
  id?: string
): Compat<[A, B, C, D]>
export function tuple<A, B, C>(items: [Compat<A>, Compat<B>, Compat<C>], id?: string): Compat<[A, B, C]>
export function tuple<A, B>(compats: [Compat<A>, Compat<B>], id?: string): Compat<[A, B]>
export function tuple<A>(items: [Compat<A>], id?: string): Compat<[A]>
export function tuple(items: any, id?: string): Compat<any> {
  return make(codec.tuple(items, id), guard.tuple(items, id))
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
  return make(codec.intersection<A, A>(compats, id), guard.intersection<A, A>(compats, id))
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, ...Array<unknown>]>(
  compats: { [K in keyof A]: Compat<A[K]> },
  id?: string
): Compat<A[number]> {
  return {
    is: guard.union(compats, id).is,
    decode: decoder.union(compats, id).decode,
    encode: a => {
      for (const compat of compats) {
        if (compat.is(a)) {
          return compat.encode(a)
        }
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(compats: { [K in keyof A]: Compat<A[K] & Record<T, K>> }, id?: string) => Compat<A[keyof A]> {
  const sumC = codec.sum(tag)
  const sumG = guard.sum(tag)
  return (compats, id) => make(sumC(compats, id), sumG(compats, id))
}

/**
 * @since 3.0.0
 */
export function lazy<A>(id: string, f: () => Compat<A>): Compat<A> {
  return make(codec.lazy(id, f), guard.lazy(id, f))
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
export const compat: S.TypeScriptable<URI> & S.WithRefinement<URI> = {
  URI,
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
  refinement: refinement as S.WithRefinement<URI>['refinement'],
  union
}
