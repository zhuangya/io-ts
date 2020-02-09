---
title: Schemable.ts
nav_order: 18
parent: Modules
---

# Schemable overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Schemable (interface)](#schemable-interface)
- [WithParse (interface)](#withparse-interface)
- [WithRefinement (interface)](#withrefinement-interface)
- [WithUnion (interface)](#withunion-interface)
- [memoize](#memoize)

---

# Schemable (interface)

**Signature**

```ts
export interface Schemable<S extends URIS> {
  readonly URI: S
  readonly literal: <A extends Literal>(value: A, id?: string) => Kind<S, A>
  readonly literals: <A extends Literal>(values: NonEmptyArray<A>, id?: string) => Kind<S, A>
  readonly literalsOr: <A extends Literal, B>(
    values: NonEmptyArray<A>,
    schema: Kind<S, B>,
    id?: string
  ) => Kind<S, A | B>
  readonly string: Kind<S, string>
  readonly number: Kind<S, number>
  readonly boolean: Kind<S, boolean>
  readonly UnknownArray: Kind<S, Array<unknown>>
  readonly UnknownRecord: Kind<S, Record<string, unknown>>
  readonly type: <A>(properties: { [K in keyof A]: Kind<S, A[K]> }, id?: string) => Kind<S, A>
  readonly partial: <A>(properties: { [K in keyof A]: Kind<S, A[K]> }, id?: string) => Kind<S, Partial<A>>
  readonly record: <A>(codomain: Kind<S, A>, id?: string) => Kind<S, Record<string, A>>
  readonly array: <A>(items: Kind<S, A>, id?: string) => Kind<S, Array<A>>
  readonly tuple: {
    <A, B, C, D, E>(items: [Kind<S, A>, Kind<S, B>, Kind<S, C>, Kind<S, D>, Kind<S, E>], id?: string): Kind<
      S,
      [A, B, C, D, E]
    >
    <A, B, C, D>(items: [Kind<S, A>, Kind<S, B>, Kind<S, C>, Kind<S, D>], id?: string): Kind<S, [A, B, C, D]>
    <A, B, C>(items: [Kind<S, A>, Kind<S, B>, Kind<S, C>], id?: string): Kind<S, [A, B, C]>
    <A, B>(items: [Kind<S, A>, Kind<S, B>], id?: string): Kind<S, [A, B]>
    <A>(items: [Kind<S, A>], id?: string): Kind<S, [A]>
  }
  readonly intersection: {
    <A, B, C, D, E>(schemas: [Kind<S, A>, Kind<S, B>, Kind<S, C>, Kind<S, D>, Kind<S, E>], id?: string): Kind<
      S,
      A & B & C & D & E
    >
    <A, B, C, D>(schemas: [Kind<S, A>, Kind<S, B>, Kind<S, C>, Kind<S, D>], id?: string): Kind<S, A & B & C & D>
    <A, B, C>(schemas: [Kind<S, A>, Kind<S, B>, Kind<S, C>], id?: string): Kind<S, A & B & C>
    <A, B>(schemas: [Kind<S, A>, Kind<S, B>], id?: string): Kind<S, A & B>
  }
  readonly sum: <T extends string>(
    tag: T
  ) => <A>(schemas: { [K in keyof A]: Kind<S, A[K] & Record<T, K>> }, id?: string) => Kind<S, A[keyof A]>
  readonly lazy: <A>(id: string, f: () => Kind<S, A>) => Kind<S, A>
}
```

Added in v3.0.0

# WithParse (interface)

**Signature**

```ts
export interface WithParse<S extends URIS> extends WithRefinement<S> {
  readonly parse: <A, B>(schema: Kind<S, A>, parser: (a: A) => Either<string, B>, id?: string) => Kind<S, B>
}
```

Added in v3.0.0

# WithRefinement (interface)

**Signature**

```ts
export interface WithRefinement<S extends URIS> {
  readonly refinement: <A, B extends A>(
    schema: Kind<S, A>,
    parser: (a: A) => Either<string, B>,
    id?: string
  ) => Kind<S, B>
}
```

Added in v3.0.0

# WithUnion (interface)

**Signature**

```ts
export interface WithUnion<S extends URIS> {
  readonly union: <A extends [unknown, ...Array<unknown>]>(
    schemas: { [K in keyof A]: Kind<S, A[K]> },
    id?: string
  ) => Kind<S, A[number]>
}
```

Added in v3.0.0

# memoize

**Signature**

```ts
export function memoize<A, B>(f: (a: A) => B): (a: A) => B { ... }
```

Added in v3.0.0
