/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as R from 'fp-ts/lib/Record'
import { JSONSchema7 } from 'json-schema'
import { Literal } from './Literal'
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
export function literal<A extends Literal>(value: A): JsonSchema<A> {
  return literals([value])
}

/**
 * @since 3.0.0
 */
export function literals<A extends Literal>(values: NonEmptyArray<A>): JsonSchema<A> {
  return {
    compile: () => C.make({ enum: values })
  }
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(
  values: NonEmptyArray<A>,
  jsonSchema: JsonSchema<B>
): JsonSchema<A | B> {
  return {
    compile: () => C.make({ anyOf: [{ enum: values }, jsonSchema.compile()] })
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
export function tuple2<A, B>(itemA: JsonSchema<A>, itemB: JsonSchema<B>): JsonSchema<[A, B]> {
  return {
    compile: () =>
      C.make({
        type: 'array',
        items: [itemA.compile(), itemB.compile()],
        minItems: 2,
        maxItems: 2
      })
  }
}

/**
 * @since 3.0.0
 */
export function tuple3<A, B, C>(
  itemA: JsonSchema<A>,
  itemB: JsonSchema<B>,
  itemC: JsonSchema<C>
): JsonSchema<[A, B, C]> {
  return {
    compile: () =>
      C.make({
        type: 'array',
        items: [itemA.compile(), itemB.compile(), itemC.compile()],
        minItems: 3,
        maxItems: 3
      })
  }
}

/**
 * @since 3.0.0
 */
export function intersection<A, B>(jsonSchemaA: JsonSchema<A>, jsonSchemaB: JsonSchema<B>): JsonSchema<A & B> {
  return {
    compile: () => C.make({ allOf: [jsonSchemaA.compile(), jsonSchemaB.compile()] })
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
  tuple2,
  tuple3,
  intersection,
  sum,
  lazy,
  union
}
