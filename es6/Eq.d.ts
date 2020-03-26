import * as E from 'fp-ts/es6/Eq';
import * as S from './Schemable';
import Eq = E.Eq;
/**
 * @since 3.0.0
 */
export declare const string: Eq<string>;
/**
 * @since 3.0.0
 */
export declare const number: Eq<number>;
/**
 * @since 3.0.0
 */
export declare const boolean: Eq<boolean>;
/**
 * @since 3.0.0
 */
export declare const UnknownArray: Eq<Array<unknown>>;
/**
 * @since 3.0.0
 */
export declare const UnknownRecord: Eq<Record<string, unknown>>;
/**
 * @since 3.0.0
 */
export declare function nullable<A>(or: Eq<A>): Eq<null | A>;
/**
 * @since 3.0.0
 */
export declare const type: <A>(eqs: {
    [K in keyof A]: Eq<A[K]>;
}) => Eq<A>;
/**
 * @since 3.0.0
 */
export declare function partial<A>(properties: {
    [K in keyof A]: Eq<A[K]>;
}): Eq<Partial<A>>;
/**
 * @since 3.0.0
 */
export declare const record: <A>(codomain: Eq<A>) => Eq<Record<string, A>>;
/**
 * @since 3.0.0
 */
export declare const array: <A>(eq: Eq<A>) => Eq<Array<A>>;
/**
 * @since 3.0.0
 */
export declare const tuple: <A extends ReadonlyArray<unknown>>(...components: {
    [K in keyof A]: Eq<A[K]>;
}) => Eq<A>;
/**
 * @since 3.0.0
 */
export declare function intersection<A, B>(left: Eq<A>, right: Eq<B>): Eq<A & B>;
/**
 * @since 3.0.0
 */
export declare function sum<T extends string>(tag: T): <A>(members: {
    [K in keyof A]: Eq<A[K] & Record<T, K>>;
}) => Eq<A[keyof A]>;
/**
 * @since 3.0.0
 */
export declare function lazy<A>(f: () => Eq<A>): Eq<A>;
/**
 * @since 3.0.0
 */
export declare const eq: typeof E.eq & S.Schemable<E.URI>;
