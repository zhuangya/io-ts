/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const'
import * as R from 'fp-ts/lib/Record'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { JSONSchema7 } from 'json-schema'
import * as S from './Schemable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export interface JsonSchema<A> {
  readonly compile: () => C.Const<JSONSchema7, A>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function literal<A extends S.Literal>(value: A): JsonSchema<A> {
  return literals([value])
}

/**
 * @since 3.0.0
 */
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): JsonSchema<A> {
  return {
    compile: () => C.make({ enum: values })
  }
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal, B>(
  values: NonEmptyArray<A>,
  jsonSchema: JsonSchema<B>
): JsonSchema<A | B> {
  return {
    compile: () =>
      C.make({
        anyOf: [{ enum: values }, jsonSchema.compile()]
      })
  }
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: JsonSchema<string> = {
  compile: () => C.make({ type: 'string' })
}

/**
 * @since 3.0.0
 */
export const number: JsonSchema<number> = {
  compile: () => C.make({ type: 'number' })
}

/**
 * @since 3.0.0
 */
export const boolean: JsonSchema<boolean> = {
  compile: () => C.make({ type: 'boolean' })
}

/**
 * @since 3.0.0
 */
export const UnknownArray: JsonSchema<Array<unknown>> = {
  compile: () => C.make({ type: 'array' })
}

/**
 * @since 3.0.0
 */
export const UnknownRecord: JsonSchema<Record<string, unknown>> = {
  compile: () => C.make({ type: 'object' })
}

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function type<A>(properties: { [K in keyof A]: JsonSchema<A[K]> }): JsonSchema<A> {
  return {
    compile: () =>
      C.make({
        type: 'object',
        properties: R.record.map<JsonSchema<unknown>, JSONSchema7>(properties, p => p.compile()),
        required: Object.keys(properties)
      })
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(properties: { [K in keyof A]: JsonSchema<A[K]> }): JsonSchema<Partial<A>> {
  return {
    compile: () =>
      C.make({
        type: 'object',
        properties: R.record.map<JsonSchema<unknown>, JSONSchema7>(properties, p => p.compile())
      })
  }
}

/**
 * @since 3.0.0
 */
export function record<A>(codomain: JsonSchema<A>): JsonSchema<Record<string, A>> {
  return {
    compile: () =>
      C.make({
        type: 'object',
        additionalProperties: codomain.compile()
      })
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(items: JsonSchema<A>): JsonSchema<Array<A>> {
  return {
    compile: () =>
      C.make({
        type: 'array',
        items: items.compile()
      })
  }
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
  return {
    compile: () =>
      C.make({
        type: 'array',
        items: items.map(jsonSchema => jsonSchema.compile()),
        minItems: len,
        maxItems: len
      })
  }
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
  return {
    compile: () => C.make({ allOf: jsonSchemas.map(jsonSchema => jsonSchema.compile()) })
  }
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  _tag: T
): <A>(jsonSchemas: { [K in keyof A]: JsonSchema<A[K] & Record<T, K>> }) => JsonSchema<A[keyof A]> {
  return (jsonSchemas: Record<string, JsonSchema<unknown>>) => {
    return {
      compile: () => C.make({ oneOf: Object.keys(jsonSchemas).map(k => jsonSchemas[k].compile()) })
    }
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(id: string, f: () => JsonSchema<A>): JsonSchema<A> {
  let $ref: string
  return {
    compile: () => {
      if (!$ref) {
        $ref = `#/definitions/${id}`
        return C.make({
          $id: $ref,
          definitions: {
            [id]: f().compile()
          },
          $ref
        })
      }
      return C.make({ $ref })
    }
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, ...Array<unknown>]>(
  jsonSchemas: { [K in keyof A]: JsonSchema<A[K]> }
): JsonSchema<A[number]> {
  return {
    compile: () => C.make({ oneOf: jsonSchemas.map(jsonSchema => jsonSchema.compile()) })
  }
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
