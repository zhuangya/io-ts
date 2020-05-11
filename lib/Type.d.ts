/**
 * @since 2.2.3
 */
import * as t from './index';
import { Literal, Schemable, WithUnion, WithRefinement } from './Schemable';
/**
 * @since 2.2.3
 */
export interface Type<A> extends t.Type<A, unknown> {
}
/**
 * @since 2.2.3
 */
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): Type<A[number]>;
/**
 * @since 2.2.3
 */
export declare const string: Type<string>;
/**
 * @since 2.2.3
 */
export declare const number: Type<number>;
/**
 * @since 2.2.3
 */
export declare const boolean: Type<boolean>;
/**
 * @since 2.2.3
 */
export declare const UnknownArray: Type<Array<unknown>>;
/**
 * @since 2.2.3
 */
export declare const UnknownRecord: Type<Record<string, unknown>>;
/**
 * @since 2.2.3
 */
export declare function refinement<A, B extends A>(from: Type<A>, refinement: (a: A) => a is B, expected: string): Type<B>;
/**
 * @since 2.2.3
 */
export declare function nullable<A>(or: Type<A>): Type<null | A>;
/**
 * @since 2.2.3
 */
export declare function type<A>(properties: {
    [K in keyof A]: Type<A[K]>;
}): Type<A>;
/**
 * @since 2.2.3
 */
export declare function partial<A>(properties: {
    [K in keyof A]: Type<A[K]>;
}): Type<Partial<A>>;
/**
 * @since 2.2.3
 */
export declare function record<A>(codomain: Type<A>): Type<Record<string, A>>;
/**
 * @since 2.2.3
 */
export declare function array<A>(items: Type<A>): Type<Array<A>>;
/**
 * @since 2.2.3
 */
export declare function tuple<A extends ReadonlyArray<unknown>>(...components: {
    [K in keyof A]: Type<A[K]>;
}): Type<A>;
/**
 * @since 2.2.3
 */
export declare function intersection<A, B>(left: Type<A>, right: Type<B>): Type<A & B>;
/**
 * @since 2.2.3
 */
export declare function lazy<A>(id: string, f: () => Type<A>): Type<A>;
/**
 * @since 2.2.3
 */
export declare function sum<T extends string>(_tag: T): <A>(members: {
    [K in keyof A]: Type<A[K] & Record<T, K>>;
}) => Type<A[keyof A]>;
/**
 * @since 2.2.3
 */
export declare function union<A extends ReadonlyArray<unknown>>(...members: {
    [K in keyof A]: Type<A[K]>;
}): Type<A[number]>;
/**
 * @since 2.2.3
 */
export declare const URI = "Type";
/**
 * @since 2.2.3
 */
export declare type URI = typeof URI;
declare module 'fp-ts/lib/HKT' {
    interface URItoKind<A> {
        readonly Type: Type<A>;
    }
}
/**
 * @since 2.2.3
 */
export declare const instance: Schemable<URI> & WithUnion<URI> & WithRefinement<URI>;
