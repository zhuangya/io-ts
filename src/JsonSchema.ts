/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const'
import * as S from './Schemable'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { IO, io } from 'fp-ts/lib/IO'
import * as R from 'fp-ts/lib/Record'
import * as A from 'fp-ts/lib/Array'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export type Model =
  | { readonly type: 'string' }
  | { readonly type: 'number'; readonly minimum?: number }
  | { readonly type: 'boolean' }
  | { readonly type: 'integer' }
  | {
      readonly type: 'array'
      readonly items?: Model | NonEmptyArray<Model>
      readonly minItems?: number
      readonly maxItems?: number
    }
  | {
      readonly type: 'object'
      readonly properties?: Record<string, Model>
      readonly required?: Array<string>
      readonly additionalProperties?: Model
    }
  | { readonly enum: NonEmptyArray<S.Literal> }
  | { readonly anyOf: [Model, Model, ...Array<Model>] }
  | { readonly allOf: [Model, Model, ...Array<Model>] }
  | { readonly oneOf: [Model, Model, ...Array<Model>] }
  | { readonly $ref: string; readonly $id?: string; readonly definitions?: Record<string, Model> }

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
  if (values.length === 1) {
    return C.make(io.of({ enum: [values[0]] }))
  }
  const anyOf: [Model, Model, ...Array<Model>] = values.map(a => ({ enum: [a] })) as any
  return C.make(
    io.of({
      anyOf
    })
  )
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends S.Literal, B>(
  values: NonEmptyArray<A>,
  jsonSchema: JsonSchema<B>
): JsonSchema<A | B> {
  return C.make(() => ({
    anyOf: [literals(values)(), jsonSchema()]
  }))
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: JsonSchema<string> = C.make(io.of({ type: 'string' }))

/**
 * @since 3.0.0
 */
export const number: JsonSchema<number> = C.make(io.of({ type: 'number' }))

/**
 * @since 3.0.0
 */
export const boolean: JsonSchema<boolean> = C.make(io.of({ type: 'boolean' }))

/**
 * @since 3.0.0
 */
export const UnknownArray: JsonSchema<Array<unknown>> = C.make(io.of({ type: 'array' }))

/**
 * @since 3.0.0
 */
export const UnknownRecord: JsonSchema<Record<string, unknown>> = C.make(io.of({ type: 'object' }))

/**
 * @since 3.0.0
 */
export const Int: JsonSchema<S.Int> = C.make(io.of({ type: 'integer' }))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

const sequenceR = R.record.sequence(io)

/**
 * @since 3.0.0
 */
export function type<A>(jsonSchemas: { [K in keyof A]: JsonSchema<A[K]> }): JsonSchema<A> {
  return C.make(() => {
    const properties: IO<Record<string, Model>> = sequenceR(jsonSchemas)
    return {
      type: 'object',
      properties: properties(),
      required: Object.keys(jsonSchemas)
    }
  })
}

/**
 * @since 3.0.0
 */
export function partial<A>(jsonSchemas: { [K in keyof A]: JsonSchema<A[K]> }): JsonSchema<Partial<A>> {
  return C.make(() => {
    const properties: IO<Record<string, Model>> = sequenceR(jsonSchemas)
    return {
      type: 'object',
      properties: properties()
    }
  })
}

/**
 * @since 3.0.0
 */
export function record<A>(jsonSchema: JsonSchema<A>): JsonSchema<Record<string, A>> {
  return C.make(() => ({
    type: 'object',
    additionalProperties: jsonSchema()
  }))
}

/**
 * @since 3.0.0
 */
export function array<A>(jsonSchema: JsonSchema<A>): JsonSchema<Array<A>> {
  return C.make(() => ({
    type: 'array',
    items: jsonSchema()
  }))
}

const sequenceA = A.array.sequence(io)

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<[A, B, C, D]>
export function tuple<A, B, C>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]): JsonSchema<[A, B, C]>
export function tuple<A, B>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<[A, B]>
export function tuple<A>(jsonSchemas: [JsonSchema<A>]): JsonSchema<[A]>
export function tuple(jsonSchemas: Array<JsonSchema<any>>): JsonSchema<any> {
  const len = jsonSchemas.length
  return C.make(() => {
    const items: IO<NonEmptyArray<Model>> = sequenceA(jsonSchemas) as any
    return {
      type: 'array',
      items: items(),
      minItems: len,
      maxItems: len
    }
  })
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
export function intersection(jsonSchemas: Array<JsonSchema<any>>): JsonSchema<any> {
  return C.make(() => {
    const allOf: IO<[Model, Model, ...Array<Model>]> = sequenceA(jsonSchemas) as any
    return { allOf: allOf() }
  })
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  _tag: T
): <A>(jsonSchemas: { [K in keyof A]: JsonSchema<A[K] & Record<T, K>> }) => JsonSchema<A[keyof A]> {
  return (jsonSchemas: any) =>
    C.make(() => {
      const oneOf: [Model, Model, ...Array<Model>] = Object.keys(jsonSchemas).map((k: any) => jsonSchemas[k]()) as any
      return { oneOf }
    })
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  jsonSchemas: { [K in keyof A]: JsonSchema<A[K]> }
): JsonSchema<A[number]> {
  return C.make(() => {
    const oneOf: IO<[Model, Model, ...Array<Model>]> = sequenceA(jsonSchemas) as any
    return { oneOf: oneOf() }
  })
}

let refCounter = 0

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => JsonSchema<A>): JsonSchema<A> {
  let $ref: string
  return C.make(() => {
    if (!$ref) {
      const id = `$Ref${++refCounter}`
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
export const jsonSchema: S.Schemable<URI> & S.WithInt<URI> & S.WithLazy<URI> & S.WithUnion<URI> = {
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
  union
}
