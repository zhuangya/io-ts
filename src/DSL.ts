/**
 * @since 3.0.0
 */
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as S from './Schemable'

// -------------------------------------------------------------------------------------
// dsl
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export type DSL =
  | {
      readonly _tag: 'literals'
      readonly values: NonEmptyArray<S.Literal>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'literalsOr'
      readonly values: NonEmptyArray<S.Literal>
      readonly dsl: DSL
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
      readonly dsls: Record<string, DSL>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'partial'
      readonly dsls: Record<string, DSL>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'record'
      readonly dsl: DSL
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'array'
      readonly dsl: DSL
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'tuple'
      readonly dsls: NonEmptyArray<DSL>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'intersection'
      readonly dsls: NonEmptyArray<DSL>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'sum'
      readonly tag: string
      readonly dsls: Record<string, DSL>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'union'
      readonly dsls: NonEmptyArray<DSL>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'lazy'
      readonly id: string
      readonly dsl: DSL
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
  readonly dsl: DSL
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function $ref(id: string): DSL {
  return { _tag: '$ref', id }
}

/**
 * @since 3.0.0
 */
export function literals<A extends S.Literal>(values: NonEmptyArray<A>, id?: string): DSL {
  return { _tag: 'literals', values, id }
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal>(values: NonEmptyArray<A>, dsl: DSL, id?: string): DSL {
  return { _tag: 'literalsOr', values, dsl, id }
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: DSL = { _tag: 'string' }

/**
 * @since 3.0.0
 */
export const number: DSL = { _tag: 'number' }

/**
 * @since 3.0.0
 */
export const boolean: DSL = { _tag: 'boolean' }

/**
 * @since 3.0.0
 */
export const UnknownArray: DSL = { _tag: 'UnknownArray' }

/**
 * @since 3.0.0
 */
export const UnknownRecord: DSL = { _tag: 'UnknownRecord' }

/**
 * @since 3.0.0
 */
export function type(dsls: Record<string, DSL>, id?: string): DSL {
  return { _tag: 'type', dsls, id }
}

/**
 * @since 3.0.0
 */
export function partial(dsls: Record<string, DSL>, id?: string): DSL {
  return { _tag: 'partial', dsls, id }
}

/**
 * @since 3.0.0
 */
export function record(dsl: DSL, id?: string): DSL {
  return { _tag: 'record', dsl, id }
}

/**
 * @since 3.0.0
 */
export function array(dsl: DSL, id?: string): DSL {
  return { _tag: 'array', dsl, id }
}

/**
 * @since 3.0.0
 */
export function tuple(dsls: NonEmptyArray<DSL>, id?: string): DSL {
  return { _tag: 'tuple', dsls, id }
}

/**
 * @since 3.0.0
 */
export function intersection(dsls: NonEmptyArray<DSL>, id?: string): DSL {
  return {
    _tag: 'intersection',
    dsls,
    id
  }
}

/**
 * @since 3.0.0
 */
export function sum(tag: string, dsls: Record<string, DSL>, id?: string): DSL {
  return { _tag: 'sum', tag, dsls, id }
}

/**
 * @since 3.0.0
 */
export function union(dsls: NonEmptyArray<DSL>, id?: string): DSL {
  return { _tag: 'union', dsls, id }
}

/**
 * @since 3.0.0
 */
export function lazy(id: string, dsl: DSL): DSL {
  return { _tag: 'lazy', id, dsl }
}

/**
 * @since 3.0.0
 */
export function declaration(id: string, dsl: DSL): Declaration {
  return { id, dsl }
}
