/**
 * @since 3.0.0
 */
import { Alternative1 } from 'fp-ts/lib/Alternative'
import { Applicative1 } from 'fp-ts/lib/Applicative'
import * as E from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { pipeable } from 'fp-ts/lib/pipeable'
import * as DE from './DecodeError'
import * as G from './Guard'
import * as S from './Schemable'
import * as U from './util'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export interface Decoder<A> {
  readonly decode: (u: unknown) => E.Either<DE.DecodeError, A>
}

/**
 * @since 3.0.0
 */
export type TypeOf<D> = D extends Decoder<infer A> ? A : never

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function fromGuard<A>(guard: G.Guard<A>, expected: string): Decoder<A> {
  return {
    decode: E.fromPredicate(guard.is, u => DE.leaf(expected, u))
  }
}

/**
 * @since 3.0.0
 */
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): Decoder<A> {
  return fromGuard(G.literals(values), values.map(U.showLiteral).join(' | '))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal, B>(values: NonEmptyArray<A>, decoder: Decoder<B>): Decoder<A | B> {
  return union([literals(values), decoder])
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const never: Decoder<never> = {
  decode: u => E.left(DE.leaf('never', u))
}

/**
 * @since 3.0.0
 */
export const string: Decoder<string> = fromGuard(G.string, 'string')

/**
 * @since 3.0.0
 */
export const number: Decoder<number> = fromGuard(G.number, 'number')

/**
 * @since 3.0.0
 */
export const boolean: Decoder<boolean> = fromGuard(G.boolean, 'boolean')

/**
 * @since 3.0.0
 */
export const UnknownArray: Decoder<Array<unknown>> = fromGuard(G.UnknownArray, 'Array<unknown>')

/**
 * @since 3.0.0
 */
export const UnknownRecord: Decoder<Record<string, unknown>> = fromGuard(G.UnknownRecord, 'Record<string, unknown>')

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function mapLeft<A>(decoder: Decoder<A>, f: (e: DE.DecodeError) => DE.DecodeError): Decoder<A> {
  return {
    decode: flow(decoder.decode, E.mapLeft(f))
  }
}

/**
 * @since 3.0.0
 */
export function withExpected<A>(decoder: Decoder<A>, expected: string): Decoder<A> {
  return mapLeft(decoder, e => ({ ...e, expected }))
}

/**
 * @since 3.0.0
 */
export function parse<A, B>(decoder: Decoder<A>, parser: (a: A) => E.Either<string, B>): Decoder<B> {
  return {
    decode: u => {
      const e = decoder.decode(u)
      if (E.isLeft(e)) {
        return e
      }
      const pe = parser(e.right)
      if (E.isLeft(pe)) {
        return E.left(DE.leaf(pe.left, u))
      }
      return pe
    }
  }
}

/**
 * @since 3.0.0
 */
export function type<A>(decoders: { [K in keyof A]: Decoder<A[K]> }): Decoder<A> {
  return {
    decode: u => {
      const e = UnknownRecord.decode(u)
      if (E.isLeft(e)) {
        return e
      } else {
        const r = e.right
        let a: A = {} as any
        const es: Array<[string, DE.DecodeError]> = []
        for (const k in decoders) {
          const e = decoders[k].decode(r[k])
          if (E.isLeft(e)) {
            es.push([k, e.left])
          } else {
            a[k] = e.right
          }
        }
        return U.isNonEmpty(es) ? E.left(DE.labeled('type', u, es)) : E.right(a)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(decoders: { [K in keyof A]: Decoder<A[K]> }): Decoder<Partial<A>> {
  return {
    decode: u => {
      const e = UnknownRecord.decode(u)
      if (E.isLeft(e)) {
        return e
      } else {
        const r = e.right
        let a: Partial<A> = {}
        const es: Array<[string, DE.DecodeError]> = []
        for (const k in decoders) {
          // don't add missing fields
          if (U.hasOwnProperty(r, k)) {
            const rk = r[k]
            // don't strip undefined fields
            if (rk === undefined) {
              a[k] = undefined
            } else {
              const e = decoders[k].decode(rk)
              if (E.isLeft(e)) {
                es.push([k, e.left])
              } else {
                a[k] = e.right
              }
            }
          }
        }
        return U.isNonEmpty(es) ? E.left(DE.labeled('partial', u, es)) : E.right(a)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function record<A>(decoder: Decoder<A>): Decoder<Record<string, A>> {
  return {
    decode: u => {
      const e = UnknownRecord.decode(u)
      if (E.isLeft(e)) {
        return e
      } else {
        const r = e.right
        let a: Record<string, A> = {}
        const es: Array<[string, DE.DecodeError]> = []
        for (const k in r) {
          const e = decoder.decode(r[k])
          if (E.isLeft(e)) {
            es.push([k, e.left])
          } else {
            a[k] = e.right
          }
        }
        return U.isNonEmpty(es) ? E.left(DE.labeled('record', u, es)) : E.right(a)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(decoder: Decoder<A>): Decoder<Array<A>> {
  return {
    decode: u => {
      const e = UnknownArray.decode(u)
      if (E.isLeft(e)) {
        return e
      } else {
        const us = e.right
        const len = us.length
        const a: Array<A> = new Array(len)
        const es: Array<[number, DE.DecodeError]> = []
        for (let i = 0; i < len; i++) {
          const e = decoder.decode(us[i])
          if (E.isLeft(e)) {
            es.push([i, e.left])
          } else {
            a[i] = e.right
          }
        }
        return U.isNonEmpty(es) ? E.left(DE.indexed('array', u, es)) : E.right(a)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(
  decoders: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>, Decoder<E>]
): Decoder<[A, B, C, D, E]>
export function tuple<A, B, C, D>(decoders: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>]): Decoder<[A, B, C, D]>
export function tuple<A, B, C>(decoders: [Decoder<A>, Decoder<B>, Decoder<C>]): Decoder<[A, B, C]>
export function tuple<A, B>(decoders: [Decoder<A>, Decoder<B>]): Decoder<[A, B]>
export function tuple<A>(decoders: [Decoder<A>]): Decoder<[A]>
export function tuple(decoders: Array<Decoder<unknown>>): Decoder<Array<unknown>> {
  return {
    decode: u => {
      const e = UnknownArray.decode(u)
      if (E.isLeft(e)) {
        return e
      } else {
        const us = e.right
        const len = decoders.length
        const a: Array<unknown> = new Array(len)
        const es: Array<[number, DE.DecodeError]> = []
        for (let i = 0; i < len; i++) {
          const e = decoders[i].decode(us[i])
          if (E.isLeft(e)) {
            es.push([i, e.left])
          } else {
            a[i] = e.right
          }
        }
        return U.isNonEmpty(es) ? E.left(DE.indexed('tuple', u, es)) : E.right(a)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(
  decoders: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>, Decoder<E>]
): Decoder<A & B & C & D & E>
export function intersection<A, B, C, D>(
  decoders: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>]
): Decoder<A & B & C & D>
export function intersection<A, B, C>(decoders: [Decoder<A>, Decoder<B>, Decoder<C>]): Decoder<A & B & C>
export function intersection<A, B>(decoders: [Decoder<A>, Decoder<B>]): Decoder<A & B>
export function intersection(decoders: Array<Decoder<unknown>>): Decoder<unknown> {
  return {
    decode: u => {
      const len = decoders.length
      const as: Array<unknown> = []
      const es: Array<DE.DecodeError> = []
      for (let i = 0; i < len; i++) {
        const e = decoders[i].decode(u)
        if (E.isLeft(e)) {
          es.push(e.left)
        } else {
          as[i] = e.right
        }
      }
      if (U.isNonEmpty(es)) {
        return E.left(DE.and('intersection', u, es))
      }
      return E.right(as.reduce(U.intersection.concat))
    }
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => Decoder<A>): Decoder<A> {
  const get = U.memoize(f)
  return {
    decode: u => get().decode(u)
  }
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(decoders: { [K in keyof A]: Decoder<A[K] & Record<T, K>> }) => Decoder<A[keyof A]> {
  return (decoders: Record<string, Decoder<any>>) => {
    const keys = Object.keys(decoders)
    if (keys.length === 0) {
      return never
    }
    const expected = keys.map(k => JSON.stringify(k)).join(' | ')
    return {
      decode: u => {
        const e = UnknownRecord.decode(u)
        if (E.isLeft(e)) {
          return e
        }
        const v = e.right[tag]
        if (typeof v === 'string' && U.hasOwnProperty(decoders, v)) {
          return decoders[v].decode(u)
        }
        return E.left(DE.labeled('sum', u, [[tag, DE.leaf(expected, v)]]))
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  decoders: { [K in keyof A]: Decoder<A[K]> }
): Decoder<A[number]> {
  return {
    decode: u => {
      const e = decoders[0].decode(u)
      if (E.isRight(e)) {
        return e
      }
      const es: NonEmptyArray<DE.DecodeError> = [e.left]
      for (let i = 1; i < decoders.length; i++) {
        const e = decoders[i].decode(u)
        if (E.isRight(e)) {
          return e
        } else {
          es.push(e.left)
        }
      }
      return E.left(DE.or('union', u, es))
    }
  }
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const URI = 'Decoder'

/**
 * @since 3.0.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly Decoder: Decoder<A>
  }
}

/**
 * @since 3.0.0
 */
export const decoder: Applicative1<URI> &
  Alternative1<URI> &
  S.Schemable<URI> &
  S.WithLazy<URI> &
  S.WithParse<URI> &
  S.WithUnion<URI> = {
  URI,
  map: (fa, f) => ({
    decode: u => E.either.map(fa.decode(u), f)
  }),
  of: a => ({
    decode: () => E.right(a)
  }),
  ap: (fab, fa) => ({
    decode: u => E.either.ap(fab.decode(u), fa.decode(u))
  }),
  alt: (fx, fy) => ({
    decode: u => E.either.alt(fx.decode(u), () => fy().decode(u))
  }),
  zero: () => never,
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
  parse,
  union
}

const { alt, ap, apFirst, apSecond, map } = pipeable(decoder)

export {
  /**
   * @since 3.0.0
   */
  alt,
  /**
   * @since 3.0.0
   */
  ap,
  /**
   * @since 3.0.0
   */
  apFirst,
  /**
   * @since 3.0.0
   */
  apSecond,
  /**
   * @since 3.0.0
   */
  map
}
