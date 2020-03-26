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
export interface TypeNode<A> {
    readonly typeNode: () => C.Const<ts.TypeNode, A>;
}
/**
 * @since 3.0.0
 */
export declare function $ref(id: string): TypeNode<unknown>;
/**
 * @since 3.0.0
 */
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): TypeNode<A[number]>;
/**
 * @since 3.0.0
 */
export declare const string: TypeNode<string>;
/**
 * @since 3.0.0
 */
export declare const number: TypeNode<number>;
/**
 * @since 3.0.0
 */
export declare const boolean: TypeNode<boolean>;
/**
 * @since 3.0.0
 */
export declare const UnknownArray: TypeNode<Array<unknown>>;
/**
 * @since 3.0.0
 */
export declare const UnknownRecord: TypeNode<Record<string, unknown>>;
/**
 * @since 3.0.0
 */
export declare function nullable<A>(or: TypeNode<A>): TypeNode<null | A>;
/**
 * @since 3.0.0
 */
export declare function type<A>(properties: {
    [K in keyof A]: TypeNode<A[K]>;
}): TypeNode<A>;
/**
 * @since 3.0.0
 */
export declare function partial<A>(properties: {
    [K in keyof A]: TypeNode<A[K]>;
}): TypeNode<Partial<A>>;
/**
 * @since 3.0.0
 */
export declare function record<A>(codomain: TypeNode<A>): TypeNode<Record<string, A>>;
/**
 * @since 3.0.0
 */
export declare function array<A>(items: TypeNode<A>): TypeNode<Array<A>>;
/**
 * @since 3.0.0
 */
export declare function tuple<A extends ReadonlyArray<unknown>>(...components: {
    [K in keyof A]: TypeNode<A[K]>;
}): TypeNode<A>;
/**
 * @since 3.0.0
 */
export declare function intersection<A, B>(left: TypeNode<A>, right: TypeNode<B>): TypeNode<A & B>;
/**
 * @since 3.0.0
 */
export declare function sum<T extends string>(_tag: T): <A>(members: {
    [K in keyof A]: TypeNode<A[K] & Record<T, K>>;
}) => TypeNode<A[keyof A]>;
/**
 * @since 3.0.0
 */
export declare function lazy<A>(id: string, f: () => TypeNode<A>): TypeNode<A>;
/**
 * @since 3.0.0
 */
export declare function union<A extends ReadonlyArray<unknown>>(...members: {
    [K in keyof A]: TypeNode<A[K]>;
}): TypeNode<A[number]>;
/**
 * @since 3.0.0
 */
export declare const URI = "TypeNode";
/**
 * @since 3.0.0
 */
export declare type URI = typeof URI;
declare module 'fp-ts/lib/HKT' {
    interface URItoKind<A> {
        readonly TypeNode: TypeNode<A>;
    }
}
/**
 * @since 3.0.0
 */
export declare const typeNode: S.Schemable<URI> & S.WithUnion<URI>;
/**
 * @since 3.0.0
 */
export declare function print(node: ts.Node): string;
