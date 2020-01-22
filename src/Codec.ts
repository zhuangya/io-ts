/**
 * Breaking changes:
 * - remove all optional `name` arguments (use `withName` instead)
 * - `refinement`
 *   - `name` is mandatory
 * - remove `brand` combinator
 *
 * @since 3.0.0
 */
import { identity, Refinement } from 'fp-ts/lib/function'
import * as D from './Decoder'
import * as E from './Encoder'
import * as G from './Guard'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export interface Codec<A> extends D.Decoder<A>, E.Encoder<A>, G.Guard<A> {}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function fromGuard<A>(guard: G.Guard<A>, expected: string): Codec<A> {
  return {
    ...D.fromGuard(guard, expected),
    encode: identity,
    ...guard
  }
}

/**
 * @since 3.0.0
 */
export function literal<A extends string | number | boolean>(literal: A): Codec<A> {
  return {
    ...D.literal(literal),
    encode: identity,
    ...G.literal(literal)
  }
}

/**
 * @since 3.0.0
 */
export function keyof<A>(keys: Record<keyof A, unknown>): Codec<keyof A> {
  return {
    ...D.keyof(keys),
    encode: identity,
    ...G.keyof(keys)
  }
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Codec<string> = fromGuard(G.string, 'string')

/**
 * @since 3.0.0
 */
export const number: Codec<number> = fromGuard(G.number, 'number')

/**
 * @since 3.0.0
 */
export const boolean: Codec<boolean> = fromGuard(G.boolean, 'boolean')

const _undefined: Codec<undefined> = fromGuard(G.undefined, 'undefined')

const _null: Codec<null> = fromGuard(G.null, 'null')

export {
  _undefined as undefined,
  /**
   * @since 3.0.0
   */
  _null as null
}

/**
 * @since 3.0.0
 */
export const UnknownArray: Codec<Array<unknown>> = fromGuard(G.UnknownArray, 'Array<unknown>')

/**
 * @since 3.0.0
 */
export const UnknownRecord: Codec<Record<string, unknown>> = fromGuard(G.UnknownRecord, 'Record<string, unknown>')

/**
 * @since 3.0.0
 */
export type Int = D.Int

/**
 * @since 3.0.0
 */
export const Int: Codec<Int> = refinement(number, G.Int.is, 'Int')

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function withExpected<A>(codec: Codec<A>, expected: string): Codec<A> {
  return {
    ...D.withExpected(codec, expected),
    encode: codec.encode,
    is: codec.is
  }
}

/**
 * @since 3.0.0
 */
export function refinement<A, B extends A>(codec: Codec<A>, refinement: Refinement<A, B>, name: string): Codec<B> {
  return {
    ...D.refinement(codec, refinement, name),
    encode: codec.encode,
    ...G.refinement(codec, refinement)
  }
}

/**
 * @since 3.0.0
 */
export function type<A>(codecs: { [K in keyof A]: Codec<A[K]> }): Codec<A> {
  return {
    ...D.type(codecs),
    ...E.type(codecs),
    ...G.type(codecs)
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(codecs: { [K in keyof A]: Codec<A[K]> }): Codec<Partial<A>> {
  return {
    ...D.partial(codecs),
    ...E.partial(codecs),
    ...G.partial(codecs)
  }
}

/**
 * @since 3.0.0
 */
export function record<A>(codec: Codec<A>): Codec<Record<string, A>> {
  return {
    ...D.record(codec),
    ...E.record(codec),
    ...G.record(codec)
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(codec: Codec<A>): Codec<Array<A>> {
  return {
    ...D.array(codec),
    ...E.array(codec),
    ...G.array(codec)
  }
}

/**
 * @since 3.0.0
 */
export function tuple<A extends [unknown, unknown, ...Array<unknown>]>(
  codecs: { [K in keyof A]: Codec<A[K]> }
): Codec<A> {
  return {
    ...D.tuple<A>(codecs),
    ...E.tuple(codecs),
    ...G.tuple<A>(codecs)
  }
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(
  codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>, Codec<E>],
  name?: string
): Codec<A & B & C & D & E>
export function intersection<A, B, C, D>(
  codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>],
  name?: string
): Codec<A & B & C & D>
export function intersection<A, B, C>(codecs: [Codec<A>, Codec<B>, Codec<C>]): Codec<A & B & C>
export function intersection<A, B>(codecs: [Codec<A>, Codec<B>]): Codec<A & B>
export function intersection<A>(codecs: any): Codec<A> {
  return {
    ...D.intersection<A, A>(codecs),
    ...E.intersection(codecs),
    ...G.intersection<A, A>(codecs)
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  codecs: { [K in keyof A]: Codec<A[K]> }
): Codec<A[number]> {
  return {
    ...D.union(codecs),
    encode: a => {
      for (const codec of codecs) {
        if (codec.is(a)) {
          return codec.encode(a)
        }
      }
    },
    ...G.union(codecs)
  }
}

/**
 * @since 3.0.0
 */
export function recursive<A>(name: string, f: () => Codec<A>): Codec<A> {
  return {
    ...D.recursive(name, f),
    ...E.recursive(f),
    ...G.recursive(f)
  }
}
