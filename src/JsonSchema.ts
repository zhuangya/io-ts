/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const'
import { IO } from 'fp-ts/lib/IO'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as J from 'json-schema'
import * as S from './Schemable'
import { runSequence } from './util'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export type Model = J.JSONSchema7

/**
 * @since 3.0.0
 */
export type JsonSchema<A> = C.Const<IO<Model>, A>

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): JsonSchema<A> {
  return C.make(() => ({ enum: values }))
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal, B>(
  values: NonEmptyArray<A>,
  jsonSchema: JsonSchema<B>
): JsonSchema<A | B> {
  return C.make(() => ({
    anyOf: [{ enum: values as any }, jsonSchema()]
  }))
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: JsonSchema<string> = C.make(() => ({ type: 'string' }))

/**
 * @since 3.0.0
 */
export const number: JsonSchema<number> = C.make(() => ({ type: 'number' }))

/**
 * @since 3.0.0
 */
export const boolean: JsonSchema<boolean> = C.make(() => ({ type: 'boolean' }))

/**
 * @since 3.0.0
 */
export const UnknownArray: JsonSchema<Array<unknown>> = C.make(() => ({ type: 'array' }))

/**
 * @since 3.0.0
 */
export const UnknownRecord: JsonSchema<Record<string, unknown>> = C.make(() => ({ type: 'object' }))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function type<A>(properties: { [K in keyof A]: JsonSchema<A[K]> }): JsonSchema<A> {
  return C.make(() => ({
    type: 'object',
    properties: runSequence(properties),
    required: Object.keys(properties)
  }))
}

/**
 * @since 3.0.0
 */
export function partial<A>(properties: { [K in keyof A]: JsonSchema<A[K]> }): JsonSchema<Partial<A>> {
  return C.make(() => ({
    type: 'object',
    properties: runSequence(properties)
  }))
}

/**
 * @since 3.0.0
 */
export function record<A>(codomain: JsonSchema<A>): JsonSchema<Record<string, A>> {
  return C.make(() => ({
    type: 'object',
    additionalProperties: codomain()
  }))
}

/**
 * @since 3.0.0
 */
export function array<A>(items: JsonSchema<A>): JsonSchema<Array<A>> {
  return C.make(() => ({
    type: 'array',
    items: items()
  }))
}

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(
  items: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  items: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<[A, B, C, D]>
export function tuple<A, B, C>(items: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]): JsonSchema<[A, B, C]>
export function tuple<A, B>(items: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<[A, B]>
export function tuple<A>(items: [JsonSchema<A>]): JsonSchema<[A]>
export function tuple(items: Array<JsonSchema<any>>): JsonSchema<Array<any>> {
  const len = items.length
  return C.make(() => ({
    type: 'array',
    items: items.map(jsonSchema => jsonSchema()),
    minItems: len,
    maxItems: len
  }))
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<A & B & C & D & E>
export function intersection<A, B, C, D>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<A & B & C & D>
export function intersection<A, B, C>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]): JsonSchema<A & B & C>
export function intersection<A, B>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<A & B>
export function intersection(jsonSchemas: Array<JsonSchema<any>>): JsonSchema<Array<any>> {
  return C.make(() => ({ allOf: jsonSchemas.map(jsonSchema => jsonSchema()) }))
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  _tag: T
): <A>(jsonSchemas: { [K in keyof A]: JsonSchema<A[K] & Record<T, K>> }) => JsonSchema<A[keyof A]> {
  return (jsonSchemas: any) => C.make(() => ({ oneOf: Object.keys(jsonSchemas).map(k => jsonSchemas[k]()) }))
}

/**
 * @since 3.0.0
 */
export function lazy<A>(id: string, f: () => JsonSchema<A>): JsonSchema<A> {
  let $ref: string
  return C.make(() => {
    if (!$ref) {
      $ref = `#/definitions/${id}`
      return {
        $id: $ref,
        definitions: {
          [id]: f()()
        },
        $ref
      }
    }
    return { $ref }
  })
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, ...Array<unknown>]>(
  jsonSchemas: { [K in keyof A]: JsonSchema<A[K]> }
): JsonSchema<A[number]> {
  return C.make(() => ({ oneOf: jsonSchemas.map(jsonSchema => jsonSchema()) }))
}

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
