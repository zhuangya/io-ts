/**
 * Missing
 *   - `pipe` method
 *   - `null` primitive
 *   - `undefined` primitive
 *   - `void` primitive
 *   - `unknown` primitive
 * @since 3.0.0
 */
import * as C from './Codec'
import * as D from './Decoder'
import * as G from './Guard'
import { Literal } from './Literal'
import * as S from './Schemable'
import { ReadonlyNonEmptyArray, ReadonlyNonEmptyTuple } from './util'

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
export function literal<A extends Literal>(value: A, id?: string): Compat<A> {
  return make(C.codec.literal(value, id), G.guard.literal(value, id))
}

/**
 * @since 3.0.0
 */
export function literals<A extends Literal>(values: ReadonlyNonEmptyArray<A>, id?: string): Compat<A> {
  return make(C.codec.literals(values, id), G.guard.literals(values, id))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(
  values: ReadonlyNonEmptyArray<A>,
  or: Compat<B>,
  id?: string
): Compat<A | B> {
  return make(C.codec.literalsOr(values, or, id), G.guard.literalsOr(values, or, id))
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Compat<string> = make(C.codec.string, G.guard.string)

/**
 * @since 3.0.0
 */
export const number: Compat<number> = make(C.codec.number, G.guard.number)

/**
 * @since 3.0.0
 */
export const boolean: Compat<boolean> = make(C.codec.boolean, G.guard.boolean)

/**
 * @since 3.0.0
 */
export const UnknownArray: Compat<Array<unknown>> = make(C.codec.UnknownArray, G.guard.UnknownArray)

/**
 * @since 3.0.0
 */
export const UnknownRecord: Compat<Record<string, unknown>> = make(C.codec.UnknownRecord, G.guard.UnknownRecord)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function refinement<A, B extends A>(from: Compat<A>, refinement: (a: A) => a is B, id?: string): Compat<B> {
  return make(C.refinement(from, refinement, id), G.refinement(from, refinement))
}

/**
 * @since 3.0.0
 */
export function type<A>(properties: { [K in keyof A]: Compat<A[K]> }, id?: string): Compat<A> {
  return make(C.codec.type(properties, id), G.guard.type(properties, id))
}

/**
 * @since 3.0.0
 */
export function partial<A>(properties: { [K in keyof A]: Compat<A[K]> }, id?: string): Compat<Partial<A>> {
  return make(C.codec.partial(properties, id), G.guard.partial(properties, id))
}

/**
 * @since 3.0.0
 */
export function record<A>(codomain: Compat<A>, id?: string): Compat<Record<string, A>> {
  return make(C.codec.record(codomain, id), G.guard.record(codomain, id))
}

/**
 * @since 3.0.0
 */
export function array<A>(items: Compat<A>, id?: string): Compat<Array<A>> {
  return make(C.codec.array(items, id), G.guard.array(items, id))
}

/**
 * @since 3.0.0
 */
export function tuple<A, B>(left: Compat<A>, right: Compat<B>, id?: string): Compat<[A, B]> {
  return make(C.codec.tuple(left, right, id), G.guard.tuple(left, right, id))
}

/**
 * @since 3.0.0
 */
export function intersection<A, B>(left: Compat<A>, right: Compat<B>, id?: string): Compat<A & B> {
  return make(C.codec.intersection(left, right, id), G.guard.intersection(left, right, id))
}

/**
 * @since 3.0.0
 */
export function union<A extends ReadonlyNonEmptyTuple<unknown>>(
  members: { [K in keyof A]: Compat<A[K]> },
  id?: string
): Compat<A[number]> {
  return {
    is: G.guard.union(members, id).is,
    decode: D.decoder.union(members, id).decode,
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
  const sumC = C.codec.sum(tag)
  const sumG = G.guard.sum(tag)
  return (members, id) => make(sumC(members, id), sumG(members, id))
}

/**
 * @since 3.0.0
 */
export function lazy<A>(id: string, f: () => Compat<A>): Compat<A> {
  return make(C.codec.lazy(id, f), G.guard.lazy(id, f))
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
export const compat: S.Schemable<URI> & S.WithUnion<URI> = {
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
  union
}
