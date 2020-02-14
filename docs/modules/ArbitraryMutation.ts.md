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
- [readonly](#readonly)
- [record](#record)
- [string](#string)
- [sum](#sum)
- [tuple](#tuple)
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
export function intersection<A, B>(left: ArbitraryMutation<A>, right: ArbitraryMutation<B>): ArbitraryMutation<A & B> { ... }
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
export function literals<A extends Literal>(values: U.ReadonlyNonEmptyArray<A>): ArbitraryMutation<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends Literal, B>(
  values: U.ReadonlyNonEmptyArray<A>,
  or: ArbitraryMutation<B>
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
export function parse<A, B>(from: ArbitraryMutation<A>, parser: (a: A) => Either<string, B>): ArbitraryMutation<B> { ... }
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(properties: { [K in keyof A]: ArbitraryMutation<A[K]> }): ArbitraryMutation<Partial<A>> { ... }
```

Added in v3.0.0

# readonly

**Signature**

```ts
export function readonly<A>(mutable: ArbitraryMutation<A>): ArbitraryMutation<Readonly<A>> { ... }
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
): <A>(members: { [K in keyof A]: ArbitraryMutation<A[K] & Record<T, K>> }) => ArbitraryMutation<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple<A, B>(left: ArbitraryMutation<A>, right: ArbitraryMutation<B>): ArbitraryMutation<[A, B]> { ... }
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
export function union<A extends U.ReadonlyNonEmptyTuple<unknown>>(
  members: { [K in keyof A]: ArbitraryMutation<A[K]> }
): ArbitraryMutation<A[number]> { ... }
```

Added in v3.0.0
