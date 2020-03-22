/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const'
import * as R from 'fp-ts/lib/Record'
import { JSONSchema7 } from 'json-schema'
import { Literal } from './Literal'
import * as S from './Schemable'
import { ReadonlyNonEmptyArray } from './util'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export interface JsonSchema<A> {
  readonly compile: (lazy: boolean) => C.Const<JSONSchema7, A>
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
export function literals<A extends Literal>(values: ReadonlyNonEmptyArray<A>): JsonSchema<A> {
  return {
    compile: () => C.make({ enum: [...values] })
  }
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(
  values: ReadonlyNonEmptyArray<A>,
  or: JsonSchema<B>
): JsonSchema<A | B> {
  return {
    compile: lazy => C.make({ anyOf: [{ enum: [...values] }, or.compile(lazy)] })
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
    compile: lazy =>
      C.make({
        type: 'object',
        properties: R.record.map<JsonSchema<unknown>, JSONSchema7>(properties, p => p.compile(lazy)),
        required: Object.keys(properties)
      })
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(properties: { [K in keyof A]: JsonSchema<A[K]> }): JsonSchema<Partial<A>> {
  return {
    compile: lazy =>
      C.make({
        type: 'object',
        properties: R.record.map<JsonSchema<unknown>, JSONSchema7>(properties, p => p.compile(lazy))
      })
  }
}

/**
 * @since 3.0.0
 */
export function record<A>(codomain: JsonSchema<A>): JsonSchema<Record<string, A>> {
  return {
    compile: lazy =>
      C.make({
        type: 'object',
        additionalProperties: codomain.compile(lazy)
      })
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(items: JsonSchema<A>): JsonSchema<Array<A>> {
  return {
    compile: lazy =>
      C.make({
        type: 'array',
        items: items.compile(lazy)
      })
  }
}

/**
 * @since 3.0.0
 */
export function tuple<A extends ReadonlyArray<unknown>>(
  ...components: { [K in keyof A]: JsonSchema<A[K]> }
): JsonSchema<A> {
  const len = components.length
  return {
    compile: lazy =>
      C.make({
        type: 'array',
        items: len > 0 ? components.map(c => c.compile(lazy)) : undefined,
        minItems: len,
        maxItems: len
      })
  }
}

/**
 * @since 3.0.0
 */
export function intersection<A, B>(left: JsonSchema<A>, right: JsonSchema<B>): JsonSchema<A & B> {
  return {
    compile: lazy => C.make({ allOf: [left.compile(lazy), right.compile(lazy)] })
  }
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  _tag: T
): <A>(members: { [K in keyof A]: JsonSchema<A[K] & Record<T, K>> }) => JsonSchema<A[keyof A]> {
  return (members: Record<string, JsonSchema<unknown>>) => {
    return {
      compile: lazy => C.make({ anyOf: Object.keys(members).map(k => members[k].compile(lazy)) })
    }
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(id: string, f: () => JsonSchema<A>): JsonSchema<A> {
  // TODO: support mutually recursive json schemas
  const $ref = `#/definitions/${id}`
  return {
    compile: lazy => {
      if (lazy) {
        return C.make({ $ref })
      }
      return C.make({
        $id: $ref,
        definitions: {
          [id]: f().compile(true)
        },
        $ref
      })
    }
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends ReadonlyArray<unknown>>(
  ...members: { [K in keyof A]: JsonSchema<A[K]> }
): JsonSchema<A[number]> {
  return {
    compile: lazy => C.make({ anyOf: members.map(jsonSchema => jsonSchema.compile(lazy)) })
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
  tuple: tuple as S.Schemable<URI>['tuple'],
  intersection,
  sum,
  lazy,
  union
}
