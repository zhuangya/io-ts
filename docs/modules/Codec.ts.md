---
title: Codec.ts
nav_order: 1
parent: Modules
---

# Codec overview

Breaking changes:

- `refinement`
  - `name` is mandatory

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Codec (interface)](#codec-interface)
- [UnknownArray (constant)](#unknownarray-constant)
- [UnknownRecord (constant)](#unknownrecord-constant)
- [boolean (constant)](#boolean-constant)
- [number (constant)](#number-constant)
- [string (constant)](#string-constant)
- [array (function)](#array-function)
- [fromDecoder (function)](#fromdecoder-function)
- [literal (function)](#literal-function)
- [partial (function)](#partial-function)
- [refinement (function)](#refinement-function)
- [type (function)](#type-function)

---

# Codec (interface)

**Signature**

```ts
export interface Codec<A> extends D.Decoder<A>, E.Encoder<A> {}
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
export function array<A>(codec: Codec<A>, name?: string): Codec<Array<A>> { ... }
```

Added in v3.0.0

# fromDecoder (function)

**Signature**

```ts
export function fromDecoder<A>(decoder: D.Decoder<A>): Codec<A> { ... }
```

Added in v3.0.0

# literal (function)

**Signature**

```ts
export function literal<L extends string | number | boolean>(literal: L, name?: string): Codec<L> { ... }
```

Added in v3.0.0

# partial (function)

**Signature**

```ts
export function partial<A>(codecs: { [K in keyof A]: Codec<A[K]> }, name?: string): Codec<Partial<A>> { ... }
```

Added in v3.0.0

# refinement (function)

**Signature**

```ts
export function refinement<A, B extends A>(codec: Codec<A>, refinement: Refinement<A, B>, name: string): Codec<B> { ... }
```

Added in v3.0.0

# type (function)

**Signature**

```ts
export function type<A>(codecs: { [K in keyof A]: Codec<A[K]> }, name?: string): Codec<A> { ... }
```

Added in v3.0.0
