/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as R from 'fp-ts/lib/Record'
import { Literal } from './Literal'
import * as S from './Schemable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export type Model =
  | {
      readonly _tag: 'literal'
      readonly value: Literal
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'literals'
      readonly values: NonEmptyArray<Literal>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'literalsOr'
      readonly values: NonEmptyArray<Literal>
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
      readonly properties: Record<string, Model>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'partial'
      readonly properties: Record<string, Model>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'record'
      readonly codomain: Model
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'array'
      readonly items: Model
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'tuple2'
      readonly items: [Model, Model]
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'tuple3'
      readonly items: [Model, Model, Model]
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'intersection'
      readonly models: [Model, Model]
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
      readonly id: string
      readonly model: Model
    }
  | {
      readonly _tag: '$ref'
      readonly id: string
    }

/**
 * @since 3.0.0
 */
export interface Declaration<A> {
  readonly id: string
  readonly dsl: DSL<A>
}

/**
 * @since 3.0.0
 */
export function declaration<A>(id: string, dsl: DSL<A>): Declaration<A> {
  return { id, dsl }
}

/**
 * @since 3.0.0
 */
export interface DSL<A> {
  readonly dsl: () => C.Const<Model, A>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function $ref(id: string): DSL<unknown> {
  return {
    dsl: () => C.make({ _tag: '$ref', id })
  }
}

/**
 * @since 3.0.0
 */
export function literal<A extends Literal>(value: A, id?: string): DSL<A> {
  return {
    dsl: () =>
      C.make({
        _tag: 'literal',
        value,
        id
      })
  }
}

/**
 * @since 3.0.0
 */
export function literals<A extends Literal>(values: NonEmptyArray<A>, id?: string): DSL<A> {
  return {
    dsl: () =>
      C.make({
        _tag: 'literals',
        values,
        id
      })
  }
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(values: NonEmptyArray<A>, dsl: DSL<B>, id?: string): DSL<A | B> {
  return {
    dsl: () =>
      C.make({
        _tag: 'literalsOr',
        values,
        model: dsl.dsl(),
        id
      })
  }
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: DSL<string> = {
  dsl: () => C.make({ _tag: 'string' })
}

/**
 * @since 3.0.0
 */
export const number: DSL<number> = {
  dsl: () => C.make({ _tag: 'number' })
}

/**
 * @since 3.0.0
 */
export const boolean: DSL<boolean> = {
  dsl: () => C.make({ _tag: 'boolean' })
}

/**
 * @since 3.0.0
 */
export const UnknownArray: DSL<Array<unknown>> = {
  dsl: () => C.make({ _tag: 'UnknownArray' })
}

/**
 * @since 3.0.0
 */
export const UnknownRecord: DSL<Record<string, unknown>> = {
  dsl: () => C.make({ _tag: 'UnknownRecord' })
}

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function type<A>(properties: { [K in keyof A]: DSL<A[K]> }, id?: string): DSL<A> {
  return {
    dsl: () =>
      C.make({
        _tag: 'type',
        properties: R.record.map<DSL<unknown>, Model>(properties, p => p.dsl()),
        id
      })
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(properties: { [K in keyof A]: DSL<A[K]> }, id?: string): DSL<Partial<A>> {
  return {
    dsl: () =>
      C.make({
        _tag: 'partial',
        properties: R.record.map<DSL<unknown>, Model>(properties, p => p.dsl()),
        id
      })
  }
}

/**
 * @since 3.0.0
 */
export function record<A>(codomain: DSL<A>, id?: string): DSL<Record<string, A>> {
  return {
    dsl: () =>
      C.make({
        _tag: 'record',
        codomain: codomain.dsl(),
        id
      })
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(items: DSL<A>, id?: string): DSL<Array<A>> {
  return {
    dsl: () =>
      C.make({
        _tag: 'array',
        items: items.dsl(),
        id
      })
  }
}

/**
 * @since 3.0.0
 */
export function tuple2<A, B>(itemA: DSL<A>, itemB: DSL<B>, id?: string): DSL<[A, B]> {
  return {
    dsl: () =>
      C.make({
        _tag: 'tuple2',
        items: [itemA.dsl(), itemB.dsl()],
        id
      })
  }
}

/**
 * @since 3.0.0
 */
export function tuple3<A, B, C>(itemA: DSL<A>, itemB: DSL<B>, itemC: DSL<C>, id?: string): DSL<[A, B, C]> {
  return {
    dsl: () =>
      C.make({
        _tag: 'tuple3',
        items: [itemA.dsl(), itemB.dsl(), itemC.dsl()],
        id
      })
  }
}

/**
 * @since 3.0.0
 */
export function intersection<A, B>(dslA: DSL<A>, dslB: DSL<B>, id?: string): DSL<A & B> {
  return {
    dsl: () =>
      C.make({
        _tag: 'intersection',
        models: [dslA.dsl(), dslB.dsl()],
        id
      })
  }
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(dsls: { [K in keyof A]: DSL<A[K] & Record<T, K>> }, id?: string) => DSL<A[keyof A]> {
  return (dsls, id) => {
    return {
      dsl: () =>
        C.make({
          _tag: 'sum',
          tag,
          models: R.record.map<DSL<unknown>, Model>(dsls, p => p.dsl()),
          id
        })
    }
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(id: string, f: () => DSL<A>): DSL<A> {
  let $ref: string
  return {
    dsl: () => {
      if (!$ref) {
        $ref = id
        return C.make({
          _tag: 'lazy',
          id,
          model: f().dsl()
        })
      }
      return C.make({ _tag: '$ref', id })
    }
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, ...Array<unknown>]>(
  dsls: { [K in keyof A]: DSL<A[K]> },
  id?: string
): DSL<A[number]> {
  return {
    dsl: () =>
      C.make({
        _tag: 'union',
        models: dsls.map(dsl => dsl.dsl()) as any,
        id
      })
  }
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
  union
}
