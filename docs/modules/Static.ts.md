---
title: Static.ts
nav_order: 13
parent: Modules
---

# Static overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Static (type alias)](#static-type-alias)
- [URI (type alias)](#uri-type-alias)
- [Int (constant)](#int-constant)
- [URI (constant)](#uri-constant)
- [UnknownArray (constant)](#unknownarray-constant)
- [UnknownRecord (constant)](#unknownrecord-constant)
- [boolean (constant)](#boolean-constant)
- [number (constant)](#number-constant)
- [s (constant)](#s-constant)
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

# Static (type alias)

**Signature**

```ts
export type Static<A> = C.Const<string, A>
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
export const Int: Static<S.Int> = ...
```

Added in v3.0.0

# URI (constant)

**Signature**

```ts
export const URI: "Static" = ...
```

Added in v3.0.0

# UnknownArray (constant)

**Signature**

```ts
export const UnknownArray: Static<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord (constant)

**Signature**

```ts
export const UnknownRecord: Static<Record<string, unknown>> = ...
```

Added in v3.0.0

# boolean (constant)

**Signature**

```ts
export const boolean: Static<boolean> = ...
```

Added in v3.0.0

# number (constant)

**Signature**

```ts
export const number: Static<number> = ...
```

Added in v3.0.0

# s (constant)

**Signature**

```ts
export const s: S.Schemable<URI> & S.WithInt<URI> & S.WithUnion<URI> = ...
```

Added in v3.0.0

# string (constant)

**Signature**

```ts
export const string: Static<string> = ...
```

Added in v3.0.0

# array (function)

**Signature**

```ts
export function array<A>(type: Static<A>): Static<Array<A>> { ... }
```

Added in v3.0.0

# intersection (function)

**Signature**

```ts
export function intersection<A, B, C, D, E>(
  types: [Static<A>, Static<B>, Static<C>, Static<D>, Static<E>]
): Static<A & B & C & D & E>
export function intersection<A, B, C, D>(types: [Static<A>, Static<B>, Static<C>, Static<D>]): Static<A & B & C & D>
export function intersection<A, B, C>(types: [Static<A>, Static<B>, Static<C>]): Static<A & B & C>
export function intersection<A, B>(types: [Static<A>, Static<B>]): Static<A & B> { ... }
```

Added in v3.0.0

# literals (function)

**Signature**

```ts
export function literals<A extends S.Literal>(as: NonEmptyArray<A>): Static<A> { ... }
```

Added in v3.0.0

# literalsOr (function)

**Signature**

```ts
export function literalsOr<A extends S.Literal, B>(as: NonEmptyArray<A>, type: Static<B>): Static<A | B> { ... }
```

Added in v3.0.0

# make (function)

**Signature**

```ts
export function make<A>(s: string): Static<A> { ... }
```

Added in v3.0.0

# partial (function)

**Signature**

```ts
export function partial<A>(types: { [K in keyof A]: Static<A[K]> }): Static<Partial<A>> { ... }
```

Added in v3.0.0

# record (function)

**Signature**

```ts
export function record<A>(type: Static<A>): Static<Record<string, A>> { ... }
```

Added in v3.0.0

# sum (function)

**Signature**

```ts
export function sum<T extends string>(
  _tag: T
): <A>(types: { [K in keyof A]: Static<A[K] & Record<T, K>> }) => Static<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple (function)

**Signature**

```ts
export function tuple<A, B, C, D, E>(
  types: [Static<A>, Static<B>, Static<C>, Static<D>, Static<E>]
): Static<[A, B, C, D, E]>
export function tuple<A, B, C, D>(types: [Static<A>, Static<B>, Static<C>, Static<D>]): Static<[A, B, C, D]>
export function tuple<A, B, C>(types: [Static<A>, Static<B>, Static<C>]): Static<[A, B, C]>
export function tuple<A, B>(types: [Static<A>, Static<B>]): Static<[A, B]>
export function tuple<A>(types: [Static<A>]): Static<[A]> { ... }
```

Added in v3.0.0

# type (function)

**Signature**

```ts
export function type<A>(types: { [K in keyof A]: Static<A[K]> }): Static<A> { ... }
```

Added in v3.0.0

# union (function)

**Signature**

```ts
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  types: { [K in keyof A]: Static<A[K]> }
): Static<A[number]> { ... }
```

Added in v3.0.0
