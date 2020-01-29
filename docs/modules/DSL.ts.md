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
- [URI (constant)](#uri-constant)
- [UnknownArray (constant)](#unknownarray-constant)
- [UnknownRecord (constant)](#unknownrecord-constant)
- [boolean (constant)](#boolean-constant)
- [dsl (constant)](#dsl-constant)
- [number (constant)](#number-constant)
- [string (constant)](#string-constant)
- [array (function)](#array-function)
- [intersection (function)](#intersection-function)
- [literals (function)](#literals-function)
- [literalsOr (function)](#literalsor-function)
- [make (function)](#make-function)
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
export type DSL<A> = C.Const<Model, A>
```

Added in v3.0.0

# Model (type alias)

**Signature**

```ts
export type Model =
  | { _tag: 'literals'; values: NonEmptyArray<S.Literal> }
  | { _tag: 'literalsOr'; values: NonEmptyArray<S.Literal>; model: Model }
  | { _tag: 'string' }
  | { _tag: 'number' }
  | { _tag: 'boolean' }
  | { _tag: 'UnknownArray' }
  | { _tag: 'UnknownRecord' }
  | { _tag: 'type'; models: Record<string, Model> }
  | { _tag: 'partial'; models: Record<string, Model> }
  | { _tag: 'record'; model: Model }
  | { _tag: 'array'; model: Model }
  | { _tag: 'tuple'; models: [Model, ...Array<Model>] }
  | { _tag: 'intersection'; models: [Model, Model, ...Array<Model>] }
  | { _tag: 'sum'; tag: string; models: Record<string, Model> }
  | { _tag: 'union'; models: [Model, Model, ...Array<Model>] }
```

Added in v3.0.0

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
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
export const dsl: S.Schemable<URI> & S.WithUnion<URI> = ...
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

# make (function)

**Signature**

```ts
export function make<A>(model: Model): DSL<A> { ... }
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
