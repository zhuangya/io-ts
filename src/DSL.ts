/**
 * @since 3.0.0
 */
import * as A from 'fp-ts/lib/Array'
import * as C from 'fp-ts/lib/Const'
import * as E from 'fp-ts/lib/Either'
import { IO, io, of } from 'fp-ts/lib/IO'
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
  | { _tag: 'literals'; values: NonEmptyArray<S.Literal> }
  | { _tag: 'literalsOr'; values: NonEmptyArray<S.Literal>; model: Model }
  | { _tag: 'string' }
  | { _tag: 'number' }
  | { _tag: 'boolean' }
  | { _tag: 'UnknownArray' }
  | { _tag: 'UnknownRecord' }
  | { _tag: 'Int' }
  | { _tag: 'parse'; model: Model; parser: (a: any) => E.Either<string, unknown> }
  | { _tag: 'type'; models: Record<string, Model> }
  | { _tag: 'partial'; models: Record<string, Model> }
  | { _tag: 'record'; model: Model }
  | { _tag: 'array'; model: Model }
  | { _tag: 'tuple'; models: [Model, ...Array<Model>] }
  | { _tag: 'intersection'; models: [Model, Model, ...Array<Model>] }
  | { _tag: 'sum'; tag: string; models: Record<string, Model> }
  | { _tag: 'union'; models: [Model, Model, ...Array<Model>] }
  | { _tag: 'lazy'; model: Model }
  | { _tag: '$ref'; id: string }

/**
 * @since 3.0.0
 */
export type DSL<A> = C.Const<() => Model, A>

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function make<A>(model: () => Model): DSL<A> {
  return C.make(model)
}

/**
 * @since 3.0.0
 */
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): DSL<A> {
  return make(of({ _tag: 'literals', values }))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal, B>(values: NonEmptyArray<A>, dsl: DSL<B>): DSL<A | B> {
  return make(() => ({ _tag: 'literalsOr', values, model: dsl() }))
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: DSL<string> = make(of({ _tag: 'string' }))

/**
 * @since 3.0.0
 */
export const number: DSL<number> = make(of({ _tag: 'number' }))

/**
 * @since 3.0.0
 */
export const boolean: DSL<boolean> = make(of({ _tag: 'boolean' }))

/**
 * @since 3.0.0
 */
export const UnknownArray: DSL<Array<unknown>> = make(of({ _tag: 'UnknownArray' }))

/**
 * @since 3.0.0
 */
export const UnknownRecord: DSL<Record<string, unknown>> = make(of({ _tag: 'UnknownRecord' }))

/**
 * @since 3.0.0
 */
export const Int: DSL<S.Int> = make(of({ _tag: 'Int' }))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function parse<A, B>(dsl: DSL<A>, parser: (a: A) => E.Either<string, B>): DSL<B> {
  return make(() => ({ _tag: 'parse', model: dsl(), parser }))
}

/**
 * @since 3.0.0
 */
export function type<A>(dsls: { [K in keyof A]: DSL<A[K]> }): DSL<A> {
  return make(() => {
    const models: IO<Record<string, Model>> = R.record.sequence(io)(dsls)
    return { _tag: 'type', models: models() }
  })
}

/**
 * @since 3.0.0
 */
export function partial<A>(dsls: { [K in keyof A]: DSL<A[K]> }): DSL<Partial<A>> {
  return make(() => {
    const models: IO<Record<string, Model>> = R.record.sequence(io)(dsls)
    return { _tag: 'partial', models: models() }
  })
}

/**
 * @since 3.0.0
 */
export function record<A>(dsl: DSL<A>): DSL<Record<string, A>> {
  return make(() => ({ _tag: 'record', model: dsl() }))
}

/**
 * @since 3.0.0
 */
export function array<A>(dsl: DSL<A>): DSL<Array<A>> {
  return make(() => ({ _tag: 'array', model: dsl() }))
}

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>, DSL<E>]): DSL<[A, B, C, D, E]>
export function tuple<A, B, C, D>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>]): DSL<[A, B, C, D]>
export function tuple<A, B, C>(dsls: [DSL<A>, DSL<B>, DSL<C>]): DSL<[A, B, C]>
export function tuple<A, B>(dsls: [DSL<A>, DSL<B>]): DSL<[A, B]>
export function tuple<A>(dsls: [DSL<A>]): DSL<[A]>
export function tuple(dsls: Array<DSL<any>>): DSL<any> {
  return make(() => {
    const models: IO<[Model, ...Array<Model>]> = A.array.sequence(io)(dsls) as any
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
  return make(() => {
    const models: IO<[Model, Model, ...Array<Model>]> = A.array.sequence(io)(dsls) as any
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
    make(() => {
      const models: IO<Record<string, Model>> = R.record.sequence(io)(dsls)
      return { _tag: 'sum', tag, models: models() }
    })
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  dsls: { [K in keyof A]: DSL<A[K]> }
): DSL<A[number]> {
  return make(() => {
    const models: IO<[Model, Model, ...Array<Model>]> = A.array.sequence(io)(dsls) as any
    return { _tag: 'union', models: models() }
  })
}

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => DSL<A>): DSL<A> {
  let counter = 0
  return make(() => {
    if (counter === 0) {
      counter++
      return { _tag: 'lazy', model: f()() }
    }
    return { _tag: '$ref', id: 'id' } // <= FIXME
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
