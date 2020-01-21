---
title: Encoder.ts
nav_order: 4
parent: Modules
---

# Encoder overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Encoder (interface)](#encoder-interface)
- [array (function)](#array-function)
- [partial (function)](#partial-function)
- [type (function)](#type-function)

---

# Encoder (interface)

**Signature**

```ts
export interface Encoder<A> {
  readonly encode: (a: A) => unknown
}
```

Added in v3.0.0

# array (function)

**Signature**

```ts
export function array<A>(encoder: Encoder<A>): Encoder<Array<A>> { ... }
```

Added in v3.0.0

# partial (function)

**Signature**

```ts
export function partial<A>(encoders: { [K in keyof A]: Encoder<A[K]> }): Encoder<Partial<A>> { ... }
```

Added in v3.0.0

# type (function)

**Signature**

```ts
export function type<A>(encoders: { [K in keyof A]: Encoder<A[K]> }): Encoder<A> { ... }
```

Added in v3.0.0
