/**
 * @since 3.0.0
 */
import { Contravariant1 } from 'fp-ts/lib/Contravariant'
import { identity } from 'fp-ts/lib/function'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { pipeable } from 'fp-ts/lib/pipeable'
import * as G from './Guard'
import { Literal } from './Literal'
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
export function literalsOr<A extends Literal, B>(as: NonEmptyArray<A>, encoder: Encoder<B>): Encoder<A | B> {
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
export function tuple2<A, B>(itemA: Encoder<A>, itemB: Encoder<B>): Encoder<[A, B]> {
  return {
    encode: as => [itemA.encode(as[0]), itemB.encode(as[1])]
  }
}

/**
 * @since 3.0.0
 */
export function tuple3<A, B, C>(itemA: Encoder<A>, itemB: Encoder<B>, itemC: Encoder<C>): Encoder<[A, B, C]> {
  return {
    encode: as => [itemA.encode(as[0]), itemB.encode(as[1]), itemC.encode(as[2])]
  }
}

/**
 * @since 3.0.0
 */
export function intersection<A, B>(encoderA: Encoder<A>, encoderB: Encoder<B>): Encoder<A & B> {
  return {
    encode: ab => U.intersect(encoderA.encode(ab), encoderB.encode(ab))
  }
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(members: { [K in keyof A]: Encoder<A[K] & Record<T, K>> }) => Encoder<A[keyof A]> {
  return (members: Record<string, Encoder<any>>) => {
    return {
      encode: (a: Record<string, any>) => members[a[tag]].encode(a)
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
  literal: () => id,
  literals: () => id,
  literalsOr,
  string: id,
  number: id,
  boolean: id,
  UnknownArray: id,
  UnknownRecord: id,
  type,
  partial,
  record,
  array,
  tuple2,
  tuple3,
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
