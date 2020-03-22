---
title: Literal.ts
nav_order: 13
parent: Modules
---

# Literal overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Literal (type alias)](#literal-type-alias)
- [fold](#fold)

---

# Literal (type alias)

**Signature**

```ts
export type Literal = string | number | boolean | null
```

Added in v3.0.0

# fold

**Signature**

```ts
export function fold<R>(
  onString: (s: string) => R,
  onNumber: (n: number) => R,
  onBoolean: (b: boolean) => R,
  onNull: () => R
): (literal: Literal) => R { ... }
```

Added in v3.0.0
