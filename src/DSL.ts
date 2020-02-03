/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const'
import { IO } from 'fp-ts/lib/IO'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as S from './Schemable'
import { runSequence } from './util'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export type Model =
  | {
      readonly _tag: 'literals'
      readonly values: NonEmptyArray<S.Literal>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'literalsOr'
      readonly values: NonEmptyArray<S.Literal>
      readonly model: Model
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'string'
    }
  | {
      readonly _tag: 'number'
    }
  | {
      readonly _tag: 'boolean'
    }
  | {
      readonly _tag: 'UnknownArray'
    }
  | {
      readonly _tag: 'UnknownRecord'
    }
  | {
      readonly _tag: 'type'
      readonly models: Record<string, Model>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'partial'
      readonly models: Record<string, Model>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'record'
      readonly model: Model
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'array'
      readonly model: Model
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'tuple'
      readonly models: NonEmptyArray<Model>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'intersection'
      readonly models: NonEmptyArray<Model>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'sum'
      readonly tag: string
      readonly models: Record<string, Model>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'union'
      readonly models: NonEmptyArray<Model>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'lazy'
      readonly model: Model
      readonly id: string
    }
  | {
      readonly _tag: '$ref'
      readonly id: string
    }

/**
 * @since 3.0.0
 */
export type DSL<A> = C.Const<IO<Model>, A>

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function literals<A extends S.Literal>(values: NonEmptyArray<A>, id?: string): DSL<A> {
  return C.make(() => ({ _tag: 'literals', values, id }))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal, B>(values: NonEmptyArray<A>, dsl: DSL<B>, id?: string): DSL<A | B> {
  return C.make(() => ({ _tag: 'literalsOr', values, model: dsl(), id }))
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: DSL<string> = C.make(() => ({ _tag: 'string' }))

/**
 * @since 3.0.0
 */
export const number: DSL<number> = C.make(() => ({ _tag: 'number' }))

/**
 * @since 3.0.0
 */
export const boolean: DSL<boolean> = C.make(() => ({ _tag: 'boolean' }))

/**
 * @since 3.0.0
 */
export const UnknownArray: DSL<Array<unknown>> = C.make(() => ({ _tag: 'UnknownArray' }))

/**
 * @since 3.0.0
 */
export const UnknownRecord: DSL<Record<string, unknown>> = C.make(() => ({ _tag: 'UnknownRecord' }))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function type<A>(dsls: { [K in keyof A]: DSL<A[K]> }, id?: string): DSL<A> {
  return C.make(() => ({ _tag: 'type', models: runSequence(dsls), id }))
}

/**
 * @since 3.0.0
 */
export function partial<A>(dsls: { [K in keyof A]: DSL<A[K]> }, id?: string): DSL<Partial<A>> {
  return C.make(() => ({ _tag: 'partial', models: runSequence(dsls), id }))
}

/**
 * @since 3.0.0
 */
export function record<A>(dsl: DSL<A>, id?: string): DSL<Record<string, A>> {
  return C.make(() => ({ _tag: 'record', model: dsl(), id }))
}

/**
 * @since 3.0.0
 */
export function array<A>(dsl: DSL<A>, id?: string): DSL<Array<A>> {
  return C.make(() => ({ _tag: 'array', model: dsl(), id }))
}

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>, DSL<E>], id?: string): DSL<[A, B, C, D, E]>
export function tuple<A, B, C, D>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>], id?: string): DSL<[A, B, C, D]>
export function tuple<A, B, C>(dsls: [DSL<A>, DSL<B>, DSL<C>], id?: string): DSL<[A, B, C]>
export function tuple<A, B>(dsls: [DSL<A>, DSL<B>], id?: string): DSL<[A, B]>
export function tuple<A>(dsls: [DSL<A>], id?: string): DSL<[A]>
export function tuple(dsls: NonEmptyArray<DSL<unknown>>, id?: string): DSL<NonEmptyArray<unknown>> {
  return C.make(() => ({ _tag: 'tuple', models: [dsls[0](), ...dsls.slice(1).map(dsl => dsl())], id }))
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(
  dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>, DSL<E>],
  id?: string
): DSL<A & B & C & D & E>
export function intersection<A, B, C, D>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>], id?: string): DSL<A & B & C & D>
export function intersection<A, B, C>(dsls: [DSL<A>, DSL<B>, DSL<C>], id?: string): DSL<A & B & C>
export function intersection<A, B>(dsls: [DSL<A>, DSL<B>], id?: string): DSL<A & B>
export function intersection(dsls: NonEmptyArray<DSL<unknown>>, id?: string): DSL<unknown> {
  return C.make(() => ({
    _tag: 'intersection',
    models: [dsls[0](), dsls[1](), ...dsls.slice(2).map(dsl => dsl())],
    id
  }))
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(dsls: { [K in keyof A]: DSL<A[K] & Record<T, K>> }, id?: string) => DSL<A[keyof A]> {
  return (dsls, id) => C.make(() => ({ _tag: 'sum', tag, models: runSequence(dsls), id }))
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, ...Array<unknown>]>(
  dsls: { [K in keyof A]: DSL<A[K]> },
  id?: string
): DSL<A[number]> {
  return C.make(() => ({ _tag: 'union', models: [dsls[0](), dsls[1](), ...dsls.slice(2).map(dsl => dsl())], id }))
}

let refCounter = 0

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => DSL<A>, id?: string): DSL<A> {
  return C.make(() => {
    if (!id) {
      id = `$Ref${++refCounter}`
      return { _tag: 'lazy', model: f()(), id }
    }
    return { _tag: '$ref', id }
  })
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const URI = 'DSL'

/**
 * @since 3.0.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly DSL: DSL<A>
  }
}

/**
 * @since 3.0.0
 */
export const dsl: S.Schemable<URI> & S.WithUnion<URI> = {
  URI,
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
