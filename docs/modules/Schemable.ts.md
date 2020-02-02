---
title: Schemable.ts
nav_order: 14
parent: Modules
---

# Schemable overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Schemable (interface)](#schemable-interface)
- [WithRefinement (interface)](#withrefinement-interface)
- [WithUnion (interface)](#withunion-interface)
- [Literal (type alias)](#literal-type-alias)

---

# Schemable (interface)

**Signature**

```ts
export interface Schemable<F extends URIS> {
  readonly URI: F
  readonly literals: <A extends Literal>(values: NonEmptyArray<A>) => Kind<F, A>
  readonly literalsOr: <A extends Literal, B>(values: NonEmptyArray<A>, schema: Kind<F, B>) => Kind<F, A | B>
  readonly string: Kind<F, string>
  readonly number: Kind<F, number>
  readonly boolean: Kind<F, boolean>
  readonly UnknownArray: Kind<F, Array<unknown>>
  readonly UnknownRecord: Kind<F, Record<string, unknown>>
  readonly type: <A>(schemas: { [K in keyof A]: Kind<F, A[K]> }) => Kind<F, A>
  readonly partial: <A>(schemas: { [K in keyof A]: Kind<F, A[K]> }) => Kind<F, Partial<A>>
  readonly record: <A>(schema: Kind<F, A>) => Kind<F, Record<string, A>>
  readonly array: <A>(schema: Kind<F, A>) => Kind<F, Array<A>>
  readonly tuple: {
    <A, B, C, D, E>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>, Kind<F, E>]): Kind<F, [A, B, C, D, E]>
    <A, B, C, D>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>]): Kind<F, [A, B, C, D]>
    <A, B, C>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>]): Kind<F, [A, B, C]>
    <A, B>(schemas: [Kind<F, A>, Kind<F, B>]): Kind<F, [A, B]>
    <A>(schemas: [Kind<F, A>]): Kind<F, [A]>
  }
  readonly intersection: {
    <A, B, C, D, E>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>, Kind<F, E>]): Kind<F, A & B & C & D & E>
    <A, B, C, D>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>, Kind<F, D>]): Kind<F, A & B & C & D>
    <A, B, C>(schemas: [Kind<F, A>, Kind<F, B>, Kind<F, C>]): Kind<F, A & B & C>
    <A, B>(schemas: [Kind<F, A>, Kind<F, B>]): Kind<F, A & B>
  }
  readonly sum: <T extends string>(
    tag: T
  ) => <A>(schemas: { [K in keyof A]: Kind<F, A[K] & Record<T, K>> }) => Kind<F, A[keyof A]>
  readonly lazy: <A>(f: () => Kind<F, A>) => Kind<F, A>
}
```

Added in v3.0.0

# WithRefinement (interface)

**Signature**

```ts
export interface WithRefinement<F extends URIS> {
  readonly refinement: <A, B extends A>(schema: Kind<F, A>, parser: (a: A) => Either<string, B>) => Kind<F, B>
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

# Literal (type alias)

**Signature**

```ts
export type Literal = string | number | boolean | null | undefined
```

Added in v3.0.0
