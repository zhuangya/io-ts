---
title: ArbitraryMutation.ts
nav_order: 2
parent: Modules
---

# ArbitraryMutation overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Model (interface)](#model-interface)
- [ArbitraryMutation (type alias)](#arbitrarymutation-type-alias)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [arbitraryMutation](#arbitrarymutation)
- [array](#array)
- [boolean](#boolean)
- [intersection](#intersection)
- [lazy](#lazy)
- [literals](#literals)
- [literalsOr](#literalsor)
- [make](#make)
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

# Model (interface)

**Signature**

```ts
export interface Model<A> extends fc.Arbitrary<unknown> {
  arb: fc.Arbitrary<A>
}
```

Added in v3.0.0

# ArbitraryMutation (type alias)

**Signature**

```ts
export type ArbitraryMutation<A> = C.Const<Model<A>, A>
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
export const URI: "ArbitraryMutation" = ...
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export const UnknownArray: ArbitraryMutation<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: ArbitraryMutation<Record<string, unknown>> = ...
```

Added in v3.0.0

# arbitraryMutation

**Signature**

```ts
export const arbitraryMutation: S.Schemable<URI> & S.WithLazy<URI> & S.WithRefinement<URI> & S.WithUnion<URI> = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array<A>(mutation: ArbitraryMutation<A>): ArbitraryMutation<Array<A>> { ... }
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: ArbitraryMutation<boolean> = ...
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B, C, D, E>(
  mutations: [
    ArbitraryMutation<A>,
    ArbitraryMutation<B>,
    ArbitraryMutation<C>,
    ArbitraryMutation<D>,
    ArbitraryMutation<E>
  ],
  name?: string
): ArbitraryMutation<A & B & C & D & E>
export function intersection<A, B, C, D>(
  mutations: [ArbitraryMutation<A>, ArbitraryMutation<B>, ArbitraryMutation<C>, ArbitraryMutation<D>],
  name?: string
): ArbitraryMutation<A & B & C & D>
export function intersection<A, B, C>(
  mutations: [ArbitraryMutation<A>, ArbitraryMutation<B>, ArbitraryMutation<C>]
): ArbitraryMutation<A & B & C>
export function intersection<A, B>(mutations: [ArbitraryMutation<A>, ArbitraryMutation<B>]): ArbitraryMutation<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(f: () => ArbitraryMutation<A>): ArbitraryMutation<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): ArbitraryMutation<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends S.Literal, B>(
  values: NonEmptyArray<A>,
  mutation: ArbitraryMutation<B>
): ArbitraryMutation<A | B> { ... }
```

Added in v3.0.0

# make

**Signature**

```ts
export function make<A>(mutation: fc.Arbitrary<unknown>, arb: fc.Arbitrary<A>): ArbitraryMutation<A> { ... }
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: ArbitraryMutation<number> = ...
```

Added in v3.0.0

# parse

**Signature**

```ts
export function parse<A, B>(mutation: ArbitraryMutation<A>, parser: (a: A) => Either<string, B>): ArbitraryMutation<B> { ... }
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(mutations: { [K in keyof A]: ArbitraryMutation<A[K]> }): ArbitraryMutation<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(mutation: ArbitraryMutation<A>): ArbitraryMutation<Record<string, A>> { ... }
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: ArbitraryMutation<string> = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum<T extends string>(
  tag: T
): <A>(
  mutations: { [K in keyof A]: ArbitraryMutation<A[K]> }
) => ArbitraryMutation<{ [K in keyof A]: { [F in T]: K } & A[K] }[keyof A]> { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple<A, B, C, D, E>(
  mutations: [
    ArbitraryMutation<A>,
    ArbitraryMutation<B>,
    ArbitraryMutation<C>,
    ArbitraryMutation<D>,
    ArbitraryMutation<E>
  ]
): ArbitraryMutation<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  mutations: [ArbitraryMutation<A>, ArbitraryMutation<B>, ArbitraryMutation<C>, ArbitraryMutation<D>]
): ArbitraryMutation<[A, B, C, D]>
export function tuple<A, B, C>(
  mutations: [ArbitraryMutation<A>, ArbitraryMutation<B>, ArbitraryMutation<C>]
): ArbitraryMutation<[A, B, C]>
export function tuple<A, B>(mutations: [ArbitraryMutation<A>, ArbitraryMutation<B>]): ArbitraryMutation<[A, B]>
export function tuple<A>(mutations: [ArbitraryMutation<A>]): ArbitraryMutation<[A]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(mutations: { [K in keyof A]: ArbitraryMutation<A[K]> }): ArbitraryMutation<A> { ... }
```

Added in v3.0.0

# union

**Signature**

```ts
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  mutations: { [K in keyof A]: ArbitraryMutation<A[K]> }
): ArbitraryMutation<A[number]> { ... }
```

Added in v3.0.0
