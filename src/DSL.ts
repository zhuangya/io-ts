/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const'
import * as R from 'fp-ts/lib/Record'
import { Literal } from './Literal'
import * as S from './Schemable'
import * as U from './util'

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
      readonly values: U.ReadonlyNonEmptyArray<Literal>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'literalsOr'
      readonly values: U.ReadonlyNonEmptyArray<Literal>
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
      readonly _tag: 'tuple'
      readonly left: Model
      readonly right: Model
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
      readonly models: U.ReadonlyNonEmptyTuple<Model>
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
  readonly dsl: (lazy: boolean) => C.Const<Model, A>
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
export function literals<A extends Literal>(values: U.ReadonlyNonEmptyArray<A>, id?: string): DSL<A> {
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
export function literalsOr<A extends Literal, B>(
  values: U.ReadonlyNonEmptyArray<A>,
  or: DSL<B>,
  id?: string
): DSL<A | B> {
  return {
    dsl: lazy =>
      C.make({
        _tag: 'literalsOr',
        values,
        model: or.dsl(lazy),
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
    dsl: lazy =>
      C.make({
        _tag: 'type',
        properties: R.record.map<DSL<unknown>, Model>(properties, p => p.dsl(lazy)),
        id
      })
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(properties: { [K in keyof A]: DSL<A[K]> }, id?: string): DSL<Partial<A>> {
  return {
    dsl: lazy =>
      C.make({
        _tag: 'partial',
        properties: R.record.map<DSL<unknown>, Model>(properties, p => p.dsl(lazy)),
        id
      })
  }
}

/**
 * @since 3.0.0
 */
export function record<A>(codomain: DSL<A>, id?: string): DSL<Record<string, A>> {
  return {
    dsl: lazy =>
      C.make({
        _tag: 'record',
        codomain: codomain.dsl(lazy),
        id
      })
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(items: DSL<A>, id?: string): DSL<Array<A>> {
  return {
    dsl: lazy =>
      C.make({
        _tag: 'array',
        items: items.dsl(lazy),
        id
      })
  }
}

/**
 * @since 3.0.0
 */
export function tuple<A, B>(left: DSL<A>, right: DSL<B>, id?: string): DSL<[A, B]> {
  return {
    dsl: lazy =>
      C.make({
        _tag: 'tuple',
        left: left.dsl(lazy),
        right: right.dsl(lazy),
        id
      })
  }
}

/**
 * @since 3.0.0
 */
export function intersection<A, B>(left: DSL<A>, right: DSL<B>, id?: string): DSL<A & B> {
  return {
    dsl: lazy =>
      C.make({
        _tag: 'intersection',
        models: [left.dsl(lazy), right.dsl(lazy)],
        id
      })
  }
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(members: { [K in keyof A]: DSL<A[K] & Record<T, K>> }, id?: string) => DSL<A[keyof A]> {
  return (members, id) => {
    return {
      dsl: lazy =>
        C.make({
          _tag: 'sum',
          tag,
          models: R.record.map<DSL<unknown>, Model>(members, p => p.dsl(lazy)),
          id
        })
    }
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(id: string, f: () => DSL<A>): DSL<A> {
  return {
    dsl: lazy => {
      if (lazy) {
        return C.make({ _tag: '$ref', id })
      }
      return C.make({
        _tag: 'lazy',
        id,
        model: f().dsl(true)
      })
    }
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends U.ReadonlyNonEmptyTuple<unknown>>(
  members: { [K in keyof A]: DSL<A[K]> },
  id?: string
): DSL<A[number]> {
  return {
    dsl: lazy =>
      C.make({
        _tag: 'union',
        models: U.map(members, dsl => dsl.dsl(lazy)),
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
  tuple,
  intersection,
  sum,
  lazy,
  union
}
