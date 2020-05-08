/**
 * @since 2.2.3
 */
import * as t from './index'
import { Literal, Schemable, WithUnion } from './Schemable'

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 2.2.3
 */
export function literal<A extends ReadonlyArray<Literal>>(...values: A): t.Type<A[number]> {
  return t.union(values.map((v) => t.literal(v as any)) as any)
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 2.2.3
 */
export const string: t.Type<string> = t.string

/**
 * @since 2.2.3
 */
export const number: t.Type<number> = t.number

/**
 * @since 2.2.3
 */
export const boolean: t.Type<boolean> = t.boolean

/**
 * @since 2.2.3
 */
export const UnknownArray: t.Type<Array<unknown>> = t.UnknownArray

/**
 * @since 2.2.3
 */
export const UnknownRecord: t.Type<Record<string, unknown>> = t.UnknownRecord

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 2.2.3
 */
export function nullable<A>(or: t.Type<A>): t.Type<null | A> {
  return t.union([t.null, or])
}

/**
 * @since 2.2.3
 */
export function type<A>(properties: { [K in keyof A]: t.Type<A[K]> }): t.Type<A> {
  return t.type(properties) as any
}

/**
 * @since 2.2.3
 */
export function partial<A>(properties: { [K in keyof A]: t.Type<A[K]> }): t.Type<Partial<A>> {
  return t.partial(properties)
}

/**
 * @since 2.2.3
 */
export function record<A>(codomain: t.Type<A>): t.Type<Record<string, A>> {
  return t.record(t.string, codomain)
}

/**
 * @since 2.2.3
 */
export function array<A>(items: t.Type<A>): t.Type<Array<A>> {
  return t.array(items)
}

/**
 * @since 2.2.3
 */
export function tuple<A extends ReadonlyArray<unknown>>(...components: { [K in keyof A]: t.Type<A[K]> }): t.Type<A> {
  return t.tuple(components as any) as any
}

/**
 * @since 2.2.3
 */
export function intersection<A, B>(left: t.Type<A>, right: t.Type<B>): t.Type<A & B> {
  return t.intersection([left, right])
}

/**
 * @since 2.2.3
 */
export function lazy<A>(id: string, f: () => t.Type<A>): t.Type<A> {
  return t.recursion(id, f)
}

/**
 * @since 2.2.3
 */
export function sum<T extends string>(
  _tag: T
): <A>(members: { [K in keyof A]: t.Type<A[K] & Record<T, K>> }) => t.Type<A[keyof A]> {
  return (members) => t.union(Object.values(members) as any)
}

/**
 * @since 2.2.3
 */
export function union<A extends ReadonlyArray<unknown>>(
  ...members: { [K in keyof A]: t.Type<A[K]> }
): t.Type<A[number]> {
  return t.union(members as any)
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 2.2.3
 */
export const URI = 'Type'

/**
 * @since 2.2.3
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly Type: t.Type<A>
  }
}

/**
 * @since 2.2.3
 */
export const instance: Schemable<URI> & WithUnion<URI> = {
  URI,
  literal,
  string,
  number,
  boolean,
  UnknownArray,
  UnknownRecord,
  nullable,
  type,
  partial,
  record,
  array,
  tuple: tuple as Schemable<URI>['tuple'],
  intersection,
  sum,
  lazy,
  union
}
