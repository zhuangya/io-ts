---
title: DecodeError.ts
nav_order: 2
parent: Modules
---

# DecodeError overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [And (interface)](#and-interface)
- [DecodeError (interface)](#decodeerror-interface)
- [IndexedProduct (interface)](#indexedproduct-interface)
- [LabeledProduct (interface)](#labeledproduct-interface)
- [Or (interface)](#or-interface)
- [Detail (type alias)](#detail-type-alias)
- [and (function)](#and-function)
- [decodeError (function)](#decodeerror-function)
- [indexedProduct (function)](#indexedproduct-function)
- [isNonEmpty (function)](#isnonempty-function)
- [labeledProduct (function)](#labeledproduct-function)
- [or (function)](#or-function)

---

# And (interface)

**Signature**

```ts
export interface And {
  readonly _tag: 'And'
  readonly errors: NonEmptyArray<DecodeError>
}
```

Added in v3.0.0

# DecodeError (interface)

**Signature**

```ts
export interface DecodeError {
  readonly expected: string
  readonly actual: unknown
  readonly detail: Detail | undefined
  readonly message: string | undefined
}
```

Added in v3.0.0

# IndexedProduct (interface)

**Signature**

```ts
export interface IndexedProduct {
  readonly _tag: 'IndexedProduct'
  readonly errors: NonEmptyArray<[number, DecodeError]>
}
```

Added in v3.0.0

# LabeledProduct (interface)

**Signature**

```ts
export interface LabeledProduct {
  readonly _tag: 'LabeledProduct'
  readonly errors: NonEmptyArray<[string, DecodeError]>
}
```

Added in v3.0.0

# Or (interface)

**Signature**

```ts
export interface Or {
  readonly _tag: 'Or'
  readonly errors: NonEmptyArray<DecodeError>
}
```

Added in v3.0.0

# Detail (type alias)

**Signature**

```ts
export type Detail = IndexedProduct | LabeledProduct | And | Or
```

Added in v3.0.0

# and (function)

**Signature**

```ts
export function and(errors: NonEmptyArray<DecodeError>): Detail { ... }
```

Added in v3.0.0

# decodeError (function)

**Signature**

```ts
export function decodeError(expected: string, actual: unknown, detail?: Detail): DecodeError { ... }
```

Added in v3.0.0

# indexedProduct (function)

**Signature**

```ts
export function indexedProduct(errors: NonEmptyArray<[number, DecodeError]>): Detail { ... }
```

Added in v3.0.0

# isNonEmpty (function)

**Signature**

```ts
export function isNonEmpty<A>(as: Array<A>): as is NonEmptyArray<A> { ... }
```

Added in v3.0.0

# labeledProduct (function)

**Signature**

```ts
export function labeledProduct(errors: NonEmptyArray<[string, DecodeError]>): Detail { ... }
```

Added in v3.0.0

# or (function)

**Signature**

```ts
export function or(errors: NonEmptyArray<DecodeError>): Detail { ... }
```

Added in v3.0.0
