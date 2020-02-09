---
title: Arbitrary.ts
nav_order: 1
parent: Modules
---

# Arbitrary overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Arbitrary (interface)](#arbitrary-interface)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [arbitrary](#arbitrary)
- [array](#array)
- [boolean](#boolean)
- [intersection](#intersection)
- [lazy](#lazy)
- [literal](#literal)
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

# Arbitrary (interface)

**Signature**

```ts
export interface Arbitrary<A> extends fc.Arbitrary<A> {}
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
export const URI: "Arbitrary" = ...
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export const UnknownArray: Arbitrary<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: Arbitrary<Record<string, unknown>> = ...
```

Added in v3.0.0

# arbitrary

**Signature**

```ts
export const arbitrary: S.Schemable<URI> & S.WithUnion<URI> & S.WithParse<URI> = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array<A>(items: Arbitrary<A>): Arbitrary<Array<A>> { ... }
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: Arbitrary<boolean> = ...
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B>(arbitraryA: Arbitrary<A>, arbitraryB: Arbitrary<B>): Arbitrary<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(f: () => Arbitrary<A>): Arbitrary<A> { ... }
```

Added in v3.0.0

# literal

**Signature**

```ts
export function literal<A extends Literal>(value: A): Arbitrary<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends Literal>(values: NonEmptyArray<A>): Arbitrary<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends Literal, B>(values: NonEmptyArray<A>, arb: Arbitrary<B>): Arbitrary<A | B> { ... }
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: Arbitrary<number> = ...
```

Added in v3.0.0

# parse

**Signature**

```ts
export function parse<A, B>(arb: Arbitrary<A>, parser: (a: A) => Either<string, B>): Arbitrary<B> { ... }
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(properties: { [K in keyof A]: Arbitrary<A[K]> }): Arbitrary<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(codomain: Arbitrary<A>): Arbitrary<Record<string, A>> { ... }
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: Arbitrary<string> = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum<T extends string>(
  _tag: T
): <A>(arbs: { [K in keyof A]: Arbitrary<A[K]> }) => Arbitrary<{ [K in keyof A]: { [F in T]: K } & A[K] }[keyof A]> { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple<A, B, C, D, E>(
  items: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>, Arbitrary<D>, Arbitrary<E>]
): Arbitrary<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  items: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>, Arbitrary<D>]
): Arbitrary<[A, B, C, D]>
export function tuple<A, B, C>(items: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>]): Arbitrary<[A, B, C]>
export function tuple<A, B>(items: [Arbitrary<A>, Arbitrary<B>]): Arbitrary<[A, B]>
export function tuple<A>(items: [Arbitrary<A>]): Arbitrary<[A]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(properties: { [K in keyof A]: Arbitrary<A[K]> }): Arbitrary<A> { ... }
```

Added in v3.0.0

# union

**Signature**

```ts
export function union<A extends [unknown, ...Array<unknown>]>(
  arbs: { [K in keyof A]: Arbitrary<A[K]> }
): Arbitrary<A[number]> { ... }
```

Added in v3.0.0
