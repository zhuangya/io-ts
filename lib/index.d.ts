import { Either } from 'fp-ts/lib/Either';
import { identity } from 'fp-ts/lib/function';
export declare type DecodeError = Leaf | LabeledProduct | IndexedProduct | And | Or;
export interface Leaf {
    type: 'Leaf';
    actual: unknown;
    expected: string;
}
export interface LabeledProduct {
    type: 'LabeledProduct';
    actual: unknown;
    expected: string;
    errors: {
        [key: string]: DecodeError;
    };
}
export interface IndexedProduct {
    type: 'IndexedProduct';
    actual: unknown;
    expected: string;
    errors: Array<[number, DecodeError]>;
}
export interface And {
    type: 'And';
    expected: string;
    errors: Array<DecodeError>;
}
export interface Or {
    type: 'Or';
    expected: string;
    errors: Array<DecodeError>;
}
export declare const leaf: (actual: unknown, expected: string) => DecodeError;
export declare const labeledProduct: (actual: unknown, expected: string, errors: {
    [key: string]: DecodeError;
}) => DecodeError;
export declare const indexedProduct: (actual: unknown, expected: string, errors: [number, DecodeError][]) => DecodeError;
export declare const and: (expected: string, errors: DecodeError[]) => DecodeError;
export declare const or: (expected: string, errors: DecodeError[]) => DecodeError;
export declare const success: <A>(u: A) => Either<DecodeError, A>;
export declare const failure: <A>(u: unknown, expected: string) => Either<DecodeError, A>;
interface Decoder<I, A> {
    readonly decode: (i: I) => Either<DecodeError, A>;
}
interface Encoder<A, O> {
    readonly encode: (a: A) => O;
}
export declare class Type<A, O, I> implements Decoder<I, A>, Encoder<A, O> {
    /** a unique name for this runtime type */
    readonly name: string;
    /** a custom type guard */
    readonly is: (u: unknown) => u is A;
    /** succeeds if a value of type `I` can be decoded to a value of type `A` */
    readonly validate: (i: I, context: string) => Either<DecodeError, A>;
    /** converts a value of type `A` to a value of type `O` */
    readonly encode: (a: A) => O;
    readonly _A: A;
    readonly _O: O;
    readonly decode: (i: I) => Either<DecodeError, A>;
    constructor(
    /** a unique name for this runtime type */
    name: string, 
    /** a custom type guard */
    is: (u: unknown) => u is A, 
    /** succeeds if a value of type `I` can be decoded to a value of type `A` */
    validate: (i: I, context: string) => Either<DecodeError, A>, 
    /** converts a value of type `A` to a value of type `O` */
    encode: (a: A) => O);
}
export interface Mixed extends Type<any, any, unknown> {
}
export declare type TypeOf<T extends any> = T['_A'];
export declare type OutputOf<T extends any> = T['_O'];
export declare type InputOf<T extends any> = T['_I'];
export declare class NullType extends Type<null, null, unknown> {
    readonly _tag: 'NullType';
    constructor();
}
declare const nullType: NullType;
export declare class UndefinedType extends Type<undefined, undefined, unknown> {
    readonly _tag: 'UndefinedType';
    constructor();
}
declare const undefinedType: UndefinedType;
export declare class StringType extends Type<string, string, unknown> {
    readonly _tag: 'StringType';
    constructor();
}
export declare const string: StringType;
export declare class NumberType extends Type<number, number, unknown> {
    readonly _tag: 'NumberType';
    constructor();
}
export declare const number: NumberType;
export declare class BooleanType extends Type<boolean, boolean, unknown> {
    readonly _tag: 'BooleanType';
    constructor();
}
export declare const boolean: BooleanType;
export declare class UnknownType extends Type<unknown, unknown, unknown> {
    readonly _tag: 'UnknownType';
    constructor();
}
export declare const unknown: UnknownType;
export declare class AnyArrayType extends Type<Array<unknown>, Array<unknown>, unknown> {
    readonly _tag: 'AnyArrayType';
    constructor();
}
declare const arrayType: AnyArrayType;
export declare class AnyDictionaryType extends Type<Record<string, unknown>, Record<string, unknown>, unknown> {
    readonly _tag: 'AnyDictionaryType';
    constructor();
}
export declare const Dictionary: AnyDictionaryType;
export declare class LiteralType<V extends string | number | boolean> extends Type<V, V, unknown> {
    readonly value: V;
    readonly _tag: 'LiteralType';
    constructor(name: LiteralType<V>['name'], is: LiteralType<V>['is'], decode: LiteralType<V>['validate'], encode: LiteralType<V>['encode'], value: V);
}
export declare const literal: <V extends string | number | boolean>(value: V, name?: string) => LiteralType<V>;
export declare class KeyofType<D> extends Type<keyof D, keyof D, unknown> {
    readonly keys: D;
    readonly _tag: 'KeyofType';
    constructor(name: KeyofType<D>['name'], is: KeyofType<D>['is'], decode: KeyofType<D>['validate'], encode: KeyofType<D>['encode'], keys: D);
}
export declare const keyof: <D extends Record<string, unknown>>(keys: D, name?: string) => KeyofType<D>;
export declare class InterfaceType<P extends Props> extends Type<{
    [K in keyof P]: TypeOf<P[K]>;
}, {
    [K in keyof P]: OutputOf<P[K]>;
}, unknown> {
    readonly props: P;
    readonly _tag: 'InterfaceType';
    constructor(name: InterfaceType<P>['name'], is: InterfaceType<P>['is'], decode: InterfaceType<P>['validate'], encode: InterfaceType<P>['encode'], props: P);
}
export interface Props {
    [key: string]: Mixed;
}
export declare const type: <P extends Props>(props: P, name?: string) => InterfaceType<P>;
export declare class PartialType<P extends Props> extends Type<{
    [K in keyof P]?: TypeOf<P[K]>;
}, {
    [K in keyof P]?: OutputOf<P[K]>;
}, unknown> {
    readonly props: P;
    readonly _tag: 'PartialType';
    constructor(name: PartialType<P>['name'], is: PartialType<P>['is'], decode: PartialType<P>['validate'], encode: PartialType<P>['encode'], props: P);
}
export declare const partial: <P extends Props>(props: P, name?: string) => PartialType<P>;
export declare class UnionType<TS extends [Mixed, Mixed, ...Array<Mixed>]> extends Type<TypeOf<TS[number]>, OutputOf<TS[number]>, unknown> {
    readonly types: TS;
    readonly _tag: 'UnionType';
    constructor(name: UnionType<TS>['name'], is: UnionType<TS>['is'], decode: UnionType<TS>['validate'], encode: UnionType<TS>['encode'], types: TS);
}
interface Index extends Record<string, Array<[unknown, Mixed]>> {
}
/** @internal */
export declare const getTypeIndex: (type: Mixed, override?: Mixed) => Index;
/** @internal */
export declare const getIndex: (types: Mixed[]) => Index;
export declare const union: <TS extends [Mixed, Mixed, ...Mixed[]]>(types: TS, name?: string) => UnionType<TS>;
export declare class ArrayType<T extends Mixed> extends Type<Array<TypeOf<T>>, Array<OutputOf<T>>, unknown> {
    readonly type: T;
    readonly _tag: 'ArrayType';
    constructor(name: ArrayType<T>['name'], is: ArrayType<T>['is'], decode: ArrayType<T>['validate'], encode: ArrayType<T>['encode'], type: T);
}
export declare const array: <T extends Mixed>(type: T, name?: string) => ArrayType<T>;
/**
 * @see https://stackoverflow.com/a/50375286#50375286
 */
declare type UnionToIntersection<U> = (U extends any ? (u: U) => void : never) extends ((u: infer I) => void) ? I : never;
export declare class IntersectionType<TS extends [Mixed, Mixed, ...Array<Mixed>]> extends Type<UnionToIntersection<TypeOf<TS[number]>>, UnionToIntersection<OutputOf<TS[number]>>, unknown> {
    readonly types: TS;
    readonly _tag: 'IntersectionType';
    constructor(name: IntersectionType<TS>['name'], is: IntersectionType<TS>['is'], decode: IntersectionType<TS>['validate'], encode: IntersectionType<TS>['encode'], types: TS);
}
export declare function intersection<TS extends [Mixed, Mixed, ...Array<Mixed>]>(types: TS, name?: string): IntersectionType<TS>;
export declare class TupleType<TS extends [Mixed, Mixed, ...Array<Mixed>]> extends Type<{
    [K in keyof TS]: TypeOf<TS[K]>;
}, {
    [K in keyof TS]: OutputOf<TS[K]>;
}, unknown> {
    readonly types: TS;
    readonly _tag: 'TupleType';
    constructor(name: TupleType<TS>['name'], is: TupleType<TS>['is'], decode: TupleType<TS>['validate'], encode: TupleType<TS>['encode'], types: TS);
}
export declare function tuple<TS extends [Mixed, Mixed, ...Array<Mixed>]>(types: TS, name?: string): TupleType<TS>;
export declare class DictionaryType<D extends Mixed, C extends Mixed> extends Type<{
    [K in TypeOf<D>]: TypeOf<C>;
}, {
    [K in OutputOf<D>]: OutputOf<C>;
}, unknown> {
    readonly domain: D;
    readonly codomain: C;
    readonly _tag: 'DictionaryType';
    constructor(name: DictionaryType<D, C>['name'], is: DictionaryType<D, C>['is'], decode: DictionaryType<D, C>['validate'], encode: DictionaryType<D, C>['encode'], domain: D, codomain: C);
}
export declare const dictionary: <D extends Mixed, C extends Mixed>(domain: D, codomain: C, name?: string) => DictionaryType<D, C>;
export declare class LazyType<A, O> extends Type<A, O, unknown> {
    readonly definition: () => Type<A, O, unknown>;
    readonly _tag: 'LazyType';
    constructor(name: LazyType<A, O>['name'], is: LazyType<A, O>['is'], decode: LazyType<A, O>['validate'], encode: LazyType<A, O>['encode'], definition: () => Type<A, O, unknown>);
}
export declare const lazy: <A, O>(name: string, definition: () => Type<A, O, unknown>) => LazyType<A, O>;
export { undefinedType as undefined, type as interface, nullType as null, arrayType as Array, identity };
