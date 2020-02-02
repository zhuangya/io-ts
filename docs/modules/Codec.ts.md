---
title: Codec.ts
nav_order: 3
parent: Modules
---

# Codec overview

Breaking changes:

- remove all optional `name` arguments (use `withName` instead)
- remove `brand` combinator
- rename `recursive` to `lazy`

FAQ

- is it possible to provide a custom message?
  - `refinement`
  - `withMessage` (already existing codecs)
- how to change a field? (for example snake case to camel case)
  - `map`

Open problems:

- is it possible to optimize unions (sum types)?

Open questions:

- is it possible to define a Semigroup for DecodeError?
- is it possible to handle `enum`s?
- is it possible to define a Decoder which fails on additional fields?
- is it possible to get only the first error?
- readonly?
- does it support recursion in schemas?
- Is there a way to generate newtypes?
- Is there a way to generate branded types + smart constructors based on a user provided predicate?

Schemas:

- S.Schemable<URI> & S.WithRefinement<URI>
  - Codec
  - Encoder
  - Eq
- S.Schemable<URI> & S.WithUnion<URI>
  - JsonSchema
  - Static
- S.Schemable<URI> & S.WithRefinement<URI> & S.WithUnion<URI>
  - Arbitrary
  - ArbitraryMutation
  - Decoder
  - Guard
  - DSL

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Codec (interface)](#codec-interface)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [array](#array)
- [boolean](#boolean)
- [codec](#codec)
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
- [withExpected](#withexpected)

---

# Codec (interface)

**Signature**

```ts
export interface Codec<A> extends D.Decoder<A>, E.Encoder<A> {}
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
export const URI: "Codec" = ...
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export const UnknownArray: Codec<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: Codec<Record<string, unknown>> = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array<A>(codec: Codec<A>): Codec<Array<A>> { ... }
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: Codec<boolean> = ...
```

Added in v3.0.0

# codec

**Signature**

```ts
export const codec: Invariant1<URI> & S.Schemable<URI> & S.WithRefinement<URI> = ...
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B, C, D, E>(
  codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>, Codec<E>],
  name?: string
): Codec<A & B & C & D & E>
export function intersection<A, B, C, D>(
  codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>],
  name?: string
): Codec<A & B & C & D>
export function intersection<A, B, C>(codecs: [Codec<A>, Codec<B>, Codec<C>]): Codec<A & B & C>
export function intersection<A, B>(codecs: [Codec<A>, Codec<B>]): Codec<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(f: () => Codec<A>): Codec<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): Codec<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends S.Literal, B>(values: NonEmptyArray<A>, codec: Codec<B>): Codec<A | B> { ... }
```

Added in v3.0.0

# make

**Signature**

```ts
export function make<A>(decoder: D.Decoder<A>, encoder: E.Encoder<A>): Codec<A> { ... }
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: Codec<number> = ...
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(codecs: { [K in keyof A]: Codec<A[K]> }): Codec<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(codec: Codec<A>): Codec<Record<string, A>> { ... }
```

Added in v3.0.0

# refinement

**Signature**

```ts
export function refinement<A, B extends A>(codec: Codec<A>, parser: (a: A) => Either<string, B>): Codec<B> { ... }
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: Codec<string> = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum<T extends string>(
  tag: T
): <A>(codecs: { [K in keyof A]: Codec<A[K] & Record<T, K>> }) => Codec<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple<A, B, C, D, E>(codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>, Codec<E>]): Codec<[A, B, C, D, E]>
export function tuple<A, B, C, D>(codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>]): Codec<[A, B, C, D]>
export function tuple<A, B, C>(codecs: [Codec<A>, Codec<B>, Codec<C>]): Codec<[A, B, C]>
export function tuple<A, B>(codecs: [Codec<A>, Codec<B>]): Codec<[A, B]>
export function tuple<A>(codecs: [Codec<A>]): Codec<[A]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(codecs: { [K in keyof A]: Codec<A[K]> }): Codec<A> { ... }
```

Added in v3.0.0

# withExpected

**Signature**

```ts
export function withExpected<A>(codec: Codec<A>, expected: string): Codec<A> { ... }
```

Added in v3.0.0
