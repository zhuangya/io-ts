/**
 * @since 3.0.0
 */
import * as fc from 'fast-check';
import { Literal } from './Literal';
import * as S from './Schemable';
/**
 * @since 3.0.0
 */
export interface Arbitrary<A> extends fc.Arbitrary<A> {
}
/**
 * @since 3.0.0
 */
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): Arbitrary<A[number]>;
/**
 * @since 3.0.0
 */
export declare const string: Arbitrary<string>;
/**
 * @since 3.0.0
 */
export declare const number: Arbitrary<number>;
/**
 * @since 3.0.0
 */
export declare const boolean: Arbitrary<boolean>;
/**
 * @since 3.0.0
 */
export declare const UnknownArray: Arbitrary<Array<unknown>>;
/**
 * @since 3.0.0
 */
export declare const UnknownRecord: Arbitrary<Record<string, unknown>>;
/**
 * @since 3.0.0
 */
export declare function nullable<A>(or: Arbitrary<A>): Arbitrary<null | A>;
/**
 * @since 3.0.0
 */
export declare function type<A>(properties: {
    [K in keyof A]: Arbitrary<A[K]>;
}): Arbitrary<A>;
/**
 * @since 3.0.0
 */
export declare function partial<A>(properties: {
    [K in keyof A]: Arbitrary<A[K]>;
}): Arbitrary<Partial<A>>;
/**
 * @since 3.0.0
 */
export declare function record<A>(codomain: Arbitrary<A>): Arbitrary<Record<string, A>>;
/**
 * @since 3.0.0
 */
export declare function array<A>(items: Arbitrary<A>): Arbitrary<Array<A>>;
/**
 * @since 3.0.0
 */
export declare function tuple<A extends ReadonlyArray<unknown>>(...components: {
    [K in keyof A]: Arbitrary<A[K]>;
}): Arbitrary<A>;
/**
 * @since 3.0.0
 */
export declare function intersection<A, B>(left: Arbitrary<A>, right: Arbitrary<B>): Arbitrary<A & B>;
/**
 * @since 3.0.0
 */
export declare function sum<T extends string>(_tag: T): <A>(members: {
    [K in keyof A]: Arbitrary<A[K] & Record<T, K>>;
}) => Arbitrary<A[keyof A]>;
/**
 * @since 3.0.0
 */
export declare function lazy<A>(f: () => Arbitrary<A>): Arbitrary<A>;
/**
 * @since 3.0.0
 */
export declare function union<A extends ReadonlyArray<unknown>>(...members: {
    [K in keyof A]: Arbitrary<A[K]>;
}): Arbitrary<A[number]>;
/**
 * @since 3.0.0
 */
export declare const URI = "Arbitrary";
/**
 * @since 3.0.0
 */
export declare type URI = typeof URI;
declare module 'fp-ts/es6/HKT' {
    interface URItoKind<A> {
        readonly Arbitrary: Arbitrary<A>;
    }
}
/**
 * @since 3.0.0
 */
export declare const arbitrary: S.Schemable<URI> & S.WithUnion<URI>;
