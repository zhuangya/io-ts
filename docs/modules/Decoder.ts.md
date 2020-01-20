---
title: Decoder.ts
nav_order: 2
parent: Modules
---

# Decoder overview

Missing combinators:

- keyof
- brand
- `Int` decoder
- recursive

Open questions:

- is it possible to handle `enum`s?
- how to change a field? (for example snake case to camel case)
- is it possible to define a Decoder which fails with additional fields?
- is it possible to get only the first error?
- is it possible to define sum types?

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Decoder (interface)](#decoder-interface)
- [Decoding (type alias)](#decoding-type-alias)
- [UnknownArray (constant)](#unknownarray-constant)
- [UnknownRecord (constant)](#unknownrecord-constant)
- [boolean (constant)](#boolean-constant)
- [number (constant)](#number-constant)
- [string (constant)](#string-constant)
- [array (function)](#array-function)
- [intersection (function)](#intersection-function)
- [literal (function)](#literal-function)
- [partial (function)](#partial-function)
- [record (function)](#record-function)
- [refinement (function)](#refinement-function)
- [tuple (function)](#tuple-function)
- [type (function)](#type-function)
- [union (function)](#union-function)

---

# Decoder (interface)

**Signature**

```ts
export interface Decoder<A> {
  name: string
  decode: (u: unknown) => E.Either<DE.DecodeError, A>
}
```

Added in v3.0.0

# Decoding (type alias)

**Signature**

```ts
export type Decoding<D> = D extends Decoder<infer A> ? A : never
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

# array (function)

**Signature**

```ts
export function array<A>(decoder: Decoder<A>, name?: string): Decoder<Array<A>> { ... }
```

Added in v3.0.0

# intersection (function)

**Signature**

```ts
export function intersection<A extends [unknown, unknown, ...Array<unknown>]>(
  decoders: { [K in keyof A]: Decoder<A[K]> },
  name?: string
): Decoder<{ [K in keyof UnionToIntersection<A[number]>]: UnionToIntersection<A[number]>[K] }> { ... }
```

Added in v3.0.0

# literal (function)

**Signature**

```ts
export function literal<L extends string | number | boolean>(literal: L): Decoder<L> { ... }
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

# refinement (function)

**Signature**

```ts
export function refinement<A>(refinement: Refinement<unknown, A>, name: string): Decoder<A> { ... }
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
