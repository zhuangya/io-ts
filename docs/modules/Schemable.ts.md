---
title: Schemable.ts
nav_order: 11
parent: Modules
---

# Schemable overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [IntBrand (interface)](#intbrand-interface)
- [Schemable (interface)](#schemable-interface)
- [WithUnion (interface)](#withunion-interface)
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

# Schemable (interface)

**Signature**

```ts
export interface Schemable<F extends URIS> {
  readonly URI: F
  readonly constants: <A>(as: NonEmptyArray<A>) => Kind<F, A>
  readonly constantsOr: <A, B>(as: NonEmptyArray<A>, encoder: Kind<F, B>) => Kind<F, A | B>
  readonly string: Kind<F, string>
  readonly number: Kind<F, number>
  readonly boolean: Kind<F, boolean>
  readonly Int: Kind<F, Int>
  readonly parse: <A, B>(decoder: Kind<F, A>, parser: (a: A) => Either<string, B>) => Kind<F, A>
  readonly UnknownArray: Kind<F, Array<unknown>>
  readonly UnknownRecord: Kind<F, Record<string, unknown>>
  readonly type: <A>(schemas: { [K in keyof A]: Kind<F, A[K]> }) => Kind<F, A>
  readonly partial: <A>(schemas: { [K in keyof A]: Kind<F, A[K]> }) => Kind<F, Partial<A>>
  readonly record: <A>(schema: Kind<F, A>) => Kind<F, Record<string, A>>
  readonly array: <A>(schema: Kind<F, A>) => Kind<F, Array<A>>
  readonly tuple: {
    <A, B, C, D, E>(encoders: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>, Kind<F, E>]): Kind<F, [A, B, C, D, E]>
    <A, B, C, D>(encoders: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>]): Kind<F, [A, B, C, D]>
    <A, B, C>(encoders: [Kind<F, A>, Kind<F, B>, Kind<F, C>]): Kind<F, [A, B, C]>
    <A, B>(encoders: [Kind<F, A>, Kind<F, B>]): Kind<F, [A, B]>
    <A>(encoders: [Kind<F, A>]): Kind<F, [A]>
  }
  readonly intersection: {
    <A, B, C, D, E>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>, Kind<F, E>]): Kind<F, A & B & C & D & E>
    <A, B, C, D>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>]): Kind<F, A & B & C & D>
    <A, B, C>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>]): Kind<F, A & B & C>
    <A, B>(schemas: [Kind<F, A>, Kind<F, B>]): Kind<F, A & B>
  }
  readonly lazy: <A>(f: () => Kind<F, A>) => Kind<F, A>
  readonly sum: <T extends string>(
    tag: T
  ) => <A>(def: { [K in keyof A]: Kind<F, A[K]> }) => Kind<F, { [K in keyof A]: { [F in T]: K } & A[K] }[keyof A]>
}
```

Added in v3.0.0

# WithUnion (interface)

**Signature**

```ts
export interface WithUnion<F extends URIS> {
  readonly union: <A extends [unknown, unknown, ...Array<unknown>]>(
    schemas: { [K in keyof A]: Kind<F, A[K]> }
  ) => Kind<F, A[number]>
}
```

Added in v3.0.0

# Int (type alias)

**Signature**

```ts
export type Int = number & IntBrand
```

Added in v3.0.0
