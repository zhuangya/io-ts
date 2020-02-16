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
  readonly actual: unknown
  readonly errors: ReadonlyNonEmptyArray<DecodeError>
  readonly id: string | undefined
  readonly message: string | undefined
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
  readonly id: string | undefined
  readonly message: string | undefined
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
  readonly id: string | undefined
  readonly message: string | undefined
}
```

Added in v3.0.0

# Leaf (interface)

**Signature**

```ts
export interface Leaf {
  readonly _tag: 'Leaf'
  readonly actual: unknown
  readonly id: string | undefined
  readonly message: string | undefined
}
```

Added in v3.0.0

# Or (interface)

**Signature**

```ts
export interface Or {
  readonly _tag: 'Or'
  readonly actual: unknown
  readonly errors: ReadonlyNonEmptyArray<DecodeError>
  readonly id: string | undefined
  readonly message: string | undefined
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
export function and(
  actual: unknown,
  errors: ReadonlyNonEmptyArray<DecodeError>,
  id?: string,
  message?: string
): DecodeError { ... }
```

Added in v3.0.0

# indexed

**Signature**

```ts
export function indexed(
  actual: unknown,
  errors: ReadonlyNonEmptyArray<readonly [number, DecodeError]>,
  id?: string,
  message?: string
): DecodeError { ... }
```

Added in v3.0.0

# labeled

**Signature**

```ts
export function labeled(
  actual: unknown,
  errors: ReadonlyNonEmptyArray<readonly [string, DecodeError]>,
  id?: string,
  message?: string
): DecodeError { ... }
```

Added in v3.0.0

# leaf

**Signature**

```ts
export function leaf(actual: unknown, id?: string, message?: string): DecodeError { ... }
```

Added in v3.0.0

# or

**Signature**

```ts
export function or(
  actual: unknown,
  errors: ReadonlyNonEmptyArray<DecodeError>,
  id?: string,
  message?: string
): DecodeError { ... }
```

Added in v3.0.0
