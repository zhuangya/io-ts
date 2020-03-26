/**
 * Breaking changes:
 * - remove `brand` combinator
 * - rename `recursive` to `lazy`
 * - intersections support two arguments
 *
 * FAQ
 * - is it possible to provide a custom message?
 *   - `withExpected` (already existing codecs)
 * - how to change a field? (for example snake case to camel case)
 *   - `imap`
 *
 * Open questions:
 * - is it possible to handle `enum`s?
 * - is it possible to define a Decoder which fails on additional properties?
 * - readonly support?
 *
 * Schemas:
 * - Schemable<URI>
 *   - Eq
 *   - Encoder
 *   - Codec
 * - Schemable<URI> & WithUnion<URI>
 *   - Arbitrary
 *   - ArbitraryMutation
 *   - Compat
 *   - Decoder
 *   - Guard
 *   - Expression
 *   - JsonSchema
 *   - TypeNode
 *
 * @since 3.0.0
 */
import { Invariant1 } from 'fp-ts/es6/Invariant';
import { NonEmptyArray } from 'fp-ts/es6/NonEmptyArray';
import * as T from 'fp-ts/es6/Tree';
import * as D from './Decoder';
import * as E from './Encoder';
import { Literal } from './Literal';
import * as S from './Schemable';
/**
 * Laws:
 *
 * 1. `pipe(codec.decode(u), E.fold(() => u, codec.encode) = u` for all `u` in `unknown`
 * 2. `codec.decode(codec.encode(a)) = E.right(a)` for all `a` in `A`
 *
 * @since 3.0.0
 */
export interface Codec<A> extends D.Decoder<A>, E.Encoder<A> {
}
/**
 * @since 3.0.0
 */
export declare function make<A>(decoder: D.Decoder<A>, encoder: E.Encoder<A>): Codec<A>;
/**
 * @since 3.0.0
 */
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): Codec<A[number]>;
/**
 * @since 3.0.0
 */
export declare const string: Codec<string>;
/**
 * @since 3.0.0
 */
export declare const number: Codec<number>;
/**
 * @since 3.0.0
 */
export declare const boolean: Codec<boolean>;
/**
 * @since 3.0.0
 */
export declare const UnknownArray: Codec<Array<unknown>>;
/**
 * @since 3.0.0
 */
export declare const UnknownRecord: Codec<Record<string, unknown>>;
/**
 * @since 3.0.0
 */
export declare function withExpected<A>(codec: Codec<A>, expected: (actual: unknown, nea: NonEmptyArray<T.Tree<string>>) => NonEmptyArray<T.Tree<string>>): Codec<A>;
/**
 * @since 3.0.0
 */
export declare function refinement<A, B extends A>(from: Codec<A>, refinement: (a: A) => a is B, expected: string): Codec<B>;
/**
 * @since 3.0.0
 */
export declare function nullable<A>(or: Codec<A>): Codec<null | A>;
/**
 * @since 3.0.0
 */
export declare function type<A>(properties: {
    [K in keyof A]: Codec<A[K]>;
}): Codec<A>;
/**
 * @since 3.0.0
 */
export declare function partial<A>(properties: {
    [K in keyof A]: Codec<A[K]>;
}): Codec<Partial<A>>;
/**
 * @since 3.0.0
 */
export declare function record<A>(codomain: Codec<A>): Codec<Record<string, A>>;
/**
 * @since 3.0.0
 */
export declare function array<A>(items: Codec<A>): Codec<Array<A>>;
/**
 * @since 3.0.0
 */
export declare function tuple<A extends ReadonlyArray<unknown>>(...components: {
    [K in keyof A]: Codec<A[K]>;
}): Codec<A>;
/**
 * @since 3.0.0
 */
export declare function intersection<A, B>(left: Codec<A>, right: Codec<B>): Codec<A & B>;
/**
 * @since 3.0.0
 */
export declare function sum<T extends string>(tag: T): <A>(members: {
    [K in keyof A]: Codec<A[K] & Record<T, K>>;
}) => Codec<A[keyof A]>;
/**
 * @since 3.0.0
 */
export declare function lazy<A>(id: string, f: () => Codec<A>): Codec<A>;
/**
 * @since 3.0.0
 */
export declare const URI = "Codec";
/**
 * @since 3.0.0
 */
export declare type URI = typeof URI;
declare module 'fp-ts/es6/HKT' {
    interface URItoKind<A> {
        readonly Codec: Codec<A>;
    }
}
/**
 * @since 3.0.0
 */
export declare const codec: Invariant1<URI> & S.Schemable<URI>;
