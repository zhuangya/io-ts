/**
 * @since 3.0.0
 */
import { Alternative1 as D } from 'fp-ts/es6/Alternative';
import { Applicative1 } from 'fp-ts/es6/Applicative';
import { Either } from 'fp-ts/es6/Either';
import { NonEmptyArray } from 'fp-ts/es6/NonEmptyArray';
import * as T from 'fp-ts/es6/Tree';
import * as G from './Guard';
import { Literal } from './Literal';
import * as S from './Schemable';
/**
 * @since 3.0.0
 */
export interface Decoder<A> {
    readonly decode: (u: unknown) => Either<NonEmptyArray<T.Tree<string>>, A>;
}
/**
 * @since 3.0.0
 */
export declare type TypeOf<D> = D extends Decoder<infer A> ? A : never;
/**
 * @since 3.0.0
 */
export declare const tree: typeof T.make;
/**
 * @since 3.0.0
 */
export declare function success<A>(a: A): Either<NonEmptyArray<T.Tree<string>>, A>;
/**
 * @since 3.0.0
 */
export declare function failure<A = never>(message: string): Either<NonEmptyArray<T.Tree<string>>, A>;
/**
 * @since 3.0.0
 */
export declare function failures<A = never>(message: string, errors: NonEmptyArray<T.Tree<string>>): Either<NonEmptyArray<T.Tree<string>>, A>;
/**
 * @since 3.0.0
 */
export declare function fromGuard<A>(guard: G.Guard<A>, expected: string): Decoder<A>;
/**
 * @since 3.0.0
 */
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): Decoder<A[number]>;
/**
 * @since 3.0.0
 */
export declare const never: Decoder<never>;
/**
 * @since 3.0.0
 */
export declare const string: Decoder<string>;
/**
 * @since 3.0.0
 */
export declare const number: Decoder<number>;
/**
 * @since 3.0.0
 */
export declare const boolean: Decoder<boolean>;
/**
 * @since 3.0.0
 */
export declare const UnknownArray: Decoder<Array<unknown>>;
/**
 * @since 3.0.0
 */
export declare const UnknownRecord: Decoder<Record<string, unknown>>;
/**
 * @since 3.0.0
 */
export declare function withExpected<A>(decoder: Decoder<A>, expected: (actual: unknown, nea: NonEmptyArray<T.Tree<string>>) => NonEmptyArray<T.Tree<string>>): Decoder<A>;
/**
 * @since 3.0.0
 */
export declare function refinement<A, B extends A>(from: Decoder<A>, refinement: (a: A) => a is B, expected: string): Decoder<B>;
/**
 * @since 3.0.0
 */
export declare function parse<A, B>(from: Decoder<A>, parser: (a: A) => Either<string, B>): Decoder<B>;
/**
 * @since 3.0.0
 */
export declare function nullable<A>(or: Decoder<A>): Decoder<null | A>;
/**
 * @since 3.0.0
 */
export declare function type<A>(properties: {
    [K in keyof A]: Decoder<A[K]>;
}): Decoder<A>;
/**
 * @since 3.0.0
 */
export declare function partial<A>(properties: {
    [K in keyof A]: Decoder<A[K]>;
}): Decoder<Partial<A>>;
/**
 * @since 3.0.0
 */
export declare function record<A>(codomain: Decoder<A>): Decoder<Record<string, A>>;
/**
 * @since 3.0.0
 */
export declare function array<A>(items: Decoder<A>): Decoder<Array<A>>;
/**
 * @since 3.0.0
 */
export declare function tuple<A extends ReadonlyArray<unknown>>(...components: {
    [K in keyof A]: Decoder<A[K]>;
}): Decoder<A>;
/**
 * @since 3.0.0
 */
export declare function intersection<A, B>(left: Decoder<A>, right: Decoder<B>): Decoder<A & B>;
/**
 * @since 3.0.0
 */
export declare function lazy<A>(id: string, f: () => Decoder<A>): Decoder<A>;
/**
 * @since 3.0.0
 */
export declare function sum<T extends string>(tag: T): <A>(members: {
    [K in keyof A]: Decoder<A[K] & Record<T, K>>;
}) => Decoder<A[keyof A]>;
/**
 * @since 3.0.0
 */
export declare function union<A extends ReadonlyArray<unknown>>(...members: {
    [K in keyof A]: Decoder<A[K]>;
}): Decoder<A[number]>;
/**
 * @since 3.0.0
 */
export declare const URI = "Decoder";
/**
 * @since 3.0.0
 */
export declare type URI = typeof URI;
declare module 'fp-ts/es6/HKT' {
    interface URItoKind<A> {
        readonly Decoder: Decoder<A>;
    }
}
/**
 * @since 3.0.0
 */
export declare const decoder: Applicative1<URI> & D<URI> & S.Schemable<URI> & S.WithUnion<URI>;
declare const alt: <A>(that: () => Decoder<A>) => (fa: Decoder<A>) => Decoder<A>, ap: <A>(fa: Decoder<A>) => <B>(fab: Decoder<(a: A) => B>) => Decoder<B>, apFirst: <B>(fb: Decoder<B>) => <A>(fa: Decoder<A>) => Decoder<A>, apSecond: <B>(fb: Decoder<B>) => <A>(fa: Decoder<A>) => Decoder<B>, map: <A, B>(f: (a: A) => B) => (fa: Decoder<A>) => Decoder<B>;
export { 
/**
 * @since 3.0.0
 */
alt, 
/**
 * @since 3.0.0
 */
ap, 
/**
 * @since 3.0.0
 */
apFirst, 
/**
 * @since 3.0.0
 */
apSecond, 
/**
 * @since 3.0.0
 */
map };
