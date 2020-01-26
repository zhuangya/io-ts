---
title: util.ts
nav_order: 13
parent: Modules
---

# util overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [always (constant)](#always-constant)
- [strict (constant)](#strict-constant)
- [hasOwnProperty (function)](#hasownproperty-function)
- [isNonEmpty (function)](#isnonempty-function)
- [memoize (function)](#memoize-function)
- [showConstant (function)](#showconstant-function)

---

# always (constant)

**Signature**

```ts
export const always: Eq<unknown> = ...
```

Added in v3.0.0

# strict (constant)

**Signature**

```ts
export const strict: Eq<unknown> = ...
```

Added in v3.0.0

# hasOwnProperty (function)

**Signature**

```ts
export function hasOwnProperty<O extends Record<string, unknown>>(o: O, k: string): k is keyof O & string { ... }
```

Added in v3.0.0

# isNonEmpty (function)

**Signature**

```ts
export function isNonEmpty<A>(as: Array<A>): as is NonEmptyArray<A> { ... }
```

Added in v3.0.0

# memoize (function)

**Signature**

```ts
export function memoize<A>(f: () => A): () => A { ... }
```

Added in v3.0.0

# showConstant (function)

**Signature**

```ts
export function showConstant(a: unknown): string { ... }
```

Added in v3.0.0
