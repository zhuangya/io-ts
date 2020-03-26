/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const';
import * as ts from 'typescript';
import { Literal } from './Literal';
import * as S from './Schemable';
/**
 * @since 3.0.0
 */
export interface Expression<A> {
    readonly expression: () => C.Const<ts.Expression, A>;
}
/**
 * @since 3.0.0
 */
export declare function $ref(id: string): Expression<unknown>;
/**
 * @since 3.0.0
 */
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): Expression<A[number]>;
/**
 * @since 3.0.0
 */
export declare const string: Expression<string>;
/**
 * @since 3.0.0
 */
export declare const number: Expression<number>;
/**
 * @since 3.0.0
 */
export declare const boolean: Expression<boolean>;
/**
 * @since 3.0.0
 */
export declare const UnknownArray: Expression<Array<unknown>>;
/**
 * @since 3.0.0
 */
export declare const UnknownRecord: Expression<Record<string, unknown>>;
/**
 * @since 3.0.0
 */
export declare function nullable<A>(or: Expression<A>): Expression<null | A>;
/**
 * @since 3.0.0
 */
export declare function type<A>(properties: {
    [K in keyof A]: Expression<A[K]>;
}): Expression<A>;
/**
 * @since 3.0.0
 */
export declare function partial<A>(properties: {
    [K in keyof A]: Expression<A[K]>;
}): Expression<Partial<A>>;
/**
 * @since 3.0.0
 */
export declare function record<A>(codomain: Expression<A>): Expression<Record<string, A>>;
/**
 * @since 3.0.0
 */
export declare function array<A>(items: Expression<A>): Expression<Array<A>>;
/**
 * @since 3.0.0
 */
export declare function tuple<A extends ReadonlyArray<unknown>>(...components: {
    [K in keyof A]: Expression<A[K]>;
}): Expression<A>;
/**
 * @since 3.0.0
 */
export declare function intersection<A, B>(left: Expression<A>, right: Expression<B>): Expression<A & B>;
/**
 * @since 3.0.0
 */
export declare function sum<T extends string>(tag: T): <A>(members: {
    [K in keyof A]: Expression<A[K] & Record<T, K>>;
}) => Expression<A[keyof A]>;
/**
 * @since 3.0.0
 */
export declare function lazy<A>(id: string, f: () => Expression<A>): Expression<A>;
/**
 * @since 3.0.0
 */
export declare function union<A extends ReadonlyArray<unknown>>(...members: {
    [K in keyof A]: Expression<A[K]>;
}): Expression<A[number]>;
/**
 * @since 3.0.0
 */
export declare const URI = "Expression";
/**
 * @since 3.0.0
 */
export declare type URI = typeof URI;
declare module 'fp-ts/lib/HKT' {
    interface URItoKind<A> {
        readonly Expression: Expression<A>;
    }
}
/**
 * @since 3.0.0
 */
export declare const expression: S.Schemable<URI> & S.WithUnion<URI>;
/**
 * @since 3.0.0
 */
export declare function print(node: ts.Node): string;
