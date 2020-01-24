---
title: Schemable.ts
nav_order: 9
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
- [Literal (type alias)](#literal-type-alias)

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
  readonly literal: <A extends Literal>(a: A) => Kind<F, A>
  readonly literals: <A extends Literal>(as: Array<A>) => Kind<F, A>
  readonly string: Kind<F, string>
  readonly number: Kind<F, number>
  readonly boolean: Kind<F, boolean>
  readonly Int: Kind<F, Int>
  readonly refinement: <A, B extends A>(
    schema: Kind<F, A>,
    refinement: Refinement<A, B>,
    expected: string
  ) => Kind<F, B>
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

# Literal (type alias)

**Signature**

```ts
export type Literal = string | number | boolean | null | undefined
```

Added in v3.0.0
