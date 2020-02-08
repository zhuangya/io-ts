---
title: Tree.ts
nav_order: 19
parent: Modules
---

# Tree overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [mapLeft](#mapleft)
- [toTree](#totree)

---

# mapLeft

**Signature**

```ts
export const mapLeft: <A>(e: E.Either<DecodeError, A>) => E.Either<string, A> = ...
```

Added in v3.0.0

# toTree

**Signature**

```ts
export function toTree(e: DecodeError): Tree<string> { ... }
```

Added in v3.0.0
