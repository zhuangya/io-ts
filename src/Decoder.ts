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
import { pipe } from 'fp-ts/lib/pipeable'
import * as DE from './DecodeError'
import * as G from './Guard'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export interface Decoder<A> {
  readonly name: string
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
export function fromGuard<A>(name: string, guard: G.Guard<A>): Decoder<A> {
  return {
    name,
    decode: E.fromPredicate(guard.is, u => DE.decodeError(name, u))
  }
}

/**
 * @since 3.0.0
 */
export function literal<A extends string | number | boolean>(literal: A): Decoder<A> {
  return fromGuard(JSON.stringify(literal), G.literal(literal))
}

/**
 * @since 3.0.0
 */
export function keyof<A>(keys: Record<keyof A, unknown>): Decoder<keyof A> {
  const name = Object.keys(keys)
    .map(k => JSON.stringify(k))
    .join(' | ')
  return fromGuard(name, G.keyof(keys))
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Decoder<string> = fromGuard('string', G.string)

/**
 * @since 3.0.0
 */
export const number: Decoder<number> = fromGuard('number', G.number)

/**
 * @since 3.0.0
 */
export const boolean: Decoder<boolean> = fromGuard('boolean', G.boolean)

const _undefined: Decoder<undefined> = fromGuard('undefined', G.undefined)

const _null: Decoder<null> = fromGuard('null', G.null)

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
export const UnknownArray: Decoder<Array<unknown>> = fromGuard('Array<unknown>', G.UnknownArray)

/**
 * @since 3.0.0
 */
export const UnknownRecord: Decoder<Record<string, unknown>> = fromGuard('Record<string, unknown>', G.UnknownRecord)

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
export const Int: Decoder<Int> = fromGuard('Int', G.Int)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function withName<A>(decoder: Decoder<A>, name: string): Decoder<A> {
  return {
    name: decoder.name,
    decode: u =>
      pipe(
        decoder.decode(u),
        E.mapLeft(e => ({ ...e, expected: name }))
      )
  }
}

/**
 * @since 3.0.0
 */
export function withMessage<A>(
  decoder: Decoder<A>,
  onError: (input: unknown, e: DE.DecodeError) => string
): Decoder<A> {
  return {
    name: decoder.name,
    decode: u =>
      pipe(
        decoder.decode(u),
        E.mapLeft(e => ({ ...e, message: onError(u, e) }))
      )
  }
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
    name,
    decode: u => {
      const e = decoder.decode(u)
      return E.isLeft(e) ? e : fromPredicate(e.right)
    }
  }
}

const getStructNames = (decoders: Record<string, Decoder<any>>): string =>
  Object.keys(decoders)
    .map(k => `${k}: ${decoders[k].name}`)
    .join(', ')

const getTupleNames = (decoders: Array<Decoder<any>>, sep: string): string =>
  decoders.map(decoder => decoder.name).join(sep)

/**
 * @since 3.0.0
 */
export function type<A>(decoders: { [K in keyof A]: Decoder<A[K]> }): Decoder<A> {
  const name = `{ ${getStructNames(decoders)} }`
  return {
    name,
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
        return DE.isNonEmpty(es) ? E.left(DE.decodeError(name, u, DE.labeledProduct(es))) : E.right(a)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(decoders: { [K in keyof A]: Decoder<A[K]> }): Decoder<Partial<A>> {
  const name = `Partial<{ ${getStructNames(decoders)} }>`
  return {
    name,
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
        return DE.isNonEmpty(es) ? E.left(DE.decodeError(name, u, DE.labeledProduct(es))) : E.right(a)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function record<A>(decoder: Decoder<A>): Decoder<Record<string, A>> {
  const name = `Record<string, ${decoder.name}>`
  return {
    name,
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
        return DE.isNonEmpty(es) ? E.left(DE.decodeError(name, u, DE.labeledProduct(es))) : E.right(a)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(decoder: Decoder<A>): Decoder<Array<A>> {
  const name = `Array<${decoder.name}>`
  return {
    name,
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
        return DE.isNonEmpty(es) ? E.left(DE.decodeError(name, us, DE.indexedProduct(es))) : E.right(a)
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
  const name = `[${getTupleNames(decoders, ', ')}]`
  return {
    name,
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
        return DE.isNonEmpty(es) ? E.left(DE.decodeError(name, us, DE.indexedProduct(es))) : E.right(a)
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
  const name = `(${getTupleNames(decoders, ' & ')})`
  return {
    name,
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
      return DE.isNonEmpty(es) ? E.left(DE.decodeError(name, u, DE.and(es))) : E.right(a)
    }
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  decoders: { [K in keyof A]: Decoder<A[K]> }
): Decoder<A[number]> {
  const name = `(${getTupleNames(decoders, ' | ')})`
  return {
    name,
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
      return E.left(DE.decodeError(name, u, DE.or(es as any)))
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
        name,
        decode: flow(
          decode,
          E.mapLeft(e => ({ ...e, expected: name }))
        )
      }
    }
    return memoized
  }
  return {
    name,
    decode: u => getMemoized().decode(u)
  }
}
