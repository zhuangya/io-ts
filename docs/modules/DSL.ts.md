---
title: DSL.ts
nav_order: 6
parent: Modules
---

# DSL overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [DSL (type alias)](#dsl-type-alias)
- [Model (type alias)](#model-type-alias)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [array](#array)
- [boolean](#boolean)
- [dsl](#dsl)
- [intersection](#intersection)
- [lazy](#lazy)
- [literals](#literals)
- [literalsOr](#literalsor)
- [number](#number)
- [parse](#parse)
- [partial](#partial)
- [record](#record)
- [string](#string)
- [sum](#sum)
- [tuple](#tuple)
- [type](#type)
- [union](#union)

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

# URI

**Signature**

```ts
export const URI: "DSL" = ...
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export const UnknownArray: DSL<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: DSL<Record<string, unknown>> = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array<A>(dsl: DSL<A>): DSL<Array<A>> { ... }
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: DSL<boolean> = ...
```

Added in v3.0.0

# dsl

**Signature**

```ts
export const dsl: S.Schemable<URI> & S.WithLazy<URI> & S.WithParse<URI> & S.WithUnion<URI> = ...
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B, C, D, E>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>, DSL<E>]): DSL<A & B & C & D & E>
export function intersection<A, B, C, D>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>]): DSL<A & B & C & D>
export function intersection<A, B, C>(dsls: [DSL<A>, DSL<B>, DSL<C>]): DSL<A & B & C>
export function intersection<A, B>(dsls: [DSL<A>, DSL<B>]): DSL<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(f: () => DSL<A>): DSL<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): DSL<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends S.Literal, B>(values: NonEmptyArray<A>, dsl: DSL<B>): DSL<A | B> { ... }
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: DSL<number> = ...
```

Added in v3.0.0

# parse

**Signature**

```ts
export function parse<A, B>(dsl: DSL<A>, parser: (a: A) => E.Either<string, B>): DSL<B> { ... }
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(dsls: { [K in keyof A]: DSL<A[K]> }): DSL<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(dsl: DSL<A>): DSL<Record<string, A>> { ... }
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: DSL<string> = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum<T extends string>(
  tag: T
): <A>(dsls: { [K in keyof A]: DSL<A[K] & Record<T, K>> }) => DSL<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple<A, B, C, D, E>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>, DSL<E>]): DSL<[A, B, C, D, E]>
export function tuple<A, B, C, D>(dsls: [DSL<A>, DSL<B>, DSL<C>, DSL<D>]): DSL<[A, B, C, D]>
export function tuple<A, B, C>(dsls: [DSL<A>, DSL<B>, DSL<C>]): DSL<[A, B, C]>
export function tuple<A, B>(dsls: [DSL<A>, DSL<B>]): DSL<[A, B]>
export function tuple<A>(dsls: [DSL<A>]): DSL<[A]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(dsls: { [K in keyof A]: DSL<A[K]> }): DSL<A> { ... }
```

Added in v3.0.0

# union

**Signature**

```ts
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  dsls: { [K in keyof A]: DSL<A[K]> }
): DSL<A[number]> { ... }
```

Added in v3.0.0
