/**
 * @since 3.0.0
 */
import { Kind, URIS } from 'fp-ts/lib/HKT'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { Either } from 'fp-ts/lib/Either'

/**
 * @since 3.0.0
 */
export interface IntBrand {
  readonly Int: unique symbol
}

/**
 * @since 3.0.0
 */
export type Int = number & IntBrand

/**
 * @since 3.0.0
 */
export interface Schemable<F extends URIS> {
  readonly URI: F
  readonly constants: <A>(as: NonEmptyArray<A>) => Kind<F, A>
  readonly constantsOr: <A, B>(as: NonEmptyArray<A>, encoder: Kind<F, B>) => Kind<F, A | B>
  readonly string: Kind<F, string>
  readonly number: Kind<F, number>
  readonly boolean: Kind<F, boolean>
  readonly Int: Kind<F, Int>
  readonly parse: <A, B>(decoder: Kind<F, A>, parser: (a: A) => Either<string, B>) => Kind<F, A>
  readonly UnknownArray: Kind<F, Array<unknown>>
  readonly UnknownRecord: Kind<F, Record<string, unknown>>
  readonly type: <A>(schemas: { [K in keyof A]: Kind<F, A[K]> }) => Kind<F, A>
  readonly partial: <A>(schemas: { [K in keyof A]: Kind<F, A[K]> }) => Kind<F, Partial<A>>
  readonly record: <A>(schema: Kind<F, A>) => Kind<F, Record<string, A>>
  readonly array: <A>(schema: Kind<F, A>) => Kind<F, Array<A>>
  readonly tuple: {
    <A, B, C, D, E>(encoders: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>, Kind<F, E>]): Kind<F, [A, B, C, D, E]>
    <A, B, C, D>(encoders: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>]): Kind<F, [A, B, C, D]>
    <A, B, C>(encoders: [Kind<F, A>, Kind<F, B>, Kind<F, C>]): Kind<F, [A, B, C]>
    <A, B>(encoders: [Kind<F, A>, Kind<F, B>]): Kind<F, [A, B]>
    <A>(encoders: [Kind<F, A>]): Kind<F, [A]>
  }
  readonly intersection: {
    <A, B, C, D, E>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>, Kind<F, E>]): Kind<F, A & B & C & D & E>
    <A, B, C, D>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>]): Kind<F, A & B & C & D>
    <A, B, C>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>]): Kind<F, A & B & C>
    <A, B>(schemas: [Kind<F, A>, Kind<F, B>]): Kind<F, A & B>
  }
  readonly lazy: <A>(f: () => Kind<F, A>) => Kind<F, A>
  readonly sum: <T extends string>(
    tag: T
  ) => <A>(def: { [K in keyof A]: Kind<F, A[K] & Record<T, K>> }) => Kind<F, A[keyof A]>
}

/**
 * @since 3.0.0
 */
export interface WithUnion<F extends URIS> {
  readonly union: <A extends [unknown, unknown, ...Array<unknown>]>(
    schemas: { [K in keyof A]: Kind<F, A[K]> }
  ) => Kind<F, A[number]>
}
