/**
 * Missing
 *   - `pipe` method
 *   - `null` primitive
 *   - `undefined` primitive
 *   - `void` primitive
 *   - `unknown` primitive
 * @since 3.0.0
 */
import * as C from './Codec';
import * as G from './Guard';
import { Literal } from './Literal';
import * as S from './Schemable';
/**
 * Laws: same as `Codec`
 *
 * @since 3.0.0
 */
export interface Compat<A> extends C.Codec<A>, G.Guard<A> {
}
/**
 * @since 3.0.0
 */
export declare function make<A>(codec: C.Codec<A>, guard: G.Guard<A>): Compat<A>;
/**
 * @since 3.0.0
 */
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): Compat<A[number]>;
/**
 * @since 3.0.0
 */
export declare const string: Compat<string>;
/**
 * @since 3.0.0
 */
export declare const number: Compat<number>;
/**
 * @since 3.0.0
 */
export declare const boolean: Compat<boolean>;
/**
 * @since 3.0.0
 */
export declare const UnknownArray: Compat<Array<unknown>>;
/**
 * @since 3.0.0
 */
export declare const UnknownRecord: Compat<Record<string, unknown>>;
/**
 * @since 3.0.0
 */
export declare function refinement<A, B extends A>(from: Compat<A>, refinement: (a: A) => a is B, expected: string): Compat<B>;
/**
 * @since 3.0.0
 */
export declare function nullable<A>(or: Compat<A>): Compat<null | A>;
/**
 * @since 3.0.0
 */
export declare function type<A>(properties: {
    [K in keyof A]: Compat<A[K]>;
}): Compat<A>;
/**
 * @since 3.0.0
 */
export declare function partial<A>(properties: {
    [K in keyof A]: Compat<A[K]>;
}): Compat<Partial<A>>;
/**
 * @since 3.0.0
 */
export declare function record<A>(codomain: Compat<A>): Compat<Record<string, A>>;
/**
 * @since 3.0.0
 */
export declare function array<A>(items: Compat<A>): Compat<Array<A>>;
/**
 * @since 3.0.0
 */
export declare function tuple<A extends ReadonlyArray<unknown>>(...components: {
    [K in keyof A]: Compat<A[K]>;
}): Compat<A>;
/**
 * @since 3.0.0
 */
export declare function intersection<A, B>(left: Compat<A>, right: Compat<B>): Compat<A & B>;
/**
 * @since 3.0.0
 */
export declare function union<A extends ReadonlyArray<unknown>>(...members: {
    [K in keyof A]: Compat<A[K]>;
}): Compat<A[number]>;
/**
 * @since 3.0.0
 */
export declare function sum<T extends string>(tag: T): <A>(members: {
    [K in keyof A]: Compat<A[K] & Record<T, K>>;
}) => Compat<A[keyof A]>;
/**
 * @since 3.0.0
 */
export declare function lazy<A>(id: string, f: () => Compat<A>): Compat<A>;
/**
 * @since 3.0.0
 */
export declare const URI = "Compat";
/**
 * @since 3.0.0
 */
export declare type URI = typeof URI;
declare module 'fp-ts/lib/HKT' {
    interface URItoKind<A> {
        readonly Compat: Compat<A>;
    }
}
/**
 * @since 3.0.0
 */
export declare const compat: S.Schemable<URI> & S.WithUnion<URI>;
