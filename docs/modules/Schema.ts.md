---
title: Schema.ts
nav_order: 9
parent: Modules
---

# Schema overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [IntBrand (interface)](#intbrand-interface)
- [Schema (interface)](#schema-interface)
- [Int (type alias)](#int-type-alias)

---

# IntBrand (interface)

**Signature**

```ts
export interface IntBrand {
  readonly Int: unique symbol
}
```

Added in v3.0.0

# Schema (interface)

**Signature**

```ts
export interface Schema<F extends URIS> {
  readonly URI: F
  readonly literal: <A extends string | number | boolean>(a: A) => Kind<F, A>
  readonly keyof: <A>(keys: Record<keyof A, unknown>) => Kind<F, keyof A>
  readonly string: Kind<F, string>
  readonly number: Kind<F, number>
  readonly boolean: Kind<F, boolean>
  readonly undefined: Kind<F, undefined>
  readonly null: Kind<F, null>
  readonly Int: Kind<F, Int>
  // refinement?
  readonly UnknownArray: Kind<F, Array<unknown>>
  readonly UnknownRecord: Kind<F, Record<string, unknown>>
  readonly type: <A>(schemas: { [K in keyof A]: Kind<F, A[K]> }) => Kind<F, A>
  readonly partial: <A>(schemas: { [K in keyof A]: Kind<F, A[K]> }) => Kind<F, Partial<A>>
  readonly record: <A>(schema: Kind<F, A>) => Kind<F, Record<string, A>>
  readonly array: <A>(schema: Kind<F, A>) => Kind<F, Array<A>>
  readonly tuple: <A extends [unknown, unknown, ...Array<unknown>]>(
    schemas: { [K in keyof A]: Kind<F, A[K]> }
  ) => Kind<F, A>
  readonly intersection: {
    <A, B, C, D, E>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>, Kind<F, E>]): Kind<F, A & B & C & D & E>
    <A, B, C, D>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>]): Kind<F, A & B & C & D>
    <A, B, C>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>]): Kind<F, A & B & C>
    <A, B>(schemas: [Kind<F, A>, Kind<F, B>]): Kind<F, A & B>
  }
  // union?
  readonly lazy: <A>(f: () => Kind<F, A>) => Kind<F, A>
}
```

Added in v3.0.0

# Int (type alias)

**Signature**

```ts
export type Int = number & IntBrand
```

Added in v3.0.0
