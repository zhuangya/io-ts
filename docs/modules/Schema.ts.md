---
title: Schema.ts
nav_order: 17
parent: Modules
---

# Schema overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Deserializer (interface)](#deserializer-interface)
- [Schema (interface)](#schema-interface)
- [getDeserializer](#getdeserializer)
- [make](#make)

---

# Deserializer (interface)

**Signature**

```ts
export interface Deserializer {
  <A>(dsl: DSL.DSL<A>): Schema<A>
}
```

Added in v3.0.0

# Schema (interface)

**Signature**

```ts
export interface Schema<A> {
  <S extends URIS>(S: S.Schemable<S> & S.WithUnion<S>): Kind<S, A>
}
```

Added in v3.0.0

# getDeserializer

**Signature**

```ts
export function getDeserializer(refs: Record<string, Schema<unknown>>): Deserializer { ... }
```

Added in v3.0.0

# make

**Signature**

```ts
export function make<A>(f: Schema<A>): Schema<A> { ... }
```

Added in v3.0.0
