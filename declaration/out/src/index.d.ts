import { Either } from 'fp-ts/lib/Either';
import { identity } from 'fp-ts/lib/function';
export interface Decoder<I, A> {
    readonly decode: (i: I) => Either<DecodeError, A>;
}
export interface Encoder<A, O> {
    readonly encode: (a: A) => O;
}
export declare type DecodeError = Leaf | Product | And | Or;
export interface Leaf {
    type: 'Leaf';
    actual: unknown;
    expected: string;
}
export interface Product {
    type: 'Product';
    actual: unknown;
    expected: string;
    errors: Array<[string | number, DecodeError]>;
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
export declare const product: (actual: unknown, expected: string, errors: [string | number, DecodeError][]) => DecodeError;
export declare const and: (expected: string, errors: DecodeError[]) => DecodeError;
export declare const or: (expected: string, errors: DecodeError[]) => DecodeError;
export declare const success: <A>(u: A) => Either<DecodeError, A>;
export declare const failure: (u: unknown, expected: string) => Either<DecodeError, never>;
export declare class Type<A, O, I> implements Decoder<I, A>, Encoder<A, O> {
    readonly name: string;
    readonly is: (u: unknown) => u is A;
    readonly validate: (i: I, context: string) => Either<DecodeError, A>;
    readonly encode: (a: A) => O;
    readonly _A: A;
    readonly _O: O;
    readonly _I: I;
    constructor(name: string, is: (u: unknown) => u is A, validate: (i: I, context: string) => Either<DecodeError, A>, encode: (a: A) => O);
    decode(i: I): Either<DecodeError, A>;
}
export interface Mixed extends Type<any, any, unknown> {
}
export declare type TypeOf<RT extends {
    _A: unknown;
}> = RT['_A'];
export declare type InputOf<RT extends {
    _I: unknown;
}> = RT['_I'];
export declare type OutputOf<RT extends {
    _O: unknown;
}> = RT['_O'];
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
export declare class LiteralType<V> extends Type<V, V, unknown> {
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
export interface InterfaceTypeOf<T extends InterfaceType<any, A, O, I>, A = TypeOf<T>, O = OutputOf<T>, I = unknown> extends InterfaceType<T['props'], A, O, I> {
}
export declare class InterfaceType<P, A, O, I> extends Type<A, O, I> {
    readonly props: P;
    readonly _tag: 'InterfaceType';
    constructor(name: InterfaceType<P, A, O, I>['name'], is: InterfaceType<P, A, O, I>['is'], decode: InterfaceType<P, A, O, I>['validate'], encode: InterfaceType<P, A, O, I>['encode'], props: P);
}
export interface Props {
    [key: string]: Mixed;
}
export declare const type: <P extends Props>(props: P, name?: string) => InterfaceType<P, { [K in keyof P]: P[K]["_A"]; }, { [K in keyof P]: P[K]["_O"]; }, unknown>;
export interface PartialTypeOf<T extends PartialType<any, A, O, I>, A = TypeOf<T>, O = OutputOf<T>, I = unknown> extends PartialType<T['props'], A, O, I> {
}
export declare class PartialType<P, A, O, I> extends Type<A, O, I> {
    readonly props: P;
    readonly _tag: 'PartialType';
    constructor(name: PartialType<P, A, O, I>['name'], is: PartialType<P, A, O, I>['is'], decode: PartialType<P, A, O, I>['validate'], encode: PartialType<P, A, O, I>['encode'], props: P);
}
export declare const partial: <P extends Props>(props: P, name?: string) => PartialType<P, { [K in keyof P]?: P[K]["_A"] | undefined; }, { [K in keyof P]?: P[K]["_O"] | undefined; }, unknown>;
export declare class UnionType<RTS, A, O, I> extends Type<A, O, I> {
    readonly types: RTS;
    readonly _tag: 'UnionType';
    constructor(name: UnionType<RTS, A, O, I>['name'], is: UnionType<RTS, A, O, I>['is'], decode: UnionType<RTS, A, O, I>['validate'], encode: UnionType<RTS, A, O, I>['encode'], types: RTS);
}
export declare const union: <RTS extends Mixed[]>(types: RTS, name?: string) => UnionType<RTS, RTS[number]["_A"], RTS[number]["_O"], unknown>;
export declare class ArrayType<RT, A, O, I> extends Type<A, O, I> {
    readonly type: RT;
    readonly _tag: 'ArrayType';
    constructor(name: ArrayType<RT, A, O, I>['name'], is: ArrayType<RT, A, O, I>['is'], decode: ArrayType<RT, A, O, I>['validate'], encode: ArrayType<RT, A, O, I>['encode'], type: RT);
}
export declare const array: <RT extends Mixed>(type: RT, name?: string) => ArrayType<RT, RT["_A"][], RT["_O"][], unknown>;
export declare class IntersectionType<RTS, A, O, I> extends Type<A, O, I> {
    readonly types: RTS;
    readonly _tag: 'IntersectionType';
    constructor(name: IntersectionType<RTS, A, O, I>['name'], is: IntersectionType<RTS, A, O, I>['is'], decode: IntersectionType<RTS, A, O, I>['validate'], encode: IntersectionType<RTS, A, O, I>['encode'], types: RTS);
}
/**
 * used in `intersection` as a workaround for #234
 */
declare type Compact<A> = {
    [K in keyof A]: A[K];
};
export declare function intersection<A extends Mixed, B extends Mixed, C extends Mixed, D extends Mixed, E extends Mixed>(types: [A, B, C, D, E], name?: string): IntersectionType<[A, B, C, D, E], Compact<TypeOf<A> & TypeOf<B> & TypeOf<C> & TypeOf<D> & TypeOf<E>>, Compact<OutputOf<A> & OutputOf<B> & OutputOf<C> & OutputOf<D> & OutputOf<E>>, unknown>;
export declare function intersection<A extends Mixed, B extends Mixed, C extends Mixed, D extends Mixed>(types: [A, B, C, D], name?: string): IntersectionType<[A, B, C, D], Compact<TypeOf<A> & TypeOf<B> & TypeOf<C> & TypeOf<D>>, Compact<OutputOf<A> & OutputOf<B> & OutputOf<C> & OutputOf<D>>, unknown>;
export declare function intersection<A extends Mixed, B extends Mixed, C extends Mixed>(types: [A, B, C], name?: string): IntersectionType<[A, B, C], Compact<TypeOf<A> & TypeOf<B> & TypeOf<C>>, Compact<OutputOf<A> & OutputOf<B> & OutputOf<C>>, unknown>;
export declare function intersection<A extends Mixed, B extends Mixed>(types: [A, B], name?: string): IntersectionType<[A, B], Compact<TypeOf<A> & TypeOf<B>>, Compact<OutputOf<A> & OutputOf<B>>, unknown>;
export declare class TupleType<RTS, A, O, I> extends Type<A, O, I> {
    readonly types: RTS;
    readonly _tag: 'TupleType';
    constructor(name: TupleType<RTS, A, O, I>['name'], is: TupleType<RTS, A, O, I>['is'], decode: TupleType<RTS, A, O, I>['validate'], encode: TupleType<RTS, A, O, I>['encode'], types: RTS);
}
export declare function tuple<A extends Mixed, B extends Mixed, C extends Mixed, D extends Mixed, E extends Mixed>(types: [A, B, C, D, E], name?: string): TupleType<[A, B, C, D, E], [TypeOf<A>, TypeOf<B>, TypeOf<C>, TypeOf<D>, TypeOf<E>], [OutputOf<A>, OutputOf<B>, OutputOf<C>, OutputOf<D>, OutputOf<E>], unknown>;
export declare function tuple<A extends Mixed, B extends Mixed, C extends Mixed, D extends Mixed>(types: [A, B, C, D], name?: string): TupleType<[A, B, C, D], [TypeOf<A>, TypeOf<B>, TypeOf<C>, TypeOf<D>], [OutputOf<A>, OutputOf<B>, OutputOf<C>, OutputOf<D>], unknown>;
export declare function tuple<A extends Mixed, B extends Mixed, C extends Mixed>(types: [A, B, C], name?: string): TupleType<[A, B, C], [TypeOf<A>, TypeOf<B>, TypeOf<C>], [OutputOf<A>, OutputOf<B>, OutputOf<C>], unknown>;
export declare function tuple<A extends Mixed, B extends Mixed>(types: [A, B], name?: string): TupleType<[A, B], [TypeOf<A>, TypeOf<B>], [OutputOf<A>, OutputOf<B>], unknown>;
export declare function tuple<A extends Mixed>(types: [A], name?: string): TupleType<[A], [TypeOf<A>], [OutputOf<A>], unknown>;
declare type TaggedProps<Tag extends string> = {
    [K in Tag]: LiteralType<any>;
};
interface TaggedUnion<Tag extends string> extends UnionType<Array<Tagged<Tag>>, any, any, any> {
}
declare type TaggedIntersectionArgument<Tag extends string> = [Tagged<Tag>, Mixed] | [Mixed, Tagged<Tag>] | [Tagged<Tag>, Mixed, Mixed] | [Mixed, Tagged<Tag>, Mixed] | [Mixed, Mixed, Tagged<Tag>] | [Tagged<Tag>, Mixed, Mixed, Mixed] | [Mixed, Tagged<Tag>, Mixed, Mixed] | [Mixed, Mixed, Tagged<Tag>, Mixed] | [Mixed, Mixed, Mixed, Tagged<Tag>] | [Tagged<Tag>, Mixed, Mixed, Mixed, Mixed] | [Mixed, Tagged<Tag>, Mixed, Mixed, Mixed] | [Mixed, Mixed, Tagged<Tag>, Mixed, Mixed] | [Mixed, Mixed, Mixed, Tagged<Tag>, Mixed] | [Mixed, Mixed, Mixed, Mixed, Tagged<Tag>];
interface TaggedIntersection<Tag extends string> extends IntersectionType<TaggedIntersectionArgument<Tag>, any, any, any> {
}
declare type Tagged<Tag extends string> = InterfaceType<TaggedProps<Tag>, any, any, any> | TaggedUnion<Tag> | TaggedIntersection<Tag>;
export declare const isTagged: <Tag extends string>(tag: Tag) => (type: Mixed) => type is Tagged<Tag>;
export declare const getTagValue: <Tag extends string>(tag: Tag) => (type: Tagged<Tag>) => string | number | boolean;
export declare class TaggedUnionType<Tag extends string, RTS extends Array<Tagged<Tag>>, A, O, I> extends UnionType<RTS, A, O, I> {
    readonly tag: Tag;
    constructor(name: TaggedUnionType<Tag, RTS, A, O, I>['name'], is: TaggedUnionType<Tag, RTS, A, O, I>['is'], decode: TaggedUnionType<Tag, RTS, A, O, I>['validate'], encode: TaggedUnionType<Tag, RTS, A, O, I>['encode'], types: RTS, tag: Tag);
}
export declare const taggedUnion: <Tag extends string, RTS extends Tagged<Tag>[]>(tag: Tag, types: RTS, name?: string) => TaggedUnionType<Tag, RTS, RTS[number]["_A"], RTS[number]["_O"], unknown>;
export declare class DictionaryType<D, C, A, O, I> extends Type<A, O, I> {
    readonly domain: D;
    readonly codomain: C;
    readonly _tag: 'DictionaryType';
    constructor(name: DictionaryType<D, C, A, O, I>['name'], is: DictionaryType<D, C, A, O, I>['is'], decode: DictionaryType<D, C, A, O, I>['validate'], encode: DictionaryType<D, C, A, O, I>['encode'], domain: D, codomain: C);
}
export declare const dictionary: <D extends Mixed, C extends Mixed>(domain: D, codomain: C, name?: string) => DictionaryType<D, C, { [K in D["_A"]]: C["_A"]; }, { [K in D["_O"]]: C["_O"]; }, unknown>;
export declare class LazyType<A, O, I> extends Type<A, O, I> {
    readonly definition: () => Type<A, O, unknown>;
    readonly _tag: 'LazyType';
    constructor(name: LazyType<A, O, I>['name'], is: LazyType<A, O, I>['is'], decode: LazyType<A, O, I>['validate'], encode: LazyType<A, O, I>['encode'], definition: () => Type<A, O, unknown>);
}
export declare const lazy: <A, O>(name: string, definition: () => Type<A, O, unknown>) => LazyType<A, O, unknown>;
export { undefinedType as undefined, type as interface, nullType as null, arrayType as Array, identity };
