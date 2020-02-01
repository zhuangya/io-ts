---
title: DecodeError.ts
nav_order: 4
parent: Modules
---

# DecodeError overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [And (interface)](#and-interface)
- [Indexed (interface)](#indexed-interface)
- [Labeled (interface)](#labeled-interface)
- [Leaf (interface)](#leaf-interface)
- [Or (interface)](#or-interface)
- [DecodeError (type alias)](#decodeerror-type-alias)
- [and](#and)
- [indexed](#indexed)
- [labeled](#labeled)
- [leaf](#leaf)
- [or](#or)

---

# And (interface)

**Signature**

```ts
export interface And {
  readonly _tag: 'And'
  readonly expected: string
  readonly actual: unknown
  readonly errors: NonEmptyArray<DecodeError>
}
```

Added in v3.0.0

# Indexed (interface)

**Signature**

```ts
export interface Indexed {
  readonly _tag: 'Indexed'
  readonly expected: string
  readonly actual: unknown
  readonly errors: NonEmptyArray<[number, DecodeError]>
}
```

Added in v3.0.0

# Labeled (interface)

**Signature**

```ts
export interface Labeled {
  readonly _tag: 'Labeled'
  readonly expected: string
  readonly actual: unknown
  readonly errors: NonEmptyArray<[string, DecodeError]>
}
```

Added in v3.0.0

# Leaf (interface)

**Signature**

```ts
export interface Leaf {
  readonly _tag: 'Leaf'
  readonly expected: string
  readonly actual: unknown
}
```

Added in v3.0.0

# Or (interface)

**Signature**

```ts
export interface Or {
  readonly _tag: 'Or'
  readonly expected: string
  readonly actual: unknown
  readonly errors: NonEmptyArray<DecodeError>
}
```

Added in v3.0.0

# DecodeError (type alias)

**Signature**

```ts
export type DecodeError = Leaf | And | Or | Indexed | Labeled
```

Added in v3.0.0

# and

**Signature**

```ts
export function and(expected: string, actual: unknown, errors: NonEmptyArray<DecodeError>): DecodeError { ... }
```

Added in v3.0.0

# indexed

**Signature**

```ts
export function indexed(expected: string, actual: unknown, errors: NonEmptyArray<[number, DecodeError]>): DecodeError { ... }
```

Added in v3.0.0

# labeled

**Signature**

```ts
export function labeled(expected: string, actual: unknown, errors: NonEmptyArray<[string, DecodeError]>): DecodeError { ... }
```

Added in v3.0.0

# leaf

**Signature**

```ts
export function leaf(expected: string, actual: unknown): DecodeError { ... }
```

Added in v3.0.0

# or

**Signature**

```ts
export function or(expected: string, actual: unknown, errors: NonEmptyArray<DecodeError>): DecodeError { ... }
```

Added in v3.0.0
