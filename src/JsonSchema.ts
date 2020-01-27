/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const'
import * as S from './Schemable'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as E from 'fp-ts/lib/Either'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export interface JsonSchema<A> extends C.Const<unknown, A> {}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export declare function constants<A>(as: NonEmptyArray<A>): JsonSchema<A>

/**
 * @since 3.0.0
 */
export declare function constantsOr<A, B>(as: NonEmptyArray<A>, jsonSchema: JsonSchema<B>): JsonSchema<A | B>

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: JsonSchema<string> = C.make({ type: 'string' })

/**
 * @since 3.0.0
 */
export const number: JsonSchema<number> = C.make({ type: 'number' })

/**
 * @since 3.0.0
 */
export const boolean: JsonSchema<boolean> = C.make({ type: 'boolean' })

/**
 * @since 3.0.0
 */
export const UnknownArray: JsonSchema<Array<unknown>> = C.make({ type: 'array' })

/**
 * @since 3.0.0
 */
export const UnknownRecord: JsonSchema<Record<string, unknown>> = C.make({ type: 'object' })

/**
 * @since 3.0.0
 */
export const Int: JsonSchema<S.Int> = C.make({ type: 'string' })

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export declare function parse<A, B>(jsonSchema: JsonSchema<A>, parser: (a: A) => E.Either<string, B>): JsonSchema<B>

/**
 * @since 3.0.0
 */
export declare function type<A>(jsonSchemas: { [K in keyof A]: JsonSchema<A[K]> }): JsonSchema<A>

/**
 * @since 3.0.0
 */
export declare function partial<A>(jsonSchemas: { [K in keyof A]: JsonSchema<A[K]> }): JsonSchema<Partial<A>>

/**
 * @since 3.0.0
 */
export declare function record<A>(jsonSchema: JsonSchema<A>): JsonSchema<Record<string, A>>

/**
 * @since 3.0.0
 */
export declare function array<A>(jsonSchema: JsonSchema<A>): JsonSchema<Array<A>>

/**
 * @since 3.0.0
 */
export declare function tuple<A, B, C, D, E>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<[A, B, C, D, E]>
export declare function tuple<A, B, C, D>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<[A, B, C, D]>
export declare function tuple<A, B, C>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]
): JsonSchema<[A, B, C]>
export declare function tuple<A, B>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<[A, B]>
export declare function tuple<A>(jsonSchemas: [JsonSchema<A>]): JsonSchema<[A]>

/**
 * @since 3.0.0
 */
export declare function intersection<A, B, C, D, E>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<A & B & C & D & E>
export declare function intersection<A, B, C, D>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<A & B & C & D>
export declare function intersection<A, B, C>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]
): JsonSchema<A & B & C>
export declare function intersection<A, B>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<A & B>

/**
 * @since 3.0.0
 */
export declare function lazy<A>(f: () => JsonSchema<A>): JsonSchema<A>

/**
 * @since 3.0.0
 */
export declare function sum<T extends string>(
  tag: T
): <A>(def: { [K in keyof A]: JsonSchema<A[K] & Record<T, K>> }) => JsonSchema<A[keyof A]>

/**
 * @since 3.0.0
 */
export declare function union<A extends Array<unknown>>(
  jsonSchemas: { [K in keyof A]: JsonSchema<A[K]> }
): JsonSchema<A[number]>

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const URI = 'JsonSchema'

/**
 * @since 3.0.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly JsonSchema: JsonSchema<A>
  }
}

/**
 * @since 3.0.0
 */
export const jsonSchema: S.Schemable<URI> & S.WithUnion<URI> = {
  URI,
  constants,
  constantsOr,
  string,
  number,
  boolean,
  Int,
  parse: parse as S.Schemable<URI>['parse'],
  UnknownArray,
  UnknownRecord,
  type,
  partial,
  record,
  array,
  tuple,
  intersection,
  lazy,
  sum,
  union
}
