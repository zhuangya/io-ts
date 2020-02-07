/**
 * TODO
 * - optimize encode when all encoders are noop
 *
 * @since 3.0.0
 */
import { Contravariant1 } from 'fp-ts/lib/Contravariant'
import { identity } from 'fp-ts/lib/function'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { pipeable } from 'fp-ts/lib/pipeable'
import * as G from './Guard'
import * as S from './Schemable'
import * as U from './util'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export interface Encoder<A> {
  readonly encode: (a: A) => unknown
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function literals<A extends S.Literal>(_as: NonEmptyArray<A>): Encoder<A> {
  return id
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal, B>(as: NonEmptyArray<A>, encoder: Encoder<B>): Encoder<A | B> {
  const literals = G.literals(as)
  return {
    encode: ab => (literals.is(ab) ? ab : encoder.encode(ab))
  }
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const id: Encoder<unknown> = {
  encode: identity
}

/**
 * @since 3.0.0
 */
export const string: Encoder<string> = id

/**
 * @since 3.0.0
 */
export const number: Encoder<number> = id

/**
 * @since 3.0.0
 */
export const boolean: Encoder<boolean> = id

/**
 * @since 3.0.0
 */
export const UnknownArray: Encoder<Array<unknown>> = id

/**
 * @since 3.0.0
 */
export const UnknownRecord: Encoder<Record<string, unknown>> = id

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function type<A>(properties: { [K in keyof A]: Encoder<A[K]> }): Encoder<A> {
  return {
    encode: a => {
      const o: Record<string, unknown> = {}
      for (const k in properties) {
        o[k] = properties[k].encode(a[k])
      }
      return o
    }
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(properties: { [K in keyof A]: Encoder<A[K]> }): Encoder<Partial<A>> {
  return {
    encode: a => {
      const o: Record<string, unknown> = {}
      for (const k in properties) {
        const v: A[Extract<keyof A, string>] | undefined = a[k]
        // don't add missing properties
        if (U.hasOwnProperty(a, k)) {
          // don't strip undefined properties
          o[k] = v === undefined ? v : properties[k].encode(v)
        }
      }
      return o
    }
  }
}

/**
 * @since 3.0.0
 */
export function record<A>(codomain: Encoder<A>): Encoder<Record<string, A>> {
  return {
    encode: r => {
      const o: Record<string, unknown> = {}
      for (const k in r) {
        o[k] = codomain.encode(r[k])
      }
      return o
    }
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(items: Encoder<A>): Encoder<Array<A>> {
  return {
    encode: as => as.map(items.encode)
  }
}

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(
  items: [Encoder<A>, Encoder<B>, Encoder<C>, Encoder<D>, Encoder<E>]
): Encoder<[A, B, C, D, E]>
export function tuple<A, B, C, D>(items: [Encoder<A>, Encoder<B>, Encoder<C>, Encoder<D>]): Encoder<[A, B, C, D]>
export function tuple<A, B, C>(items: [Encoder<A>, Encoder<B>, Encoder<C>]): Encoder<[A, B, C]>
export function tuple<A, B>(items: [Encoder<A>, Encoder<B>]): Encoder<[A, B]>
export function tuple<A>(items: [Encoder<A>]): Encoder<[A]>
export function tuple(items: Array<Encoder<unknown>>): Encoder<Array<unknown>> {
  return {
    encode: as => items.map((encoder, i) => encoder.encode(as[i]))
  }
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(
  encoders: [Encoder<A>, Encoder<B>, Encoder<C>, Encoder<D>, Encoder<E>]
): Encoder<A & B & C & D & E>
export function intersection<A, B, C, D>(
  encoders: [Encoder<A>, Encoder<B>, Encoder<C>, Encoder<D>]
): Encoder<A & B & C & D>
export function intersection<A, B, C>(encoders: [Encoder<A>, Encoder<B>, Encoder<C>]): Encoder<A & B & C>
export function intersection<A, B>(encoders: [Encoder<A>, Encoder<B>]): Encoder<A & B>
export function intersection<A>(encoders: Array<Encoder<A>>): Encoder<A> {
  return {
    encode: a => encoders.map(encoder => encoder.encode(a)).reduce(U.intersection.concat)
  }
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(encoders: { [K in keyof A]: Encoder<A[K] & Record<T, K>> }) => Encoder<A[keyof A]> {
  return (encoders: any) => {
    return {
      encode: (a: any) => encoders[a[tag]].encode(a)
    }
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => Encoder<A>): Encoder<A> {
  const get = S.memoize<void, Encoder<A>>(f)
  return {
    encode: a => get().encode(a)
  }
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const URI = 'Encoder'

/**
 * @since 3.0.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly Encoder: Encoder<A>
  }
}

/**
 * @since 3.0.0
 */
export const encoder: Contravariant1<URI> & S.Schemable<URI> & S.WithRefinement<URI> = {
  URI,
  contramap: (fa, f) => ({
    encode: b => fa.encode(f(b))
  }),
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
  lazy: (_, f) => lazy(f),
  refinement: encoder => encoder
}

const { contramap } = pipeable(encoder)

export {
  /**
   * @since 3.0.0
   */
  contramap
}
