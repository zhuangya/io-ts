---
title: Static.ts
nav_order: 16
parent: Modules
---

# Static overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Model (type alias)](#model-type-alias)
- [Static (type alias)](#static-type-alias)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [array](#array)
- [boolean](#boolean)
- [intersection](#intersection)
- [lazy](#lazy)
- [literals](#literals)
- [literalsOr](#literalsor)
- [number](#number)
- [partial](#partial)
- [record](#record)
- [s](#s)
- [string](#string)
- [sum](#sum)
- [tuple](#tuple)
- [type](#type)
- [union](#union)

---

# Model (type alias)

**Signature**

```ts
export type Model = string
```

Added in v3.0.0

# Static (type alias)

**Signature**

```ts
export type Static<A> = C.Const<IO<Model>, A>
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
export const URI: "Static" = ...
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export const UnknownArray: Static<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: Static<Record<string, unknown>> = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array<A>(type: Static<A>): Static<Array<A>> { ... }
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: Static<boolean> = ...
```

Added in v3.0.0

# intersection

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

# lazy

**Signature**

```ts
export function lazy<A>(f: () => Static<A>): Static<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): Static<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends S.Literal, B>(values: NonEmptyArray<A>, type: Static<B>): Static<A | B> { ... }
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: Static<number> = ...
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(types: { [K in keyof A]: Static<A[K]> }): Static<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(type: Static<A>): Static<Record<string, A>> { ... }
```

Added in v3.0.0

# s

**Signature**

```ts
export const s: S.Schemable<URI> & S.WithUnion<URI> = ...
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: Static<string> = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum<T extends string>(
  _tag: T
): <A>(types: { [K in keyof A]: Static<A[K] & Record<T, K>> }) => Static<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple

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

# type

**Signature**

```ts
export function type<A>(types: { [K in keyof A]: Static<A[K]> }): Static<A> { ... }
```

Added in v3.0.0

# union

**Signature**

```ts
export function union<A extends [unknown, ...Array<unknown>]>(
  types: { [K in keyof A]: Static<A[K]> }
): Static<A[number]> { ... }
```

Added in v3.0.0
