---
title: Schema.ts
nav_order: 15
parent: Modules
---

# Schema overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Schema (interface)](#schema-interface)
- [TypeOf (type alias)](#typeof-type-alias)
- [make](#make)

---

# Schema (interface)

**Signature**

```ts
export interface Schema<A> {
  <S extends URIS>(S: S.Schemable<S> & S.WithUnion<S>): Kind<S, A>
}
```

Added in v3.0.0

# TypeOf (type alias)

**Signature**

```ts
export type TypeOf<S> = S extends Schema<infer A> ? A : never
```

Added in v3.0.0

# make

**Signature**

```ts
export function make<A>(f: Schema<A>): Schema<A> { ... }
```

Added in v3.0.0
