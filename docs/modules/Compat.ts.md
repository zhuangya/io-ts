---
title: Compat.ts
nav_order: 4
parent: Modules
---

# Compat overview

Missing

- `pipe` method
- `null` primitive
- `undefined` primitive
- `void` primitive
- `unknown` primitive

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Compat (interface)](#compat-interface)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [array](#array)
- [boolean](#boolean)
- [compat](#compat)
- [intersection](#intersection)
- [lazy](#lazy)
- [literals](#literals)
- [literalsOr](#literalsor)
- [make](#make)
- [number](#number)
- [partial](#partial)
- [record](#record)
- [refinement](#refinement)
- [string](#string)
- [sum](#sum)
- [tuple](#tuple)
- [type](#type)
- [union](#union)

---

# Compat (interface)

Laws: same as `Codec`

**Signature**

```ts
export interface Compat<A> extends Codec<A>, Guard<A> {}
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
export const URI: "Compat" = ...
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export const UnknownArray: Compat<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: Compat<Record<string, unknown>> = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array<A>(items: Compat<A>, id?: string): Compat<Array<A>> { ... }
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: Compat<boolean> = ...
```

Added in v3.0.0

# compat

**Signature**

```ts
export const compat: Schemable<URI> & WithRefinement<URI> & WithUnion<URI> = ...
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B, C, D, E>(
  compats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>, Compat<E>],
  id?: string
): Compat<A & B & C & D & E>
export function intersection<A, B, C, D>(
  compats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>],
  id?: string
): Compat<A & B & C & D>
export function intersection<A, B, C>(compats: [Compat<A>, Compat<B>, Compat<C>], id?: string): Compat<A & B & C>
export function intersection<A, B>(compats: [Compat<A>, Compat<B>], id?: string): Compat<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(id: string, f: () => Compat<A>): Compat<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends Literal>(values: NonEmptyArray<A>, id?: string): Compat<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends Literal, B>(
  values: NonEmptyArray<A>,
  compat: Compat<B>,
  id?: string
): Compat<A | B> { ... }
```

Added in v3.0.0

# make

**Signature**

```ts
export function make<A>(codec: Codec<A>, guard: Guard<A>): Compat<A> { ... }
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: Compat<number> = ...
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(fields: { [K in keyof A]: Compat<A[K]> }, id?: string): Compat<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(codomain: Compat<A>, id?: string): Compat<Record<string, A>> { ... }
```

Added in v3.0.0

# refinement

**Signature**

```ts
export function refinement<A, B extends A>(
  compat: Compat<A>,
  parser: (a: A) => Either<string, B>,
  id?: string
): Compat<B> { ... }
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: Compat<string> = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum<T extends string>(
  tag: T
): <A>(compats: { [K in keyof A]: Compat<A[K] & Record<T, K>> }, id?: string) => Compat<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple<A, B, C, D, E>(
  items: [Compat<A>, Compat<B>, Compat<C>, Compat<D>, Compat<E>],
  id?: string
): Compat<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  compitemsats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>],
  id?: string
): Compat<[A, B, C, D]>
export function tuple<A, B, C>(items: [Compat<A>, Compat<B>, Compat<C>], id?: string): Compat<[A, B, C]>
export function tuple<A, B>(compats: [Compat<A>, Compat<B>], id?: string): Compat<[A, B]>
export function tuple<A>(items: [Compat<A>], id?: string): Compat<[A]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(fields: { [K in keyof A]: Compat<A[K]> }, id?: string): Compat<A> { ... }
```

Added in v3.0.0

# union

**Signature**

```ts
export function union<A extends [unknown, ...Array<unknown>]>(
  compats: { [K in keyof A]: Compat<A[K]> },
  id?: string
): Compat<A[number]> { ... }
```

Added in v3.0.0
