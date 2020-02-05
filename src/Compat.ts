/**
 * Missing
 *   - `pipe` method
 *   - `null` primitive
 *   - `undefined` primitive
 *   - `void` primitive
 *   - `unknown` primitive
 * @since 3.0.0
 */
import { Either } from 'fp-ts/lib/Either'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as C from './Codec'
import * as G from './Guard'
import * as D from './Decoder'
import { Literal, Schemable, WithRefinement, WithUnion } from './Schemable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * Laws: same as `Codec`
 *
 * @since 3.0.0
 */
export interface Compat<A> extends C.Codec<A>, G.Guard<A> {
  readonly name: string
}

/**
 * @since 3.0.0
 */
export type TypeOf<C> = C extends Compat<infer A> ? A : never

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function make<A>(
  name: string,
  is: G.Guard<A>['is'],
  decode: C.Codec<A>['decode'],
  encode: C.Codec<A>['encode']
): Compat<A> {
  return {
    name,
    is,
    decode,
    encode
  }
}

/**
 * @since 3.0.0
 */
export function literals<A extends Literal>(
  values: NonEmptyArray<A>,
  name: string = values.map(value => JSON.stringify(value)).join(' | ')
): Compat<A> {
  const codec = C.literals(values)
  return make(name, G.literals(values).is, codec.decode, codec.encode)
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(
  values: NonEmptyArray<A>,
  compat: Compat<B>,
  name?: string
): Compat<A | B> {
  return union([literals(values), compat], name)
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: Compat<string> = make('string', G.string.is, C.string.decode, C.string.encode)

/**
 * @since 3.0.0
 */
export const number: Compat<number> = make('number', G.number.is, C.number.decode, C.number.encode)

/**
 * @since 3.0.0
 */
export const boolean: Compat<boolean> = make('boolean', G.boolean.is, C.boolean.decode, C.boolean.encode)

/**
 * @since 3.0.0
 */
export const UnknownArray: Compat<Array<unknown>> = make(
  'UnknownArray',
  G.UnknownArray.is,
  C.UnknownArray.decode,
  C.UnknownArray.encode
)

/**
 * @since 3.0.0
 */
export const UnknownRecord: Compat<Record<string, unknown>> = make(
  'UnknownRecord',
  G.UnknownRecord.is,
  C.UnknownRecord.decode,
  C.UnknownRecord.encode
)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function refinement<A, B extends A>(
  compat: Compat<A>,
  parser: (a: A) => Either<string, B>,
  name: string
): Compat<B> {
  const codec = C.refinement(compat, parser)
  return make(name, G.refinement(compat, parser).is, codec.decode, codec.encode)
}

const getStructName = (compats: Record<string, Compat<any>>): string =>
  '{ ' +
  Object.keys(compats)
    .map(k => k + ': ' + compats[k].name)
    .join(', ') +
  ' }'

/**
 * @since 3.0.0
 */
export function type<A>(compats: { [K in keyof A]: Compat<A[K]> }, name: string = getStructName(compats)): Compat<A> {
  const codec = C.type(compats)
  return make(name, G.type(compats).is, codec.decode, codec.encode)
}

/**
 * @since 3.0.0
 */
export function partial<A>(
  compats: { [K in keyof A]: Compat<A[K]> },
  name: string = `Partial<${getStructName(compats)}>`
): Compat<Partial<A>> {
  const codec = C.partial(compats)
  return make(name, G.partial(compats).is, codec.decode, codec.encode)
}

/**
 * @since 3.0.0
 */
export function record<A>(
  compat: Compat<A>,
  name: string = `Record<string, ${compat.name}>`
): Compat<Record<string, A>> {
  const codec = C.record(compat)
  return make(name, G.record(compat).is, codec.decode, codec.encode)
}

/**
 * @since 3.0.0
 */
export function array<A>(compat: Compat<A>, name: string = `Array<${compat.name}>`): Compat<Array<A>> {
  const codec = C.array(compat)
  return make(name, G.array(compat).is, codec.decode, codec.encode)
}

const getTupleName = (compats: Array<Compat<any>>, sep: string): string =>
  compats.map((compat: Compat<unknown>) => compat.name).join(sep)

/**
 * @since 3.0.0
 */
export function tuple<A, B, C, D, E>(
  compats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>, Compat<E>],
  name?: string
): Compat<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  compats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>],
  name?: string
): Compat<[A, B, C, D]>
export function tuple<A, B, C>(compats: [Compat<A>, Compat<B>, Compat<C>], name?: string): Compat<[A, B, C]>
export function tuple<A, B>(compats: [Compat<A>, Compat<B>], name?: string): Compat<[A, B]>
export function tuple<A>(compats: [Compat<A>], name?: string): Compat<[A]>
export function tuple(compats: any, name: string = '[' + getTupleName(compats, ', ') + ']'): Compat<any> {
  const codec = C.tuple(compats)
  return make(name, G.tuple(compats).is, codec.decode, codec.encode)
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(
  compats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>, Compat<E>],
  name?: string
): Compat<A & B & C & D & E>
export function intersection<A, B, C, D>(
  compats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>],
  name?: string
): Compat<A & B & C & D>
export function intersection<A, B, C>(compats: [Compat<A>, Compat<B>, Compat<C>], name?: string): Compat<A & B & C>
export function intersection<A, B>(compats: [Compat<A>, Compat<B>], name?: string): Compat<A & B>
export function intersection<A>(compats: any, name: string = getTupleName(compats, ' & ')): Compat<A> {
  const codec = C.intersection<A, A>(compats)
  return make(name, G.intersection<A, A>(compats).is, codec.decode, codec.encode)
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, ...Array<unknown>]>(
  compats: { [K in keyof A]: Compat<A[K]> },
  name: string = getTupleName(compats, ' | ')
): Compat<A[number]> {
  return make(name, G.union(compats).is, D.union(compats).decode, a => {
    for (const compat of compats) {
      if (compat.is(a)) {
        return compat.encode(a)
      }
    }
  })
}

const getSumName = (compats: Record<string, Compat<any>>): string =>
  Object.keys(compats)
    .map(k => compats[k].name)
    .join(' | ')

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  tag: T
): <A>(compats: { [K in keyof A]: Compat<A[K] & Record<T, K>> }, name?: string) => Compat<A[keyof A]> {
  const Csum = C.sum(tag)
  const Gsum = G.sum(tag)
  return (compats, name = getSumName(compats)) => {
    const codec = Csum(compats)
    return make(name, Gsum(compats).is, codec.decode, codec.encode)
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(f: () => Compat<A>): Compat<A> {
  const codec = C.lazy(f)
  return make('TODO', G.lazy(f).is, codec.decode, codec.encode)
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const URI = 'Compat'

/**
 * @since 3.0.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly Compat: Compat<A>
  }
}

/**
 * @since 3.0.0
 */
export const compat: Schemable<URI> & WithRefinement<URI> & WithUnion<URI> = {
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
  refinement: refinement as WithRefinement<URI>['refinement'],
  union
}
