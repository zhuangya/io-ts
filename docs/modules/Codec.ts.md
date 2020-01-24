---
title: Codec.ts
nav_order: 1
parent: Modules
---

# Codec overview

Breaking changes:

- remove all optional `name` arguments (use `withName` instead)
- `refinement`
  - `name` is mandatory
- remove `brand` combinator
- rename `recursive` to `lazy`

TODO

- refactor DecodeError
- make expected optional
- add composeIso?

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Codec (interface)](#codec-interface)
- [URI (type alias)](#uri-type-alias)
- [Int (constant)](#int-constant)
- [URI (constant)](#uri-constant)
- [UnknownArray (constant)](#unknownarray-constant)
- [UnknownRecord (constant)](#unknownrecord-constant)
- [boolean (constant)](#boolean-constant)
- [codec (constant)](#codec-constant)
- [number (constant)](#number-constant)
- [string (constant)](#string-constant)
- [array (function)](#array-function)
- [fromDecoder (function)](#fromdecoder-function)
- [intersection (function)](#intersection-function)
- [lazy (function)](#lazy-function)
- [literal (function)](#literal-function)
- [literals (function)](#literals-function)
- [make (function)](#make-function)
- [partial (function)](#partial-function)
- [record (function)](#record-function)
- [refinement (function)](#refinement-function)
- [tuple (function)](#tuple-function)
- [type (function)](#type-function)
- [withExpected (function)](#withexpected-function)

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

# Int (constant)

**Signature**

```ts
export const Int: Codec<S.Int> = ...
```

Added in v3.0.0

# URI (constant)

**Signature**

```ts
export const URI: "Codec" = ...
```

Added in v3.0.0

# UnknownArray (constant)

**Signature**

```ts
export const UnknownArray: Codec<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord (constant)

**Signature**

```ts
export const UnknownRecord: Codec<Record<string, unknown>> = ...
```

Added in v3.0.0

# boolean (constant)

**Signature**

```ts
export const boolean: Codec<boolean> = ...
```

Added in v3.0.0

# codec (constant)

**Signature**

```ts
export const codec: Invariant1<URI> & S.Schemable<URI> = ...
```

Added in v3.0.0

# number (constant)

**Signature**

```ts
export const number: Codec<number> = ...
```

Added in v3.0.0

# string (constant)

**Signature**

```ts
export const string: Codec<string> = ...
```

Added in v3.0.0

# array (function)

**Signature**

```ts
export function array<A>(codec: Codec<A>): Codec<Array<A>> { ... }
```

Added in v3.0.0

# fromDecoder (function)

**Signature**

```ts
export function fromDecoder<A>(decoder: D.Decoder<A>): Codec<A> { ... }
```

Added in v3.0.0

# intersection (function)

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

# lazy (function)

**Signature**

```ts
export function lazy<A>(f: () => Codec<A>): Codec<A> { ... }
```

Added in v3.0.0

# literal (function)

**Signature**

```ts
export function literal<A extends string | number | boolean | null | undefined>(a: A): Codec<A> { ... }
```

Added in v3.0.0

# literals (function)

**Signature**

```ts
export function literals<A extends string | number | boolean | null | undefined>(as: Array<A>): Codec<A> { ... }
```

Added in v3.0.0

# make (function)

**Signature**

```ts
export function make<A>(decoder: D.Decoder<A>, encoder: E.Encoder<A>): Codec<A> { ... }
```

Added in v3.0.0

# partial (function)

**Signature**

```ts
export function partial<A>(codecs: { [K in keyof A]: Codec<A[K]> }): Codec<Partial<A>> { ... }
```

Added in v3.0.0

# record (function)

**Signature**

```ts
export function record<A>(codec: Codec<A>): Codec<Record<string, A>> { ... }
```

Added in v3.0.0

# refinement (function)

**Signature**

```ts
export function refinement<A, B extends A>(codec: Codec<A>, refinement: Refinement<A, B>, expected: string): Codec<B> { ... }
```

Added in v3.0.0

# tuple (function)

**Signature**

```ts
export function tuple<A, B, C, D, E>(codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>, Codec<E>]): Codec<[A, B, C, D, E]>
export function tuple<A, B, C, D>(codecs: [Codec<A>, Codec<B>, Codec<C>, Codec<D>]): Codec<[A, B, C, D]>
export function tuple<A, B, C>(codecs: [Codec<A>, Codec<B>, Codec<C>]): Codec<[A, B, C]>
export function tuple<A, B>(codecs: [Codec<A>, Codec<B>]): Codec<[A, B]>
export function tuple<A>(codecs: [Codec<A>]): Codec<[A]> { ... }
```

Added in v3.0.0

# type (function)

**Signature**

```ts
export function type<A>(codecs: { [K in keyof A]: Codec<A[K]> }): Codec<A> { ... }
```

Added in v3.0.0

# withExpected (function)

**Signature**

```ts
export function withExpected<A>(codec: Codec<A>, expected: string): Codec<A> { ... }
```

Added in v3.0.0
