/**
 * @since 3.0.0
 */
import { isNonEmpty } from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as RE from 'fp-ts/lib/ReaderEither'
import * as DE from './DecodeError'

//
// model
//

/**
 * @since 3.0.0
 */
export interface Decoder<A> extends RE.ReaderEither<unknown, DE.DecodeError, A> {}

//
// primitives
//

/**
 * @since 3.0.0
 */
export const string: Decoder<string> = actual =>
  typeof actual === 'string' ? E.right(actual) : E.left(DE.decodeError('string', actual))

/**
 * @since 3.0.0
 */
export const number: Decoder<number> = actual =>
  typeof actual === 'number' ? E.right(actual) : E.left(DE.decodeError('number', actual))

/**
 * @since 3.0.0
 */
export const boolean: Decoder<boolean> = actual =>
  typeof actual === 'boolean' ? E.right(actual) : E.left(DE.decodeError('boolean', actual))

const isUnknownRecord = (actual: unknown): actual is Record<string, unknown> =>
  Object.prototype.toString.call(actual) === '[object Object]'

/**
 * @since 3.0.0
 */
export const UnknownRecord: Decoder<Record<string, unknown>> = actual =>
  isUnknownRecord(actual) ? E.right(actual) : E.left(DE.decodeError('Record<string, unknown>', actual))

/**
 * @since 3.0.0
 */
export const UnknownArray: Decoder<Array<unknown>> = actual =>
  Array.isArray(actual) ? E.right(actual) : E.left(DE.decodeError('Array<unknown>', actual))

/**
 * @since 3.0.0
 */
export function literal<L extends string | number | boolean>(literal: L): Decoder<L> {
  const is = (actual: unknown): actual is L => actual === literal
  return actual => (is(actual) ? E.right(actual) : E.left(DE.decodeError(JSON.stringify(literal), actual)))
}

//
// combinators
//

/**
 * @since 3.0.0
 */
export function type<A>(decoders: { [K in keyof A]: Decoder<A[K]> }): Decoder<A> {
  return u => {
    const e = UnknownRecord(u)
    if (E.isLeft(e)) {
      return e
    } else {
      const r = e.right
      let a: A = {} as any
      const es: Array<[string, DE.DecodeError]> = []
      for (const k in decoders) {
        const e = decoders[k](r[k])
        if (E.isLeft(e)) {
          es.push([k, e.left])
        } else {
          a[k] = e.right
        }
      }
      return isNonEmpty(es) ? E.left(DE.decodeError('object', u, DE.labeledProduct(es))) : E.right(a)
    }
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(decoders: { [K in keyof A]: Decoder<A[K]> }): Decoder<Partial<A>> {
  return u => {
    const e = UnknownRecord(u)
    if (E.isLeft(e)) {
      return e
    } else {
      const r = e.right
      let a: Partial<A> = {}
      const es: Array<[string, DE.DecodeError]> = []
      for (const k in decoders) {
        if (r[k] !== undefined) {
          const e = decoders[k](r[k])
          if (E.isLeft(e)) {
            es.push([k, e.left])
          } else {
            a[k] = e.right
          }
        }
      }
      return isNonEmpty(es) ? E.left(DE.decodeError('partial', u, DE.labeledProduct(es))) : E.right(a)
    }
  }
}

/**
 * @since 3.0.0
 */
export function record<V>(decoder: Decoder<V>): Decoder<Record<string, V>> {
  return u => {
    const e = UnknownRecord(u)
    if (E.isLeft(e)) {
      return e
    } else {
      const r = e.right
      let a: Record<string, V> = {}
      const es: Array<[string, DE.DecodeError]> = []
      for (const k in r) {
        const e = decoder(r[k])
        if (E.isLeft(e)) {
          es.push([k, e.left])
        } else {
          a[k] = e.right
        }
      }
      return isNonEmpty(es) ? E.left(DE.decodeError('record', u, DE.labeledProduct(es))) : E.right(a)
    }
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(decoder: Decoder<A>): Decoder<Array<A>> {
  return u => {
    const e = UnknownArray(u)
    if (E.isLeft(e)) {
      return e
    } else {
      const us = e.right
      const len = us.length
      const a: Array<A> = new Array(len)
      const es: Array<[number, DE.DecodeError]> = []
      for (let i = 0; i < len; i++) {
        const e = decoder(us[i])
        if (E.isLeft(e)) {
          es.push([i, e.left])
        } else {
          a[i] = e.right
        }
      }
      return isNonEmpty(es) ? E.left(DE.decodeError('array', us, DE.indexedProduct(es))) : E.right(a)
    }
  }
}

/**
 * @since 3.0.0
 */
export function tuple<A extends [unknown, ...Array<unknown>]>(decoders: { [K in keyof A]: Decoder<A[K]> }): Decoder<A> {
  return u => {
    const e = UnknownArray(u)
    if (E.isLeft(e)) {
      return e
    } else {
      const us = e.right
      const len = decoders.length
      const a: A = new Array(len) as any
      const es: Array<[number, DE.DecodeError]> = []
      for (let i = 0; i < len; i++) {
        const e = decoders[i](us[i])
        if (E.isLeft(e)) {
          es.push([i, e.left])
        } else {
          a[i] = e.right
        }
      }
      return isNonEmpty(es) ? E.left(DE.decodeError('tuple', us, DE.indexedProduct(es))) : E.right(a)
    }
  }
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

/**
 * @since 3.0.0
 */
export function intersection<A extends [unknown, unknown, ...Array<unknown>]>(
  decoders: { [K in keyof A]: Decoder<A[K]> }
): Decoder<{ [K in keyof UnionToIntersection<A[number]>]: UnionToIntersection<A[number]>[K] }> {
  return u => {
    const as: Array<unknown> = []
    const es: Array<DE.DecodeError> = []
    for (let i = 0; i < decoders.length; i++) {
      const e = decoders[i](u)
      if (E.isLeft(e)) {
        es.push(e.left)
      } else {
        as[i] = e.right
      }
    }
    return isNonEmpty(es) ? E.left(DE.decodeError('intersection', u, DE.and(es))) : E.right(Object.assign({}, ...as))
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  decoders: { [K in keyof A]: Decoder<A[K]> }
): Decoder<A[number]> {
  return u => {
    const es: Array<DE.DecodeError> = []
    for (let i = 0; i < decoders.length; i++) {
      const e = decoders[i](u)
      if (E.isLeft(e)) {
        es.push(e.left)
      } else {
        return e
      }
    }
    return E.left(DE.decodeError('union', u, DE.or(es as any)))
  }
}
