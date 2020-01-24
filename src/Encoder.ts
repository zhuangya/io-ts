/**
 * TODO
 * - optimize encode when all encoders are noop
 *
 * @since 3.0.0
 */
import { identity } from 'fp-ts/lib/function'
import * as S from './Schemable'
import { Contravariant1 } from 'fp-ts/lib/Contravariant'

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
export function type<A>(encoders: { [K in keyof A]: Encoder<A[K]> }): Encoder<A> {
  return {
    encode: a => {
      const o: Record<string, unknown> = {}
      for (const k in encoders) {
        o[k] = encoders[k].encode(a[k])
      }
      return o
    }
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(encoders: { [K in keyof A]: Encoder<A[K]> }): Encoder<Partial<A>> {
  return {
    encode: a => {
      const o: Record<string, unknown> = {}
      for (const k in encoders) {
        const v: A[Extract<keyof A, string>] | undefined = a[k]
        if (v !== undefined) {
          o[k] = encoders[k].encode(v)
        }
      }
      return o
    }
  }
}

/**
 * @since 3.0.0
 */
export function record<A>(encoder: Encoder<A>): Encoder<Record<string, A>> {
  return {
    encode: r => {
      const o: Record<string, unknown> = {}
      for (const k in r) {
        o[k] = encoder.encode(r[k])
      }
      return o
    }
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(encoder: Encoder<A>): Encoder<Array<A>> {
  return {
    encode: as => as.map(encoder.encode)
  }
}

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(
  encoders: [Encoder<A>, Encoder<B>, Encoder<C>, Encoder<D>, Encoder<E>]
): Encoder<[A, B, C, D, E]>
export function tuple<A, B, C, D>(encoders: [Encoder<A>, Encoder<B>, Encoder<C>, Encoder<D>]): Encoder<[A, B, C, D]>
export function tuple<A, B, C>(encoders: [Encoder<A>, Encoder<B>, Encoder<C>]): Encoder<[A, B, C]>
export function tuple<A, B>(encoders: [Encoder<A>, Encoder<B>]): Encoder<[A, B]>
export function tuple<A>(encoders: [Encoder<A>]): Encoder<[A]>
export function tuple(encoders: Array<Encoder<unknown>>): Encoder<Array<unknown>> {
  return {
    encode: as => encoders.map((encoder, i) => encoder.encode(as[i]))
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
    encode: a => {
      const us: Array<unknown> = encoders.map(encoder => encoder.encode(a))
      return us.some(u => Object.prototype.toString.call(u) !== '[object Object]')
        ? us[us.length - 1]
        : Object.assign({}, ...us)
    }
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => Encoder<A>): Encoder<A> {
  let memoized: Encoder<A>
  function getMemoized(): Encoder<A> {
    if (!memoized) {
      memoized = f()
    }
    return memoized
  }
  return {
    encode: a => getMemoized().encode(a)
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
export const encoder: Contravariant1<URI> & S.Schemable<URI> = {
  URI,
  contramap: (fa, f) => ({
    encode: b => fa.encode(f(b))
  }),
  literal: () => id,
  keyof: () => id,
  string: id,
  number: id,
  boolean: id,
  undefined: id,
  null: id,
  Int: id,
  refinement: identity as S.Schemable<URI>['refinement'],
  UnknownArray: id,
  UnknownRecord: id,
  type,
  partial,
  record,
  array,
  tuple,
  intersection,
  lazy
}
