---
title: DecodeError.ts
nav_order: 5
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
- [DecodeError (type alias)](#decodeerror-type-alias)
- [and](#and)
- [indexed](#indexed)
- [labeled](#labeled)
- [leaf](#leaf)

---

# And (interface)

**Signature**

```ts
export interface And {
  readonly _tag: 'And'
  readonly errors: ReadonlyNonEmptyArray<DecodeError>
  readonly expected: string | undefined
}
```

Added in v3.0.0

# Indexed (interface)

**Signature**

```ts
export interface Indexed {
  readonly _tag: 'Indexed'
  readonly actual: unknown
  readonly errors: ReadonlyNonEmptyArray<readonly [number, DecodeError]>
  readonly expected: string | undefined
}
```

Added in v3.0.0

# Labeled (interface)

**Signature**

```ts
export interface Labeled {
  readonly _tag: 'Labeled'
  readonly actual: unknown
  readonly errors: ReadonlyNonEmptyArray<readonly [string, DecodeError]>
  readonly expected: string | undefined
}
```

Added in v3.0.0

# Leaf (interface)

**Signature**

```ts
export interface Leaf {
  readonly _tag: 'Leaf'
  readonly actual: unknown
  readonly expected: string | undefined
}
```

Added in v3.0.0

# DecodeError (type alias)

**Signature**

```ts
export type DecodeError = Leaf | And | Indexed | Labeled
```

Added in v3.0.0

# and

**Signature**

```ts
export function and(errors: ReadonlyNonEmptyArray<DecodeError>, expected?: string): DecodeError { ... }
```

Added in v3.0.0

# indexed

**Signature**

```ts
export function indexed(
  actual: unknown,
  errors: ReadonlyNonEmptyArray<readonly [number, DecodeError]>,
  expected?: string
): DecodeError { ... }
```

Added in v3.0.0

# labeled

**Signature**

```ts
export function labeled(
  actual: unknown,
  errors: ReadonlyNonEmptyArray<readonly [string, DecodeError]>,
  expected?: string
): DecodeError { ... }
```

Added in v3.0.0

# leaf

**Signature**

```ts
export function leaf(actual: unknown, expected?: string): DecodeError { ... }
```

Added in v3.0.0
