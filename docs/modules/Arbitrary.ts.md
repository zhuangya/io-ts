---
title: Arbitrary.ts
nav_order: 1
parent: Modules
---

# Arbitrary overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [URI (type alias)](#uri-type-alias)
- [Int (constant)](#int-constant)
- [URI (constant)](#uri-constant)
- [UnknownArray (constant)](#unknownarray-constant)
- [UnknownRecord (constant)](#unknownrecord-constant)
- [arbitrary (constant)](#arbitrary-constant)
- [boolean (constant)](#boolean-constant)
- [number (constant)](#number-constant)
- [string (constant)](#string-constant)
- [array (function)](#array-function)
- [intersection (function)](#intersection-function)
- [literals (function)](#literals-function)
- [literalsOr (function)](#literalsor-function)
- [parse (function)](#parse-function)
- [partial (function)](#partial-function)
- [record (function)](#record-function)
- [sum (function)](#sum-function)
- [tuple (function)](#tuple-function)
- [type (function)](#type-function)
- [union (function)](#union-function)

---

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v3.0.0

# Int (constant)

**Signature**

```ts
export const Int: Arbitrary<S.Int> = ...
```

Added in v3.0.0

# URI (constant)

**Signature**

```ts
export const URI: "Arbitrary" = ...
```

Added in v3.0.0

# UnknownArray (constant)

**Signature**

```ts
export const UnknownArray: Arbitrary<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord (constant)

**Signature**

```ts
export const UnknownRecord: Arbitrary<Record<string, unknown>> = ...
```

Added in v3.0.0

# arbitrary (constant)

**Signature**

```ts
export const arbitrary: S.Schemable<URI> & S.WithInt<URI> & S.WithParse<URI> & S.WithUnion<URI> = ...
```

Added in v3.0.0

# boolean (constant)

**Signature**

```ts
export const boolean: Arbitrary<boolean> = ...
```

Added in v3.0.0

# number (constant)

**Signature**

```ts
export const number: Arbitrary<number> = ...
```

Added in v3.0.0

# string (constant)

**Signature**

```ts
export const string: Arbitrary<string> = ...
```

Added in v3.0.0

# array (function)

**Signature**

```ts
export function array<A>(arb: Arbitrary<A>): Arbitrary<Array<A>> { ... }
```

Added in v3.0.0

# intersection (function)

**Signature**

```ts
export function intersection<A, B, C, D, E>(
  arbs: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>, Arbitrary<D>, Arbitrary<E>],
  name?: string
): Arbitrary<A & B & C & D & E>
export function intersection<A, B, C, D>(
  arbs: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>, Arbitrary<D>],
  name?: string
): Arbitrary<A & B & C & D>
export function intersection<A, B, C>(arbs: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>]): Arbitrary<A & B & C>
export function intersection<A, B>(arbs: [Arbitrary<A>, Arbitrary<B>]): Arbitrary<A & B> { ... }
```

Added in v3.0.0

# literals (function)

**Signature**

```ts
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): Arbitrary<A> { ... }
```

Added in v3.0.0

# literalsOr (function)

**Signature**

```ts
export function literalsOr<A extends S.Literal, B>(values: NonEmptyArray<A>, arb: Arbitrary<B>): Arbitrary<A | B> { ... }
```

Added in v3.0.0

# parse (function)

**Signature**

```ts
export function parse<A, B>(arb: Arbitrary<A>, parser: (a: A) => Either<string, B>): Arbitrary<B> { ... }
```

Added in v3.0.0

# partial (function)

**Signature**

```ts
export function partial<A>(arbs: { [K in keyof A]: Arbitrary<A[K]> }): Arbitrary<Partial<A>> { ... }
```

Added in v3.0.0

# record (function)

**Signature**

```ts
export function record<A>(arb: Arbitrary<A>): Arbitrary<Record<string, A>> { ... }
```

Added in v3.0.0

# sum (function)

**Signature**

```ts
export function sum<T extends string>(
  tag: T
): <A>(arbs: { [K in keyof A]: Arbitrary<A[K]> }) => Arbitrary<{ [K in keyof A]: { [F in T]: K } & A[K] }[keyof A]> { ... }
```

Added in v3.0.0

# tuple (function)

**Signature**

```ts
export function tuple<A, B, C, D, E>(
  arbs: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>, Arbitrary<D>, Arbitrary<E>]
): Arbitrary<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  arbs: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>, Arbitrary<D>]
): Arbitrary<[A, B, C, D]>
export function tuple<A, B, C>(arbs: [Arbitrary<A>, Arbitrary<B>, Arbitrary<C>]): Arbitrary<[A, B, C]>
export function tuple<A, B>(arbs: [Arbitrary<A>, Arbitrary<B>]): Arbitrary<[A, B]>
export function tuple<A>(arbs: [Arbitrary<A>]): Arbitrary<[A]> { ... }
```

Added in v3.0.0

# type (function)

**Signature**

```ts
export function type<A>(arbs: { [K in keyof A]: Arbitrary<A[K]> }): Arbitrary<A> { ... }
```

Added in v3.0.0

# union (function)

**Signature**

```ts
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  arbs: { [K in keyof A]: Arbitrary<A[K]> }
): Arbitrary<A[number]> { ... }
```

Added in v3.0.0
