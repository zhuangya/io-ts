/**
 * @since 3.0.0
 */
import * as fc from 'fast-check';
import { Literal } from './Literal';
import * as S from './Schemable';
/**
 * @since 3.0.0
 */
export interface ArbitraryMutation<A> {
    /** the mutation */
    mutation: fc.Arbitrary<unknown>;
    /** the corresponding valid arbitrary */
    arbitrary: fc.Arbitrary<A>;
}
/**
 * @since 3.0.0
 */
export declare function make<A>(mutation: fc.Arbitrary<unknown>, arbitrary: fc.Arbitrary<A>): ArbitraryMutation<A>;
/**
 * @since 3.0.0
 */
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): ArbitraryMutation<A[number]>;
/**
 * @since 3.0.0
 */
export declare const string: ArbitraryMutation<string>;
/**
 * @since 3.0.0
 */
export declare const number: ArbitraryMutation<number>;
/**
 * @since 3.0.0
 */
export declare const boolean: ArbitraryMutation<boolean>;
/**
 * @since 3.0.0
 */
export declare const UnknownArray: ArbitraryMutation<Array<unknown>>;
/**
 * @since 3.0.0
 */
export declare const UnknownRecord: ArbitraryMutation<Record<string, unknown>>;
/**
 * @since 3.0.0
 */
export declare function nullable<A>(or: ArbitraryMutation<A>): ArbitraryMutation<null | A>;
/**
 * @since 3.0.0
 */
export declare function type<A>(properties: {
    [K in keyof A]: ArbitraryMutation<A[K]>;
}): ArbitraryMutation<A>;
/**
 * @since 3.0.0
 */
export declare function partial<A>(properties: {
    [K in keyof A]: ArbitraryMutation<A[K]>;
}): ArbitraryMutation<Partial<A>>;
/**
 * @since 3.0.0
 */
export declare function record<A>(codomain: ArbitraryMutation<A>): ArbitraryMutation<Record<string, A>>;
/**
 * @since 3.0.0
 */
export declare function array<A>(items: ArbitraryMutation<A>): ArbitraryMutation<Array<A>>;
/**
 * @since 3.0.0
 */
export declare function tuple<A extends ReadonlyArray<unknown>>(...components: {
    [K in keyof A]: ArbitraryMutation<A[K]>;
}): ArbitraryMutation<A>;
/**
 * @since 3.0.0
 */
export declare function intersection<A, B>(left: ArbitraryMutation<A>, right: ArbitraryMutation<B>): ArbitraryMutation<A & B>;
/**
 * @since 3.0.0
 */
export declare function sum<T extends string>(tag: T): <A>(members: {
    [K in keyof A]: ArbitraryMutation<A[K] & Record<T, K>>;
}) => ArbitraryMutation<A[keyof A]>;
/**
 * @since 3.0.0
 */
export declare function lazy<A>(f: () => ArbitraryMutation<A>): ArbitraryMutation<A>;
/**
 * @since 3.0.0
 */
export declare function union<A extends ReadonlyArray<unknown>>(...members: {
    [K in keyof A]: ArbitraryMutation<A[K]>;
}): ArbitraryMutation<A[number]>;
/**
 * @since 3.0.0
 */
export declare const URI = "ArbitraryMutation";
/**
 * @since 3.0.0
 */
export declare type URI = typeof URI;
declare module 'fp-ts/lib/HKT' {
    interface URItoKind<A> {
        readonly ArbitraryMutation: ArbitraryMutation<A>;
    }
}
/**
 * @since 3.0.0
 */
export declare const arbitraryMutation: S.Schemable<URI> & S.WithUnion<URI>;
