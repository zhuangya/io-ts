/**
 * @since 3.0.0
 */
import * as A from 'fp-ts/lib/Array'
import * as C from 'fp-ts/lib/Const'
import * as E from 'fp-ts/lib/Either'
import { IO, io } from 'fp-ts/lib/IO'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as R from 'fp-ts/lib/Record'
import * as S from './Schemable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export type Model =
  | { readonly _tag: 'literals'; readonly values: NonEmptyArray<S.Literal> }
  | { readonly _tag: 'literalsOr'; readonly values: NonEmptyArray<S.Literal>; readonly model: Model }
  | { readonly _tag: 'string' }
  | { readonly _tag: 'number' }
  | { readonly _tag: 'boolean' }
  | { readonly _tag: 'UnknownArray' }
  | { readonly _tag: 'UnknownRecord' }
  | { readonly _tag: 'Int' }
  | { readonly _tag: 'parse'; readonly model: Model; readonly parser: (a: any) => E.Either<string, unknown> }
  | { readonly _tag: 'type'; readonly models: Record<string, Model> }
  | { readonly _tag: 'partial'; readonly models: Record<string, Model> }
  | { readonly _tag: 'record'; readonly model: Model }
  | { readonly _tag: 'array'; readonly model: Model }
  | { readonly _tag: 'tuple'; readonly models: [Model, ...Array<Model>] }
  | { readonly _tag: 'intersection'; readonly models: [Model, Model, ...Array<Model>] }
  | { readonly _tag: 'sum'; readonly tag: string; readonly models: Record<string, Model> }
  | { readonly _tag: 'union'; readonly models: [Model, Model, ...Array<Model>] }
  | { readonly _tag: 'lazy'; readonly model: Model; readonly id: string }
  | { readonly _tag: '$ref'; readonly id: string }

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
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): DSL<A> {
  return C.make(io.of({ _tag: 'literals', values }))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal, B>(values: NonEmptyArray<A>, dsl: DSL<B>): DSL<A | B> {
  return C.make(() => ({ _tag: 'literalsOr', values, model: dsl() }))
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: DSL<string> = C.make(io.of({ _tag: 'string' }))

/**
 * @since 3.0.0
 */
export const number: DSL<number> = C.make(io.of({ _tag: 'number' }))

/**
 * @since 3.0.0
 */
export const boolean: DSL<boolean> = C.make(io.of({ _tag: 'boolean' }))

/**
 * @since 3.0.0
 */
export const UnknownArray: DSL<Array<unknown>> = C.make(io.of({ _tag: 'UnknownArray' }))

/**
 * @since 3.0.0
 */
export const UnknownRecord: DSL<Record<string, unknown>> = C.make(io.of({ _tag: 'UnknownRecord' }))

/**
 * @since 3.0.0
 */
export const Int: DSL<S.Int> = C.make(io.of({ _tag: 'Int' }))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function parse<A, B>(dsl: DSL<A>, parser: (a: A) => E.Either<string, B>): DSL<B> {
  return C.make(() => ({ _tag: 'parse', model: dsl(), parser }))
}

const sequenceR = R.record.sequence(io)

/**
 * @since 3.0.0
 */
export function type<A>(dsls: { [K in keyof A]: DSL<A[K]> }): DSL<A> {
  return C.make(() => {
    const models: IO<Record<string, Model>> = sequenceR(dsls)
    return { _tag: 'type', models: models() }
  })
}

/**
 * @since 3.0.0
 */
export function partial<A>(dsls: { [K in keyof A]: DSL<A[K]> }): DSL<Partial<A>> {
  return C.make(() => {
    const models: IO<Record<string, Model>> = sequenceR(dsls)
    return { _tag: 'partial', models: models() }
  })
}

/**
 * @since 3.0.0
 */
export function record<A>(dsl: DSL<A>): DSL<Record<string, A>> {
  return C.make(() => ({ _tag: 'record', model: dsl() }))
}

/**
 * @since 3.0.0
 */
export function array<A>(dsl: DSL<A>): DSL<Array<A>> {
  return C.make(() => ({ _tag: 'array', model: dsl() }))
}

const sequenceA = A.array.sequence(io)

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>, DSL<E>]): DSL<[A, B, C, D, E]>
export function tuple<A, B, C, D>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>]): DSL<[A, B, C, D]>
export function tuple<A, B, C>(dsls: [DSL<A>, DSL<B>, DSL<C>]): DSL<[A, B, C]>
export function tuple<A, B>(dsls: [DSL<A>, DSL<B>]): DSL<[A, B]>
export function tuple<A>(dsls: [DSL<A>]): DSL<[A]>
export function tuple(dsls: Array<DSL<any>>): DSL<any> {
  return C.make(() => {
    const models: IO<[Model, ...Array<Model>]> = sequenceA(dsls) as any
    return { _tag: 'tuple', models: models() }
  })
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>, DSL<E>]): DSL<A & B & C & D & E>
export function intersection<A, B, C, D>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>]): DSL<A & B & C & D>
export function intersection<A, B, C>(dsls: [DSL<A>, DSL<B>, DSL<C>]): DSL<A & B & C>
export function intersection<A, B>(dsls: [DSL<A>, DSL<B>]): DSL<A & B>
export function intersection(dsls: Array<DSL<any>>): DSL<any> {
  return C.make(() => {
    const models: IO<[Model, Model, ...Array<Model>]> = sequenceA(dsls) as any
    return { _tag: 'intersection', models: models() }
  })
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(dsls: { [K in keyof A]: DSL<A[K] & Record<T, K>> }) => DSL<A[keyof A]> {
  return dsls =>
    C.make(() => {
      const models: IO<Record<string, Model>> = sequenceR(dsls)
      return { _tag: 'sum', tag, models: models() }
    })
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  dsls: { [K in keyof A]: DSL<A[K]> }
): DSL<A[number]> {
  return C.make(() => {
    const models: IO<[Model, Model, ...Array<Model>]> = sequenceA(dsls) as any
    return { _tag: 'union', models: models() }
  })
}

let refCounter = 0

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => DSL<A>): DSL<A> {
  let id: string
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
export const dsl: S.Schemable<URI> & S.WithInt<URI> & S.WithLazy<URI> & S.WithParse<URI> & S.WithUnion<URI> = {
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
  Int,
  lazy,
  parse,
  union
}
