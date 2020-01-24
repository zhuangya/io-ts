---
title: Decoder.ts
nav_order: 3
parent: Modules
---

# Decoder overview

FAQ

- is it possible to provide a custom message?
  - yes, use `withMessage`
- how to change a field? (for example snake case to camel case)
  - mapping

Open problems:

- is it possible to optimize unions (sum types)?

Open questions:

- is it possible to define a Semigroup for DecodeError?
- is it possible to handle `enum`s?
- is it possible to define a Decoder which fails with additional fields?
- is it possible to get only the first error?
- readonly?

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Decoder (interface)](#decoder-interface)
- [TypeOf (type alias)](#typeof-type-alias)
- [URI (type alias)](#uri-type-alias)
- [Int (constant)](#int-constant)
- [URI (constant)](#uri-constant)
- [UnknownArray (constant)](#unknownarray-constant)
- [UnknownRecord (constant)](#unknownrecord-constant)
- [boolean (constant)](#boolean-constant)
- [decoder (constant)](#decoder-constant)
- [number (constant)](#number-constant)
- [string (constant)](#string-constant)
- [array (function)](#array-function)
- [fromRefinement (function)](#fromrefinement-function)
- [intersection (function)](#intersection-function)
- [lazy (function)](#lazy-function)
- [literal (function)](#literal-function)
- [partial (function)](#partial-function)
- [record (function)](#record-function)
- [refinement (function)](#refinement-function)
- [tuple (function)](#tuple-function)
- [type (function)](#type-function)
- [union (function)](#union-function)
- [withExpected (function)](#withexpected-function)
- [alt (export)](#alt-export)
- [ap (export)](#ap-export)
- [apFirst (export)](#apfirst-export)
- [apSecond (export)](#apsecond-export)
- [map (export)](#map-export)

---

# Decoder (interface)

**Signature**

```ts
export interface Decoder<A> {
  readonly decode: (u: unknown) => E.Either<DE.DecodeError, A>
}
```

Added in v3.0.0

# TypeOf (type alias)

**Signature**

```ts
export type TypeOf<D> = D extends Decoder<infer A> ? A : never
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
export const Int: Decoder<S.Int> = ...
```

Added in v3.0.0

# URI (constant)

**Signature**

```ts
export const URI: "Decoder" = ...
```

Added in v3.0.0

# UnknownArray (constant)

**Signature**

```ts
export const UnknownArray: Decoder<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord (constant)

**Signature**

```ts
export const UnknownRecord: Decoder<Record<string, unknown>> = ...
```

Added in v3.0.0

# boolean (constant)

**Signature**

```ts
export const boolean: Decoder<boolean> = ...
```

Added in v3.0.0

# decoder (constant)

**Signature**

```ts
export const decoder: Applicative1<URI> & Alt1<URI> & S.Schemable<URI> & S.WithUnion<URI> = ...
```

Added in v3.0.0

# number (constant)

**Signature**

```ts
export const number: Decoder<number> = ...
```

Added in v3.0.0

# string (constant)

**Signature**

```ts
export const string: Decoder<string> = ...
```

Added in v3.0.0

# array (function)

**Signature**

```ts
export function array<A>(decoder: Decoder<A>): Decoder<Array<A>> { ... }
```

Added in v3.0.0

# fromRefinement (function)

**Signature**

```ts
export function fromRefinement<A>(refinement: Refinement<unknown, A>, expected: string): Decoder<A> { ... }
```

Added in v3.0.0

# intersection (function)

**Signature**

```ts
export function intersection<A, B, C, D, E>(
  decoders: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>, Decoder<E>]
): Decoder<A & B & C & D & E>
export function intersection<A, B, C, D>(
  decoders: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>]
): Decoder<A & B & C & D>
export function intersection<A, B, C>(decoders: [Decoder<A>, Decoder<B>, Decoder<C>]): Decoder<A & B & C>
export function intersection<A, B>(decoders: [Decoder<A>, Decoder<B>]): Decoder<A & B> { ... }
```

Added in v3.0.0

# lazy (function)

**Signature**

```ts
export function lazy<A>(f: () => Decoder<A>): Decoder<A> { ... }
```

Added in v3.0.0

# literal (function)

**Signature**

```ts
export function literal<A extends string | number | boolean | null | undefined>(as: Array<A>): Decoder<A> { ... }
```

Added in v3.0.0

# partial (function)

**Signature**

```ts
export function partial<A>(decoders: { [K in keyof A]: Decoder<A[K]> }): Decoder<Partial<A>> { ... }
```

Added in v3.0.0

# record (function)

**Signature**

```ts
export function record<A>(decoder: Decoder<A>): Decoder<Record<string, A>> { ... }
```

Added in v3.0.0

# refinement (function)

**Signature**

```ts
export function refinement<A, B extends A>(
  decoder: Decoder<A>,
  refinement: Refinement<A, B>,
  expected: string
): Decoder<B> { ... }
```

Added in v3.0.0

# tuple (function)

**Signature**

```ts
export function tuple<A, B, C, D, E>(
  decoders: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>, Decoder<E>]
): Decoder<[A, B, C, D, E]>
export function tuple<A, B, C, D>(decoders: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>]): Decoder<[A, B, C, D]>
export function tuple<A, B, C>(decoders: [Decoder<A>, Decoder<B>, Decoder<C>]): Decoder<[A, B, C]>
export function tuple<A, B>(decoders: [Decoder<A>, Decoder<B>]): Decoder<[A, B]>
export function tuple<A>(decoders: [Decoder<A>]): Decoder<[A]> { ... }
```

Added in v3.0.0

# type (function)

**Signature**

```ts
export function type<A>(decoders: { [K in keyof A]: Decoder<A[K]> }): Decoder<A> { ... }
```

Added in v3.0.0

# union (function)

**Signature**

```ts
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  decoders: { [K in keyof A]: Decoder<A[K]> }
): Decoder<A[number]> { ... }
```

Added in v3.0.0

# withExpected (function)

**Signature**

```ts
export function withExpected<A>(decoder: Decoder<A>, expected: string): Decoder<A> { ... }
```

Added in v3.0.0

# alt (export)

**Signature**

```ts
<A>(that: () => Decoder<A>) => (fa: Decoder<A>) => Decoder<A>
```

Added in v3.0.0

# ap (export)

**Signature**

```ts
<A>(fa: Decoder<A>) => <B>(fab: Decoder<(a: A) => B>) => Decoder<B>
```

Added in v3.0.0

# apFirst (export)

**Signature**

```ts
<B>(fb: Decoder<B>) => <A>(fa: Decoder<A>) => Decoder<A>
```

Added in v3.0.0

# apSecond (export)

**Signature**

```ts
<B>(fb: Decoder<B>) => <A>(fa: Decoder<A>) => Decoder<B>
```

Added in v3.0.0

# map (export)

**Signature**

```ts
<A, B>(f: (a: A) => B) => (fa: Decoder<A>) => Decoder<B>
```

Added in v3.0.0
