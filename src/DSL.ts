/**
 * @since 3.0.0
 */
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as S from './Schemable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export type Expression =
  | {
      readonly _tag: 'literals'
      readonly values: NonEmptyArray<S.Literal>
    }
  | {
      readonly _tag: 'literalsOr'
      readonly values: NonEmptyArray<S.Literal>
      readonly model: Expression
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
      readonly models: Record<string, Expression>
    }
  | {
      readonly _tag: 'partial'
      readonly models: Record<string, Expression>
    }
  | {
      readonly _tag: 'record'
      readonly model: Expression
    }
  | {
      readonly _tag: 'array'
      readonly model: Expression
    }
  | {
      readonly _tag: 'tuple'
      readonly models: NonEmptyArray<Expression>
    }
  | {
      readonly _tag: 'intersection'
      readonly models: NonEmptyArray<Expression>
    }
  | {
      readonly _tag: 'sum'
      readonly tag: string
      readonly models: Record<string, Expression>
    }
  | {
      readonly _tag: 'union'
      readonly models: NonEmptyArray<Expression>
    }
  | {
      readonly _tag: 'lazy'
      readonly model: Expression
    }
  | {
      readonly _tag: '$ref'
      readonly id: string
    }

/**
 * @since 3.0.0
 */
export interface Declaration {
  readonly id: string
  readonly model: Expression
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function $ref(id: string): Expression {
  return { _tag: '$ref', id }
}

/**
 * @since 3.0.0
 */
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): Expression {
  return { _tag: 'literals', values }
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal>(values: NonEmptyArray<A>, model: Expression): Expression {
  return { _tag: 'literalsOr', values, model }
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Expression = { _tag: 'string' }

/**
 * @since 3.0.0
 */
export const number: Expression = { _tag: 'number' }

/**
 * @since 3.0.0
 */
export const boolean: Expression = { _tag: 'boolean' }

/**
 * @since 3.0.0
 */
export const UnknownArray: Expression = { _tag: 'UnknownArray' }

/**
 * @since 3.0.0
 */
export const UnknownRecord: Expression = { _tag: 'UnknownRecord' }

/**
 * @since 3.0.0
 */
export function type(models: Record<string, Expression>): Expression {
  return { _tag: 'type', models }
}

/**
 * @since 3.0.0
 */
export function partial(models: Record<string, Expression>): Expression {
  return { _tag: 'partial', models }
}

/**
 * @since 3.0.0
 */
export function record(model: Expression): Expression {
  return { _tag: 'record', model }
}

/**
 * @since 3.0.0
 */
export function array(model: Expression): Expression {
  return { _tag: 'array', model }
}

/**
 * @since 3.0.0
 */
export function tuple(models: NonEmptyArray<Expression>): Expression {
  return { _tag: 'tuple', models }
}

/**
 * @since 3.0.0
 */
export function intersection(models: NonEmptyArray<Expression>): Expression {
  return {
    _tag: 'intersection',
    models
  }
}

/**
 * @since 3.0.0
 */
export function sum(tag: string, models: Record<string, Expression>): Expression {
  return { _tag: 'sum', tag, models }
}

/**
 * @since 3.0.0
 */
export function union(models: NonEmptyArray<Expression>): Expression {
  return { _tag: 'union', models }
}

/**
 * @since 3.0.0
 */
export function lazy(model: Expression): Expression {
  return { _tag: 'lazy', model }
}

/**
 * @since 3.0.0
 */
export function declaration(id: string, model: Expression): Declaration {
  return { id, model }
}
