/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/es6/Const';
import { JSONSchema7 } from 'json-schema';
import { Literal } from './Literal';
import * as S from './Schemable';
/**
 * @since 3.0.0
 */
export interface JsonSchema<A> {
    readonly compile: (definitions?: Record<string, JSONSchema7 | undefined>) => C.Const<JSONSchema7, A>;
}
/**
 * @since 3.0.0
 */
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): JsonSchema<A[number]>;
/**
 * @since 3.0.0
 */
export declare const string: JsonSchema<string>;
/**
 * @since 3.0.0
 */
export declare const number: JsonSchema<number>;
/**
 * @since 3.0.0
 */
export declare const boolean: JsonSchema<boolean>;
/**
 * @since 3.0.0
 */
export declare const UnknownArray: JsonSchema<Array<unknown>>;
/**
 * @since 3.0.0
 */
export declare const UnknownRecord: JsonSchema<Record<string, unknown>>;
/**
 * @since 3.0.0
 */
export declare function nullable<A>(or: JsonSchema<A>): JsonSchema<null | A>;
/**
 * @since 3.0.0
 */
export declare function type<A>(properties: {
    [K in keyof A]: JsonSchema<A[K]>;
}): JsonSchema<A>;
/**
 * @since 3.0.0
 */
export declare function partial<A>(properties: {
    [K in keyof A]: JsonSchema<A[K]>;
}): JsonSchema<Partial<A>>;
/**
 * @since 3.0.0
 */
export declare function record<A>(codomain: JsonSchema<A>): JsonSchema<Record<string, A>>;
/**
 * @since 3.0.0
 */
export declare function array<A>(items: JsonSchema<A>): JsonSchema<Array<A>>;
/**
 * @since 3.0.0
 */
export declare function tuple<A extends ReadonlyArray<unknown>>(...components: {
    [K in keyof A]: JsonSchema<A[K]>;
}): JsonSchema<A>;
/**
 * @since 3.0.0
 */
export declare function intersection<A, B>(left: JsonSchema<A>, right: JsonSchema<B>): JsonSchema<A & B>;
/**
 * @since 3.0.0
 */
export declare function sum<T extends string>(_tag: T): <A>(members: {
    [K in keyof A]: JsonSchema<A[K] & Record<T, K>>;
}) => JsonSchema<A[keyof A]>;
/**
 * @since 3.0.0
 */
export declare function lazy<A>(id: string, f: () => JsonSchema<A>): JsonSchema<A>;
/**
 * @since 3.0.0
 */
export declare function union<A extends ReadonlyArray<unknown>>(...members: {
    [K in keyof A]: JsonSchema<A[K]>;
}): JsonSchema<A[number]>;
/**
 * @since 3.0.0
 */
export declare const URI = "JsonSchema";
/**
 * @since 3.0.0
 */
export declare type URI = typeof URI;
declare module 'fp-ts/es6/HKT' {
    interface URItoKind<A> {
        readonly JsonSchema: JsonSchema<A>;
    }
}
/**
 * @since 3.0.0
 */
export declare const jsonSchema: S.Schemable<URI> & S.WithUnion<URI>;
