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
import { Codec, codec } from './Codec'
import { decoder } from './Decoder'
import { Guard, guard } from './Guard'
import { Literal } from './Literal'
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
export function literal<A extends Literal>(value: A, id?: string): Compat<A> {
  return make(codec.literal(value, id), guard.literal(value, id))
}

/**
 * @since 3.0.0
 */
export function literals<A extends Literal>(values: readonly [A, ...Array<A>], id?: string): Compat<A> {
  return make(codec.literals(values, id), guard.literals(values, id))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(
  values: readonly [A, ...Array<A>],
  or: Compat<B>,
  id?: string
): Compat<A | B> {
  return make(codec.literalsOr(values, or, id), guard.literalsOr(values, or, id))
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
  from: Compat<A>,
  parser: (a: A) => Either<string, B>,
  id?: string
): Compat<B> {
  return make(codec.refinement(from, parser, id), guard.refinement(from, parser, id))
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
export function tuple2<A, B>(itemA: Compat<A>, itemB: Compat<B>, id?: string): Compat<[A, B]> {
  return make(codec.tuple2(itemA, itemB, id), guard.tuple2(itemA, itemB, id))
}

/**
 * @since 3.0.0
 */
export function tuple3<A, B, C>(itemA: Compat<A>, itemB: Compat<B>, itemC: Compat<C>, id?: string): Compat<[A, B, C]> {
  return make(codec.tuple3(itemA, itemB, itemC, id), guard.tuple3(itemA, itemB, itemC, id))
}

/**
 * @since 3.0.0
 */
export function intersection<A, B>(left: Compat<A>, right: Compat<B>, id?: string): Compat<A & B> {
  return make(codec.intersection(left, right, id), guard.intersection(left, right, id))
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, ...Array<unknown>]>(
  members: { [K in keyof A]: Compat<A[K]> },
  id?: string
): Compat<A[number]> {
  return {
    is: guard.union(members, id).is,
    decode: decoder.union(members, id).decode,
    encode: a => {
      for (const compat of members) {
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
): <A>(members: { [K in keyof A]: Compat<A[K] & Record<T, K>> }, id?: string) => Compat<A[keyof A]> {
  const sumC = codec.sum(tag)
  const sumG = guard.sum(tag)
  return (members, id) => make(sumC(members, id), sumG(members, id))
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
export const compat: S.Schemable<URI> & S.WithUnion<URI> & S.WithRefinement<URI> = {
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
  tuple2,
  tuple3,
  intersection,
  sum,
  lazy,
  refinement: refinement as S.WithRefinement<URI>['refinement'],
  union
}
