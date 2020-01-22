/**
 * FAQ
 * - is it possible to provide a custom message?
 *   - yes, use `withMessage`
 * - how to change a field? (for example snake case to camel case)
 *   - mapping
 *
 * Open problems:
 * - is it possible to optimize unions (sum types)?
 *
 * Open questions:
 * - is it possible to define a Semigroup for DecodeError?
 * - is it possible to handle `enum`s?
 * - is it possible to define a Decoder which fails with additional fields?
 * - is it possible to get only the first error?
 * - readonly?
 *
 * @since 3.0.0
 */
import * as E from 'fp-ts/lib/Either'
import { flow, Refinement } from 'fp-ts/lib/function'
import * as DE from './DecodeError'
import * as G from './Guard'

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
export type Decoding<D> = D extends Decoder<infer A> ? A : never

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function fromGuard<A>(guard: G.Guard<A>, expected: string): Decoder<A> {
  return {
    decode: E.fromPredicate(guard.is, u => DE.decodeError(expected, u))
  }
}

/**
 * @since 3.0.0
 */
export function literal<A extends string | number | boolean>(literal: A): Decoder<A> {
  return fromGuard(G.literal(literal), JSON.stringify(literal))
}

/**
 * @since 3.0.0
 */
export function keyof<A>(keys: Record<keyof A, unknown>): Decoder<keyof A> {
  const expected = Object.keys(keys)
    .map(k => JSON.stringify(k))
    .join(' | ')
  return fromGuard(G.keyof(keys), expected)
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

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

const _undefined: Decoder<undefined> = fromGuard(G.undefined, 'undefined')

const _null: Decoder<null> = fromGuard(G.null, 'null')

export {
  /**
   * @since 3.0.0
   */
  _undefined as undefined,
  /**
   * @since 3.0.0
   */
  _null as null
}

/**
 * @since 3.0.0
 */
export const UnknownArray: Decoder<Array<unknown>> = fromGuard(G.UnknownArray, 'Array<unknown>')

/**
 * @since 3.0.0
 */
export const UnknownRecord: Decoder<Record<string, unknown>> = fromGuard(G.UnknownRecord, 'Record<string, unknown>')

/**
 * @since 3.0.0
 */
export type IntBrand = G.IntBrand

/**
 * @since 3.0.0
 */
export type Int = G.Int

/**
 * @since 3.0.0
 */
export const Int: Decoder<Int> = fromGuard(G.Int, 'Int')

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

function mapLeft<A>(decoder: Decoder<A>, f: (e: DE.DecodeError) => DE.DecodeError): Decoder<A> {
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
export function withMessage<A>(decoder: Decoder<A>, onError: (e: DE.DecodeError) => string): Decoder<A> {
  return mapLeft(decoder, e => ({ ...e, message: onError(e) }))
}

/**
 * @since 3.0.0
 */
export function refinement<A, B extends A>(
  decoder: Decoder<A>,
  refinement: Refinement<A, B>,
  name: string
): Decoder<B> {
  const fromPredicate = E.fromPredicate(refinement, a => DE.decodeError(name, a))
  return {
    decode: u => {
      const e = decoder.decode(u)
      return E.isLeft(e) ? e : fromPredicate(e.right)
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
        return DE.isNonEmpty(es) ? E.left(DE.decodeError('type', u, DE.labeledProduct(es))) : E.right(a)
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
          if (r[k] !== undefined) {
            const e = decoders[k].decode(r[k])
            if (E.isLeft(e)) {
              es.push([k, e.left])
            } else {
              a[k] = e.right
            }
          }
        }
        return DE.isNonEmpty(es) ? E.left(DE.decodeError('partial', u, DE.labeledProduct(es))) : E.right(a)
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
        return DE.isNonEmpty(es) ? E.left(DE.decodeError('record', u, DE.labeledProduct(es))) : E.right(a)
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
        return DE.isNonEmpty(es) ? E.left(DE.decodeError('array', us, DE.indexedProduct(es))) : E.right(a)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function tuple<A extends [unknown, unknown, ...Array<unknown>]>(
  decoders: { [K in keyof A]: Decoder<A[K]> }
): Decoder<A> {
  return {
    decode: u => {
      const e = UnknownArray.decode(u)
      if (E.isLeft(e)) {
        return e
      } else {
        const us = e.right
        const len = decoders.length
        const a: A = new Array(len) as any
        const es: Array<[number, DE.DecodeError]> = []
        for (let i = 0; i < len; i++) {
          const e = decoders[i].decode(us[i])
          if (E.isLeft(e)) {
            es.push([i, e.left])
          } else {
            a[i] = e.right
          }
        }
        return DE.isNonEmpty(es) ? E.left(DE.decodeError('tuple', us, DE.indexedProduct(es))) : E.right(a)
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
export function intersection<A>(decoders: Array<Decoder<A>>): Decoder<A> {
  return {
    decode: u => {
      const as: Array<A> = []
      const es: Array<DE.DecodeError> = []
      for (let i = 0; i < decoders.length; i++) {
        const e = decoders[i].decode(u)
        if (E.isLeft(e)) {
          es.push(e.left)
        } else {
          as[i] = e.right
        }
      }
      const a: A = as.some(a => Object.prototype.toString.call(a) !== '[object Object]')
        ? as[as.length - 1]
        : Object.assign({}, ...as)
      return DE.isNonEmpty(es) ? E.left(DE.decodeError('intersection', u, DE.and(es))) : E.right(a)
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
      const es: Array<DE.DecodeError> = []
      for (let i = 0; i < decoders.length; i++) {
        const e = decoders[i].decode(u)
        if (E.isLeft(e)) {
          es.push(e.left)
        } else {
          return e
        }
      }
      return E.left(DE.decodeError('union', u, DE.or(es as any)))
    }
  }
}

/**
 * @since 3.0.0
 */
export function recursive<A>(name: string, f: () => Decoder<A>): Decoder<A> {
  let memoized: Decoder<A>
  function getMemoized(): Decoder<A> {
    if (!memoized) {
      const { decode } = f()
      memoized = {
        decode: flow(
          decode,
          E.mapLeft(e => ({ ...e, expected: name }))
        )
      }
    }
    return memoized
  }
  return {
    decode: u => getMemoized().decode(u)
  }
}
