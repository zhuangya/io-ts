/**
 * @since 3.0.0
 */
import { Alternative1 } from 'fp-ts/lib/Alternative'
import { Applicative1 } from 'fp-ts/lib/Applicative'
import * as E from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import { pipeable } from 'fp-ts/lib/pipeable'
import * as DE from './DecodeError'
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
export function fromGuard<A>(guard: G.Guard<A>, id?: string, message?: (u: unknown) => string): Decoder<A> {
  return {
    decode: E.fromPredicate(guard.is, u => DE.leaf(u, id, message ? message(u) : undefined))
  }
}

/**
 * @since 3.0.0
 */
export function literal<A extends Literal>(value: A, id?: string): Decoder<A> {
  const expected = id ? id : JSON.stringify(value)
  return fromGuard(G.literal(value), id, u => `Cannot decode ${JSON.stringify(u)}, expected ${expected}`)
}

/**
 * @since 3.0.0
 */
export function literals<A extends Literal>(values: readonly [A, ...Array<A>], id?: string): Decoder<A> {
  const expected = id ? id : values.map(value => JSON.stringify(value)).join(' | ')
  return fromGuard(G.literals(values), id, u => `Cannot decode ${JSON.stringify(u)}, expected ${expected}`)
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(
  values: readonly [A, ...Array<A>],
  or: Decoder<B>,
  id?: string
): Decoder<A | B> {
  return union([literals(values), or], id)
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const never: Decoder<never> = {
  decode: u => E.left(DE.leaf(u, 'never'))
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
export function withMessage<A>(decoder: Decoder<A>, message: (e: DE.DecodeError) => string): Decoder<A> {
  return mapLeft(decoder, e => ({ ...e, message: message(e) }))
}

/**
 * @since 3.0.0
 */
export function parse<A, B>(from: Decoder<A>, parser: (a: A) => E.Either<string, B>, id?: string): Decoder<B> {
  return {
    decode: u => {
      const e = from.decode(u)
      if (E.isLeft(e)) {
        return e
      }
      const pe = parser(e.right)
      if (E.isLeft(pe)) {
        return E.left(DE.leaf(u, id, pe.left))
      }
      return pe
    }
  }
}

/**
 * @since 3.0.0
 */
export function type<A>(properties: { [K in keyof A]: Decoder<A[K]> }, id?: string): Decoder<A> {
  return {
    decode: u => {
      const e = UnknownRecord.decode(u)
      if (E.isLeft(e)) {
        return e
      } else {
        const r = e.right
        let a: Partial<A> = {}
        const es: Array<[string, DE.DecodeError]> = []
        for (const k in properties) {
          const e = properties[k].decode(r[k])
          if (E.isLeft(e)) {
            es.push([k, e.left])
          } else {
            a[k] = e.right
          }
        }
        return U.isNonEmpty(es) ? E.left(DE.labeled(u, es, id)) : E.right(a as any)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(properties: { [K in keyof A]: Decoder<A[K]> }, id?: string): Decoder<Partial<A>> {
  return {
    decode: u => {
      const e = UnknownRecord.decode(u)
      if (E.isLeft(e)) {
        return e
      } else {
        const r = e.right
        let a: Partial<A> = {}
        const es: Array<[string, DE.DecodeError]> = []
        for (const k in properties) {
          // don't add missing properties
          if (U.hasOwnProperty(r, k)) {
            const rk = r[k]
            // don't strip undefined properties
            if (rk === undefined) {
              a[k] = undefined
            } else {
              const e = properties[k].decode(rk)
              if (E.isLeft(e)) {
                es.push([k, e.left])
              } else {
                a[k] = e.right
              }
            }
          }
        }
        return U.isNonEmpty(es) ? E.left(DE.labeled(u, es, id)) : E.right(a)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function record<A>(codomain: Decoder<A>, id?: string): Decoder<Record<string, A>> {
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
          const e = codomain.decode(r[k])
          if (E.isLeft(e)) {
            es.push([k, e.left])
          } else {
            a[k] = e.right
          }
        }
        return U.isNonEmpty(es) ? E.left(DE.labeled(u, es, id)) : E.right(a)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(items: Decoder<A>, id?: string): Decoder<Array<A>> {
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
          const e = items.decode(us[i])
          if (E.isLeft(e)) {
            es.push([i, e.left])
          } else {
            a[i] = e.right
          }
        }
        return U.isNonEmpty(es) ? E.left(DE.indexed(u, es, id)) : E.right(a)
      }
    }
  }
}

function tupleN<T extends Array<Decoder<any>>>(
  items: T & { readonly 0: Decoder<any> },
  id?: string
): Decoder<{ [K in keyof T]: [T[K]] extends [Decoder<infer A>] ? A : never }> {
  return {
    decode: u => {
      const e = UnknownArray.decode(u)
      if (E.isLeft(e)) {
        return e
      } else {
        const us = e.right
        const len = items.length
        const a: Array<unknown> = new Array(len)
        const es: Array<[number, DE.DecodeError]> = []
        for (let i = 0; i < len; i++) {
          const e = items[i].decode(us[i])
          if (E.isLeft(e)) {
            es.push([i, e.left])
          } else {
            a[i] = e.right
          }
        }
        return U.isNonEmpty(es) ? E.left(DE.indexed(u, es, id)) : E.right(a as any)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function tuple2<A, B>(itemA: Decoder<A>, itemB: Decoder<B>, id?: string): Decoder<[A, B]> {
  return tupleN([itemA, itemB], id)
}

/**
 * @since 3.0.0
 */
export function tuple3<A, B, C>(
  itemA: Decoder<A>,
  itemB: Decoder<B>,
  itemC: Decoder<C>,
  id?: string
): Decoder<[A, B, C]> {
  return tupleN([itemA, itemB, itemC], id)
}

/**
 * @since 3.0.0
 */
export function intersection<A, B>(left: Decoder<A>, right: Decoder<B>, id?: string): Decoder<A & B> {
  return {
    decode: u => {
      const ea = left.decode(u)
      const eb = right.decode(u)
      if (E.isLeft(ea)) {
        if (E.isLeft(eb)) {
          return E.left(DE.and(u, [ea.left, eb.left], id))
        }
        return E.left(DE.and(u, [ea.left], id))
      } else {
        if (E.isLeft(eb)) {
          return E.left(DE.and(u, [eb.left], id))
        }
        return E.right(U.intersect(ea.right, eb.right))
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(id: string, f: () => Decoder<A>): Decoder<A> {
  const get = S.memoize<void, Decoder<A>>(f)
  return mapLeft(
    {
      decode: u => get().decode(u)
    },
    e => ({ ...e, id })
  )
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(members: { [K in keyof A]: Decoder<A[K] & Record<T, K>> }, id?: string) => Decoder<A[keyof A]> {
  return (members, id?: string) => {
    const keys = Object.keys(members)
    if (keys.length === 0) {
      return never
    }
    const message = keys.map(k => JSON.stringify(k)).join(' | ')
    return {
      decode: u => {
        const e = UnknownRecord.decode(u)
        if (E.isLeft(e)) {
          return e
        }
        const v = e.right[tag]
        if (typeof v === 'string' && U.hasOwnProperty(members, v)) {
          return members[v].decode(u)
        }
        return E.left(DE.labeled(u, [[tag, DE.leaf(v, undefined, message)]], id))
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, ...Array<unknown>]>(
  members: { [K in keyof A]: Decoder<A[K]> },
  id?: string
): Decoder<A[number]> {
  return {
    decode: u => {
      const e = members[0].decode(u)
      if (E.isRight(e)) {
        return e
      }
      const es: [DE.DecodeError, ...Array<DE.DecodeError>] = [e.left]
      for (let i = 1; i < members.length; i++) {
        const e = members[i].decode(u)
        if (E.isRight(e)) {
          return e
        } else {
          es.push(e.left)
        }
      }
      return E.left(DE.or(u, es, id))
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
export const decoder: Applicative1<URI> & Alternative1<URI> & S.Schemable<URI> & S.WithUnion<URI> & S.WithParse<URI> = {
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
  refinement: parse,
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
