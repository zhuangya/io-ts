---
title: Codec.ts
nav_order: 3
parent: Modules
---

# Codec overview

Breaking changes:

- remove `brand` combinator
- rename `recursive` to `lazy`
- intersections support two, spreaded arguments
- tuples support up to 3 spreaded arguments

FAQ

- is it possible to provide a custom message?
  - `withMessage` (already existing codecs)
- how to change a field? (for example snake case to camel case)
  - `map`

Open questions:

- is it possible to define a Semigroup for DecodeError?
- is it possible to handle `enum`s?
- is it possible to define a Decoder which fails on additional properties?
- is it possible to get only the first error?
- readonly support?
- Is there a way to generate newtypes?
- Is there a way to generate branded types + smart constructors based on a user provided predicate?

Schemas:

- Schemable<URI>
  - Eq
  - Encoder
  - Codec
- Schemable<URI> & WithUnion<URI>
  - Arbitrary
  - ArbitraryMutation
  - Compat
  - Decoder
  - Guard
  - Expression
  - JsonSchema
  - TypeNode

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
- [literal](#literal)
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

Laws:

1. `pipe(codec.decode(u), E.fold(() => u, codec.encode) = u` for all `u` in `unknown`
2. `codec.decode(codec.encode(a)) = E.right(a)` for all `a` in `A`

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
export function array<A>(items: Codec<A>): Codec<Array<A>> { ... }
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
export const codec: Invariant1<URI> & S.Schemable<URI> = ...
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B>(left: Codec<A>, right: Codec<B>): Codec<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(id: string, f: () => Codec<A>): Codec<A> { ... }
```

Added in v3.0.0

# literal

**Signature**

```ts
export function literal<A extends Literal>(value: A): Codec<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends Literal>(values: ReadonlyNonEmptyArray<A>): Codec<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends Literal, B>(values: ReadonlyNonEmptyArray<A>, or: Codec<B>): Codec<A | B> { ... }
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
export function partial<A>(properties: { [K in keyof A]: Codec<A[K]> }): Codec<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(codomain: Codec<A>): Codec<Record<string, A>> { ... }
```

Added in v3.0.0

# refinement

**Signature**

```ts
export function refinement<A, B extends A>(from: Codec<A>, refinement: (a: A) => a is B, expected: string): Codec<B> { ... }
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
): <A>(members: { [K in keyof A]: Codec<A[K] & Record<T, K>> }) => Codec<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple<A extends ReadonlyArray<unknown>>(...components: { [K in keyof A]: Codec<A[K]> }): Codec<A> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(properties: { [K in keyof A]: Codec<A[K]> }): Codec<A> { ... }
```

Added in v3.0.0

# withExpected

**Signature**

```ts
export function withExpected<A>(
  codec: Codec<A>,
  expected: (actual: unknown, nea: NonEmptyArray<T.Tree<string>>) => NonEmptyArray<T.Tree<string>>
): Codec<A> { ... }
```

Added in v3.0.0
