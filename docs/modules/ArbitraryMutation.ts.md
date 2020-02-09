---
title: ArbitraryMutation.ts
nav_order: 2
parent: Modules
---

# ArbitraryMutation overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [ArbitraryMutation (interface)](#arbitrarymutation-interface)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [arbitraryMutation](#arbitrarymutation)
- [array](#array)
- [boolean](#boolean)
- [intersection](#intersection)
- [lazy](#lazy)
- [literal](#literal)
- [literals](#literals)
- [literalsOr](#literalsor)
- [make](#make)
- [number](#number)
- [parse](#parse)
- [partial](#partial)
- [record](#record)
- [string](#string)
- [sum](#sum)
- [tuple1](#tuple1)
- [tuple2](#tuple2)
- [tuple3](#tuple3)
- [type](#type)
- [union](#union)

---

# ArbitraryMutation (interface)

**Signature**

```ts
export interface ArbitraryMutation<A> {
  /** the mutation */
  mutation: fc.Arbitrary<unknown>
  /** the corresponding valid arbitrary */
  arbitrary: fc.Arbitrary<A>
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
export const arbitraryMutation: S.Schemable<URI> & S.WithUnion<URI> & S.WithParse<URI> = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array<A>(items: ArbitraryMutation<A>): ArbitraryMutation<Array<A>> { ... }
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
export function intersection<A, B>(amA: ArbitraryMutation<A>, amB: ArbitraryMutation<B>): ArbitraryMutation<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(f: () => ArbitraryMutation<A>): ArbitraryMutation<A> { ... }
```

Added in v3.0.0

# literal

**Signature**

```ts
export function literal<A extends Literal>(value: A): ArbitraryMutation<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends Literal>(values: NonEmptyArray<A>): ArbitraryMutation<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends Literal, B>(
  values: NonEmptyArray<A>,
  am: ArbitraryMutation<B>
): ArbitraryMutation<A | B> { ... }
```

Added in v3.0.0

# make

**Signature**

```ts
export function make<A>(mutation: fc.Arbitrary<unknown>, arbitrary: fc.Arbitrary<A>): ArbitraryMutation<A> { ... }
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
export function parse<A, B>(am: ArbitraryMutation<A>, parser: (a: A) => Either<string, B>): ArbitraryMutation<B> { ... }
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(properties: { [K in keyof A]: ArbitraryMutation<A[K]> }): ArbitraryMutation<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(codomain: ArbitraryMutation<A>): ArbitraryMutation<Record<string, A>> { ... }
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
  ams: { [K in keyof A]: ArbitraryMutation<A[K]> }
) => ArbitraryMutation<{ [K in keyof A]: { [F in T]: K } & A[K] }[keyof A]> { ... }
```

Added in v3.0.0

# tuple1

**Signature**

```ts
export function tuple1<A>(itemA: ArbitraryMutation<A>): ArbitraryMutation<[A]> { ... }
```

Added in v3.0.0

# tuple2

**Signature**

```ts
export function tuple2<A, B>(itemA: ArbitraryMutation<A>, itemB: ArbitraryMutation<B>): ArbitraryMutation<[A, B]> { ... }
```

Added in v3.0.0

# tuple3

**Signature**

```ts
export function tuple3<A, B, C>(
  itemA: ArbitraryMutation<A>,
  itemB: ArbitraryMutation<B>,
  itemC: ArbitraryMutation<C>
): ArbitraryMutation<[A, B, C]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(properties: { [K in keyof A]: ArbitraryMutation<A[K]> }): ArbitraryMutation<A> { ... }
```

Added in v3.0.0

# union

**Signature**

```ts
export function union<A extends [unknown, ...Array<unknown>]>(
  ams: { [K in keyof A]: ArbitraryMutation<A[K]> }
): ArbitraryMutation<A[number]> { ... }
```

Added in v3.0.0
