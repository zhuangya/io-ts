/**
 * @since 3.0.0
 */
import { Literal } from './Literal';
import * as S from './Schemable';
/**
 * @since 3.0.0
 */
export interface Guard<A> {
    is: (u: unknown) => u is A;
}
/**
 * @since 3.0.0
 */
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): Guard<A[number]>;
/**
 * @since 3.0.0
 */
export declare const never: Guard<never>;
/**
 * @since 3.0.0
 */
export declare const string: Guard<string>;
/**
 * @since 3.0.0
 */
export declare const number: Guard<number>;
/**
 * @since 3.0.0
 */
export declare const boolean: Guard<boolean>;
/**
 * @since 3.0.0
 */
export declare const UnknownArray: Guard<Array<unknown>>;
/**
 * @since 3.0.0
 */
export declare const UnknownRecord: Guard<Record<string, unknown>>;
/**
 * @since 3.0.0
 */
export declare function refinement<A, B extends A>(from: Guard<A>, refinement: (a: A) => a is B): Guard<B>;
/**
 * @since 3.0.0
 */
export declare function nullable<A>(or: Guard<A>): Guard<null | A>;
/**
 * @since 3.0.0
 */
export declare function type<A>(properties: {
    [K in keyof A]: Guard<A[K]>;
}): Guard<A>;
/**
 * @since 3.0.0
 */
export declare function partial<A>(properties: {
    [K in keyof A]: Guard<A[K]>;
}): Guard<Partial<A>>;
/**
 * @since 3.0.0
 */
export declare function record<A>(codomain: Guard<A>): Guard<Record<string, A>>;
/**
 * @since 3.0.0
 */
export declare function array<A>(items: Guard<A>): Guard<Array<A>>;
/**
 * @since 3.0.0
 */
export declare function tuple<A extends ReadonlyArray<unknown>>(...components: {
    [K in keyof A]: Guard<A[K]>;
}): Guard<A>;
/**
 * @since 3.0.0
 */
export declare function intersection<A, B>(left: Guard<A>, right: Guard<B>): Guard<A & B>;
/**
 * @since 3.0.0
 */
export declare function union<A extends ReadonlyArray<unknown>>(...members: {
    [K in keyof A]: Guard<A[K]>;
}): Guard<A[number]>;
/**
 * @since 3.0.0
 */
export declare function sum<T extends string>(tag: T): <A>(members: {
    [K in keyof A]: Guard<A[K] & Record<T, K>>;
}) => Guard<A[keyof A]>;
/**
 * @since 3.0.0
 */
export declare function lazy<A>(f: () => Guard<A>): Guard<A>;
/**
 * @since 3.0.0
 */
export declare const URI = "Guard";
/**
 * @since 3.0.0
 */
export declare type URI = typeof URI;
declare module 'fp-ts/es6/HKT' {
    interface URItoKind<A> {
        readonly Guard: Guard<A>;
    }
}
/**
 * @since 3.0.0
 */
export declare const guard: S.Schemable<URI> & S.WithUnion<URI>;
