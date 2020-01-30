---
title: DSL.ts
nav_order: 5
parent: Modules
---

# DSL overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [DSL (type alias)](#dsl-type-alias)
- [Model (type alias)](#model-type-alias)
- [URI (type alias)](#uri-type-alias)
- [Int (constant)](#int-constant)
- [URI (constant)](#uri-constant)
- [UnknownArray (constant)](#unknownarray-constant)
- [UnknownRecord (constant)](#unknownrecord-constant)
- [boolean (constant)](#boolean-constant)
- [dsl (constant)](#dsl-constant)
- [number (constant)](#number-constant)
- [string (constant)](#string-constant)
- [array (function)](#array-function)
- [intersection (function)](#intersection-function)
- [lazy (function)](#lazy-function)
- [literals (function)](#literals-function)
- [literalsOr (function)](#literalsor-function)
- [parse (function)](#parse-function)
- [partial (function)](#partial-function)
- [record (function)](#record-function)
- [sum (function)](#sum-function)
- [tuple (function)](#tuple-function)
- [type (function)](#type-function)
- [union (function)](#union-function)

---

# DSL (type alias)

**Signature**

```ts
export type DSL<A> = C.Const<IO<Model>, A>
```

Added in v3.0.0

# Model (type alias)

**Signature**

```ts
export type Model =
  | { readonly _tag: 'literals'; readonly values: NonEmptyArray<S.Literal> }
  | { readonly _tag: 'literalsOr'; readonly values: NonEmptyArray<S.Literal>; readonly model: Model }
  | { readonly _tag: 'string' }
  | { readonly _tag: 'number' }
  | { readonly _tag: 'boolean' }
  | { readonly _tag: 'UnknownArray' }
  | { readonly _tag: 'UnknownRecord' }
  | { readonly _tag: 'Int' }
  | { readonly _tag: 'parse'; readonly model: Model; readonly parser: (a: any) => E.Either<string, unknown> }
  | { readonly _tag: 'type'; readonly models: Record<string, Model> }
  | { readonly _tag: 'partial'; readonly models: Record<string, Model> }
  | { readonly _tag: 'record'; readonly model: Model }
  | { readonly _tag: 'array'; readonly model: Model }
  | { readonly _tag: 'tuple'; readonly models: NonEmptyArray<Model> }
  | { readonly _tag: 'intersection'; readonly models: [Model, Model, ...Array<Model>] }
  | { readonly _tag: 'sum'; readonly tag: string; readonly models: Record<string, Model> }
  | { readonly _tag: 'union'; readonly models: [Model, Model, ...Array<Model>] }
  | { readonly _tag: 'lazy'; readonly model: Model; readonly id: string }
  | { readonly _tag: '$ref'; readonly id: string }
```

Added in v3.0.0

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v3.0.0

# Int (constant)

**Signature**

```ts
export const Int: DSL<S.Int> = ...
```

Added in v3.0.0

# URI (constant)

**Signature**

```ts
export const URI: "DSL" = ...
```

Added in v3.0.0

# UnknownArray (constant)

**Signature**

```ts
export const UnknownArray: DSL<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord (constant)

**Signature**

```ts
export const UnknownRecord: DSL<Record<string, unknown>> = ...
```

Added in v3.0.0

# boolean (constant)

**Signature**

```ts
export const boolean: DSL<boolean> = ...
```

Added in v3.0.0

# dsl (constant)

**Signature**

```ts
export const dsl: S.Schemable<URI> & S.WithInt<URI> & S.WithLazy<URI> & S.WithParse<URI> & S.WithUnion<URI> = ...
```

Added in v3.0.0

# number (constant)

**Signature**

```ts
export const number: DSL<number> = ...
```

Added in v3.0.0

# string (constant)

**Signature**

```ts
export const string: DSL<string> = ...
```

Added in v3.0.0

# array (function)

**Signature**

```ts
export function array<A>(dsl: DSL<A>): DSL<Array<A>> { ... }
```

Added in v3.0.0

# intersection (function)

**Signature**

```ts
export function intersection<A, B, C, D, E>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>, DSL<E>]): DSL<A & B & C & D & E>
export function intersection<A, B, C, D>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>]): DSL<A & B & C & D>
export function intersection<A, B, C>(dsls: [DSL<A>, DSL<B>, DSL<C>]): DSL<A & B & C>
export function intersection<A, B>(dsls: [DSL<A>, DSL<B>]): DSL<A & B> { ... }
```

Added in v3.0.0

# lazy (function)

**Signature**

```ts
export function lazy<A>(f: () => DSL<A>): DSL<A> { ... }
```

Added in v3.0.0

# literals (function)

**Signature**

```ts
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): DSL<A> { ... }
```

Added in v3.0.0

# literalsOr (function)

**Signature**

```ts
export function literalsOr<A extends S.Literal, B>(values: NonEmptyArray<A>, dsl: DSL<B>): DSL<A | B> { ... }
```

Added in v3.0.0

# parse (function)

**Signature**

```ts
export function parse<A, B>(dsl: DSL<A>, parser: (a: A) => E.Either<string, B>): DSL<B> { ... }
```

Added in v3.0.0

# partial (function)

**Signature**

```ts
export function partial<A>(dsls: { [K in keyof A]: DSL<A[K]> }): DSL<Partial<A>> { ... }
```

Added in v3.0.0

# record (function)

**Signature**

```ts
export function record<A>(dsl: DSL<A>): DSL<Record<string, A>> { ... }
```

Added in v3.0.0

# sum (function)

**Signature**

```ts
export function sum<T extends string>(
  tag: T
): <A>(dsls: { [K in keyof A]: DSL<A[K] & Record<T, K>> }) => DSL<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple (function)

**Signature**

```ts
export function tuple<A, B, C, D, E>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>, DSL<E>]): DSL<[A, B, C, D, E]>
export function tuple<A, B, C, D>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>]): DSL<[A, B, C, D]>
export function tuple<A, B, C>(dsls: [DSL<A>, DSL<B>, DSL<C>]): DSL<[A, B, C]>
export function tuple<A, B>(dsls: [DSL<A>, DSL<B>]): DSL<[A, B]>
export function tuple<A>(dsls: [DSL<A>]): DSL<[A]> { ... }
```

Added in v3.0.0

# type (function)

**Signature**

```ts
export function type<A>(dsls: { [K in keyof A]: DSL<A[K]> }): DSL<A> { ... }
```

Added in v3.0.0

# union (function)

**Signature**

```ts
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  dsls: { [K in keyof A]: DSL<A[K]> }
): DSL<A[number]> { ... }
```

Added in v3.0.0
