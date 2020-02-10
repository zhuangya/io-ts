---
title: Encoder.ts
nav_order: 8
parent: Modules
---

# Encoder overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Encoder (interface)](#encoder-interface)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [array](#array)
- [contramap](#contramap)
- [encoder](#encoder)
- [id](#id)
- [intersection](#intersection)
- [lazy](#lazy)
- [literalsOr](#literalsor)
- [partial](#partial)
- [record](#record)
- [sum](#sum)
- [tuple2](#tuple2)
- [tuple3](#tuple3)
- [type](#type)

---

# Encoder (interface)

**Signature**

```ts
export interface Encoder<A> {
  readonly encode: (a: A) => unknown
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
export const URI: "Encoder" = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array<A>(items: Encoder<A>): Encoder<Array<A>> { ... }
```

Added in v3.0.0

# contramap

**Signature**

```ts
<A, B>(f: (b: B) => A) => (fa: Encoder<A>) => Encoder<B>
```

Added in v3.0.0

# encoder

**Signature**

```ts
export const encoder: Contravariant1<URI> & S.Schemable<URI> & S.WithRefinement<URI> = ...
```

Added in v3.0.0

# id

**Signature**

```ts
export const id: Encoder<unknown> = ...
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B>(encoderA: Encoder<A>, encoderB: Encoder<B>): Encoder<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(f: () => Encoder<A>): Encoder<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends Literal, B>(as: NonEmptyArray<A>, encoder: Encoder<B>): Encoder<A | B> { ... }
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(properties: { [K in keyof A]: Encoder<A[K]> }): Encoder<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(codomain: Encoder<A>): Encoder<Record<string, A>> { ... }
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum<T extends string>(
  tag: T
): <A>(members: { [K in keyof A]: Encoder<A[K] & Record<T, K>> }) => Encoder<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple2

**Signature**

```ts
export function tuple2<A, B>(itemA: Encoder<A>, itemB: Encoder<B>): Encoder<[A, B]> { ... }
```

Added in v3.0.0

# tuple3

**Signature**

```ts
export function tuple3<A, B, C>(itemA: Encoder<A>, itemB: Encoder<B>, itemC: Encoder<C>): Encoder<[A, B, C]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(properties: { [K in keyof A]: Encoder<A[K]> }): Encoder<A> { ... }
```

Added in v3.0.0
