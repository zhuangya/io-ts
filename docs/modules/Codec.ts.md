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
- S.Schemable<URI> & S.WithUnion<URI> & S.WithRefinement<URI>
  - Compat
  - Guard
- S.Schemable<URI> & S.WithUnion<URI> & S.WithParse<URI>
  - Arbitrary
  - ArbitraryMutation
  - Decoder

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
- [withMessage](#withmessage)

---

# Codec (interface)

Laws:

1. `pipe(codec.decode(u), E.fold(() => u, codec.encode) = u` for all `u` in `unknown`
2. `codec.decode(codec.encode(a)) = E.right(a)` for all `a` in `A`

**Signature**

```ts
export interface Codec<A> extends Decoder<A>, Encoder<A> {}
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
export function array<A>(codec: Codec<A>, id?: string): Codec<Array<A>> { ... }
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
export const codec: Invariant1<URI> & Schemable<URI> & WithRefinement<URI> = ...
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B, C, D, E>(
  codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>, Codec<E>],
  id?: string
): Codec<A & B & C & D & E>
export function intersection<A, B, C, D>(
  codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>],
  id?: string
): Codec<A & B & C & D>
export function intersection<A, B, C>(codecs: [Codec<A>, Codec<B>, Codec<C>], id?: string): Codec<A & B & C>
export function intersection<A, B>(codecs: [Codec<A>, Codec<B>], id?: string): Codec<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(id: string, f: () => Codec<A>): Codec<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends Literal>(values: NonEmptyArray<A>, id?: string): Codec<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends Literal, B>(values: NonEmptyArray<A>, codec: Codec<B>, id?: string): Codec<A | B> { ... }
```

Added in v3.0.0

# make

**Signature**

```ts
export function make<A>(decoder: Decoder<A>, encoder: Encoder<A>): Codec<A> { ... }
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
export function partial<A>(codecs: { [K in keyof A]: Codec<A[K]> }, id?: string): Codec<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(codec: Codec<A>, id?: string): Codec<Record<string, A>> { ... }
```

Added in v3.0.0

# refinement

**Signature**

```ts
export function refinement<A, B extends A>(
  codec: Codec<A>,
  parser: (a: A) => Either<string, B>,
  id?: string
): Codec<B> { ... }
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
): <A>(codecs: { [K in keyof A]: Codec<A[K] & Record<T, K>> }, id?: string) => Codec<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple<A, B, C, D, E>(
  codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>, Codec<E>],
  id?: string
): Codec<[A, B, C, D, E]>
export function tuple<A, B, C, D>(codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>], id?: string): Codec<[A, B, C, D]>
export function tuple<A, B, C>(codecs: [Codec<A>, Codec<B>, Codec<C>], id?: string): Codec<[A, B, C]>
export function tuple<A, B>(codecs: [Codec<A>, Codec<B>], id?: string): Codec<[A, B]>
export function tuple<A>(codecs: [Codec<A>], id?: string): Codec<[A]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(codecs: { [K in keyof A]: Codec<A[K]> }, id?: string): Codec<A> { ... }
```

Added in v3.0.0

# withMessage

**Signature**

```ts
export function withMessage<A>(codec: Codec<A>, message: (e: DE.DecodeError) => string): Codec<A> { ... }
```

Added in v3.0.0
