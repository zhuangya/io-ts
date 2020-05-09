/**
 * @since 2.2.3
 */
import * as t from './index';
import { Literal, Schemable, WithUnion } from './Schemable';
/**
 * @since 2.2.3
 */
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): t.Type<A[number]>;
/**
 * @since 2.2.3
 */
export declare const string: t.Type<string>;
/**
 * @since 2.2.3
 */
export declare const number: t.Type<number>;
/**
 * @since 2.2.3
 */
export declare const boolean: t.Type<boolean>;
/**
 * @since 2.2.3
 */
export declare const UnknownArray: t.Type<Array<unknown>>;
/**
 * @since 2.2.3
 */
export declare const UnknownRecord: t.Type<Record<string, unknown>>;
/**
 * @since 2.2.3
 */
export declare function nullable<A>(or: t.Type<A>): t.Type<null | A>;
/**
 * @since 2.2.3
 */
export declare function type<A>(properties: {
    [K in keyof A]: t.Type<A[K]>;
}): t.Type<A>;
/**
 * @since 2.2.3
 */
export declare function partial<A>(properties: {
    [K in keyof A]: t.Type<A[K]>;
}): t.Type<Partial<A>>;
/**
 * @since 2.2.3
 */
export declare function record<A>(codomain: t.Type<A>): t.Type<Record<string, A>>;
/**
 * @since 2.2.3
 */
export declare function array<A>(items: t.Type<A>): t.Type<Array<A>>;
/**
 * @since 2.2.3
 */
export declare function tuple<A extends ReadonlyArray<unknown>>(...components: {
    [K in keyof A]: t.Type<A[K]>;
}): t.Type<A>;
/**
 * @since 2.2.3
 */
export declare function intersection<A, B>(left: t.Type<A>, right: t.Type<B>): t.Type<A & B>;
/**
 * @since 2.2.3
 */
export declare function lazy<A>(id: string, f: () => t.Type<A>): t.Type<A>;
/**
 * @since 2.2.3
 */
export declare function sum<T extends string>(_tag: T): <A>(members: {
    [K in keyof A]: t.Type<A[K] & Record<T, K>>;
}) => t.Type<A[keyof A]>;
/**
 * @since 2.2.3
 */
export declare function union<A extends ReadonlyArray<unknown>>(...members: {
    [K in keyof A]: t.Type<A[K]>;
}): t.Type<A[number]>;
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
        readonly Type: t.Type<A>;
    }
}
/**
 * @since 2.2.3
 */
export declare const instance: Schemable<URI> & WithUnion<URI>;
