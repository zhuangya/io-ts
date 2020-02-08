---
title: Guard.ts
nav_order: 10
parent: Modules
---

# Guard overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Guard (interface)](#guard-interface)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [array](#array)
- [boolean](#boolean)
- [guard](#guard)
- [intersection](#intersection)
- [lazy](#lazy)
- [literal](#literal)
- [literals](#literals)
- [literalsOr](#literalsor)
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

# Guard (interface)

**Signature**

```ts
export interface Guard<A> {
  is: (u: unknown) => u is A
}
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
export const URI: "Guard" = ...
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export const UnknownArray: Guard<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: Guard<Record<string, unknown>> = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array<A>(items: Guard<A>): Guard<Array<A>> { ... }
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: Guard<boolean> = ...
```

Added in v3.0.0

# guard

**Signature**

```ts
export const guard: S.Schemable<URI> & S.WithUnion<URI> & S.WithRefinement<URI> = ...
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B, C, D, E>(
  guards: [Guard<A>, Guard<B>, Guard<C>, Guard<D>, Guard<E>]
): Guard<A & B & C & D & E>
export function intersection<A, B, C, D>(guards: [Guard<A>, Guard<B>, Guard<C>, Guard<D>]): Guard<A & B & C & D>
export function intersection<A, B, C>(guards: [Guard<A>, Guard<B>, Guard<C>]): Guard<A & B & C>
export function intersection<A, B>(guards: [Guard<A>, Guard<B>]): Guard<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(f: () => Guard<A>): Guard<A> { ... }
```

Added in v3.0.0

# literal

**Signature**

```ts
export function literal<A extends S.Literal>(value: A): Guard<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): Guard<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends S.Literal, B>(values: NonEmptyArray<A>, guard: Guard<B>): Guard<A | B> { ... }
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: Guard<number> = ...
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(properties: { [K in keyof A]: Guard<A[K]> }): Guard<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(codomain: Guard<A>): Guard<Record<string, A>> { ... }
```

Added in v3.0.0

# refinement

**Signature**

```ts
export function refinement<A, B extends A>(guard: Guard<A>, parser: (a: A) => Either<string, B>): Guard<B> { ... }
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: Guard<string> = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum<T extends string>(
  tag: T
): <A>(guards: { [K in keyof A]: Guard<A[K] & Record<T, K>> }) => Guard<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple<A, B, C, D, E>(items: [Guard<A>, Guard<B>, Guard<C>, Guard<D>, Guard<E>]): Guard<[A, B, C, D, E]>
export function tuple<A, B, C, D>(items: [Guard<A>, Guard<B>, Guard<C>, Guard<D>]): Guard<[A, B, C, D]>
export function tuple<A, B, C>(items: [Guard<A>, Guard<B>, Guard<C>]): Guard<[A, B, C]>
export function tuple<A, B>(items: [Guard<A>, Guard<B>]): Guard<[A, B]>
export function tuple<A>(items: [Guard<A>]): Guard<[A]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(properties: { [K in keyof A]: Guard<A[K]> }): Guard<A> { ... }
```

Added in v3.0.0

# union

**Signature**

```ts
export function union<A extends [unknown, ...Array<unknown>]>(
  guards: { [K in keyof A]: Guard<A[K]> }
): Guard<A[number]> { ... }
```

Added in v3.0.0
