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

- is it possible to optimize sum types?

Open questions:

- is it possible to handle `enum`s?
- is it possible to define a Decoder which fails with additional fields?
- is it possible to get only the first error?

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Decoder (interface)](#decoder-interface)
- [IntBrand (interface)](#intbrand-interface)
- [Decoding (type alias)](#decoding-type-alias)
- [Int (type alias)](#int-type-alias)
- [Int (constant)](#int-constant)
- [UnknownArray (constant)](#unknownarray-constant)
- [UnknownRecord (constant)](#unknownrecord-constant)
- [boolean (constant)](#boolean-constant)
- [number (constant)](#number-constant)
- [string (constant)](#string-constant)
- [undefined (constant)](#undefined-constant)
- [array (function)](#array-function)
- [fromRefinement (function)](#fromrefinement-function)
- [intersection (function)](#intersection-function)
- [keyof (function)](#keyof-function)
- [literal (function)](#literal-function)
- [partial (function)](#partial-function)
- [record (function)](#record-function)
- [recursive (function)](#recursive-function)
- [refinement (function)](#refinement-function)
- [tuple (function)](#tuple-function)
- [type (function)](#type-function)
- [union (function)](#union-function)
- [withMessage (function)](#withmessage-function)
- [null (export)](#null-export)

---

# Decoder (interface)

**Signature**

```ts
export interface Decoder<A> {
  readonly name: string
  readonly decode: (u: unknown) => E.Either<DE.DecodeError, A>
}
```

Added in v3.0.0

# IntBrand (interface)

**Signature**

```ts
export interface IntBrand {
  readonly Int: unique symbol
}
```

Added in v3.0.0

# Decoding (type alias)

**Signature**

```ts
export type Decoding<D> = D extends Decoder<infer A> ? A : never
```

Added in v3.0.0

# Int (type alias)

**Signature**

```ts
export type Int = number & IntBrand
```

Added in v3.0.0

# Int (constant)

**Signature**

```ts
export const Int: Decoder<Int> = ...
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

# undefined (constant)

**Signature**

```ts
export const undefined: Decoder<undefined> = ...
```

Added in v3.0.0

# array (function)

**Signature**

```ts
export function array<A>(decoder: Decoder<A>, name?: string): Decoder<Array<A>> { ... }
```

Added in v3.0.0

# fromRefinement (function)

**Signature**

```ts
export function fromRefinement<A>(name: string, refinement: Refinement<unknown, A>): Decoder<A> { ... }
```

Added in v3.0.0

# intersection (function)

**Signature**

```ts
export function intersection<A, B, C, D, E>(
  decoders: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>, Decoder<E>],
  name?: string
): Decoder<A & B & C & D & E>
export function intersection<A, B, C, D>(
  decoders: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>],
  name?: string
): Decoder<A & B & C & D>
export function intersection<A, B, C>(decoders: [Decoder<A>, Decoder<B>, Decoder<C>], name?: string): Decoder<A & B & C>
export function intersection<A, B>(decoders: [Decoder<A>, Decoder<B>], name?: string): Decoder<A & B> { ... }
```

Added in v3.0.0

# keyof (function)

**Signature**

```ts
export function keyof<A>(keys: Record<keyof A, unknown>, name?: string): Decoder<keyof A> { ... }
```

Added in v3.0.0

# literal (function)

**Signature**

```ts
export function literal<L extends string | number | boolean>(literal: L, name?: string): Decoder<L> { ... }
```

Added in v3.0.0

# partial (function)

**Signature**

```ts
export function partial<A>(decoders: { [K in keyof A]: Decoder<A[K]> }, name?: string): Decoder<Partial<A>> { ... }
```

Added in v3.0.0

# record (function)

**Signature**

```ts
export function record<V>(decoder: Decoder<V>, name?: string): Decoder<Record<string, V>> { ... }
```

Added in v3.0.0

# recursive (function)

**Signature**

```ts
export function recursive<A>(name: string, f: () => Decoder<A>): Decoder<A> { ... }
```

Added in v3.0.0

# refinement (function)

**Signature**

```ts
export function refinement<A, B extends A>(
  decoder: Decoder<A>,
  refinement: Refinement<A, B>,
  name: string
): Decoder<B> { ... }
```

Added in v3.0.0

# tuple (function)

**Signature**

```ts
export function tuple<A extends [unknown, ...Array<unknown>]>(
  decoders: { [K in keyof A]: Decoder<A[K]> },
  name?: string
): Decoder<A> { ... }
```

Added in v3.0.0

# type (function)

**Signature**

```ts
export function type<A>(decoders: { [K in keyof A]: Decoder<A[K]> }, name?: string): Decoder<A> { ... }
```

Added in v3.0.0

# union (function)

**Signature**

```ts
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  decoders: { [K in keyof A]: Decoder<A[K]> },
  name?: string
): Decoder<A[number]> { ... }
```

Added in v3.0.0

# withMessage (function)

**Signature**

```ts
export function withMessage<A>(
  decoder: Decoder<A>,
  onError: (input: unknown, e: DE.DecodeError) => string
): Decoder<A> { ... }
```

Added in v3.0.0

# null (export)

**Signature**

```ts
Decoder<null>
```

Added in v3.0.0
