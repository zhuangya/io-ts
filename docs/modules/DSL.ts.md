---
title: DSL.ts
nav_order: 7
parent: Modules
---

# DSL overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [DSL (interface)](#dsl-interface)
- [Declaration (interface)](#declaration-interface)
- [Model (type alias)](#model-type-alias)
- [URI (type alias)](#uri-type-alias)
- [\$ref](#ref)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [array](#array)
- [boolean](#boolean)
- [declaration](#declaration)
- [dsl](#dsl)
- [intersection](#intersection)
- [lazy](#lazy)
- [literal](#literal)
- [literals](#literals)
- [literalsOr](#literalsor)
- [number](#number)
- [partial](#partial)
- [record](#record)
- [string](#string)
- [sum](#sum)
- [tuple2](#tuple2)
- [tuple3](#tuple3)
- [type](#type)
- [union](#union)

---

# DSL (interface)

**Signature**

```ts
export interface DSL<A> {
  readonly dsl: (refs: boolean) => C.Const<Model, A>
}
```

Added in v3.0.0

# Declaration (interface)

**Signature**

```ts
export interface Declaration<A> {
  readonly id: string
  readonly dsl: DSL<A>
}
```

Added in v3.0.0

# Model (type alias)

**Signature**

```ts
export type Model =
  | {
      readonly _tag: 'literal'
      readonly value: Literal
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'literals'
      readonly values: NonEmptyArray<Literal>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'literalsOr'
      readonly values: NonEmptyArray<Literal>
      readonly model: Model
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'string'
    }
  | {
      readonly _tag: 'number'
    }
  | {
      readonly _tag: 'boolean'
    }
  | {
      readonly _tag: 'UnknownArray'
    }
  | {
      readonly _tag: 'UnknownRecord'
    }
  | {
      readonly _tag: 'type'
      readonly properties: Record<string, Model>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'partial'
      readonly properties: Record<string, Model>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'record'
      readonly codomain: Model
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'array'
      readonly items: Model
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'tuple2'
      readonly items: [Model, Model]
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'tuple3'
      readonly items: [Model, Model, Model]
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'intersection'
      readonly models: [Model, Model]
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'sum'
      readonly tag: string
      readonly models: Record<string, Model>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'union'
      readonly models: NonEmptyArray<Model>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'lazy'
      readonly id: string
      readonly model: Model
    }
  | {
      readonly _tag: '$ref'
      readonly id: string
    }
```

Added in v3.0.0

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v3.0.0

# \$ref

**Signature**

```ts
export function $ref(id: string): DSL<unknown> { ... }
```

Added in v3.0.0

# URI

**Signature**

```ts
export const URI: "DSL" = ...
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export const UnknownArray: DSL<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: DSL<Record<string, unknown>> = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array<A>(items: DSL<A>, id?: string): DSL<Array<A>> { ... }
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: DSL<boolean> = ...
```

Added in v3.0.0

# declaration

**Signature**

```ts
export function declaration<A>(id: string, dsl: DSL<A>): Declaration<A> { ... }
```

Added in v3.0.0

# dsl

**Signature**

```ts
export const dsl: S.Schemable<URI> & S.WithUnion<URI> = ...
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B>(dslA: DSL<A>, dslB: DSL<B>, id?: string): DSL<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(id: string, f: () => DSL<A>): DSL<A> { ... }
```

Added in v3.0.0

# literal

**Signature**

```ts
export function literal<A extends Literal>(value: A, id?: string): DSL<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends Literal>(values: NonEmptyArray<A>, id?: string): DSL<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends Literal, B>(values: NonEmptyArray<A>, dsl: DSL<B>, id?: string): DSL<A | B> { ... }
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: DSL<number> = ...
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(properties: { [K in keyof A]: DSL<A[K]> }, id?: string): DSL<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(codomain: DSL<A>, id?: string): DSL<Record<string, A>> { ... }
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: DSL<string> = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum<T extends string>(
  tag: T
): <A>(members: { [K in keyof A]: DSL<A[K] & Record<T, K>> }, id?: string) => DSL<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple2

**Signature**

```ts
export function tuple2<A, B>(itemA: DSL<A>, itemB: DSL<B>, id?: string): DSL<[A, B]> { ... }
```

Added in v3.0.0

# tuple3

**Signature**

```ts
export function tuple3<A, B, C>(itemA: DSL<A>, itemB: DSL<B>, itemC: DSL<C>, id?: string): DSL<[A, B, C]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(properties: { [K in keyof A]: DSL<A[K]> }, id?: string): DSL<A> { ... }
```

Added in v3.0.0

# union

**Signature**

```ts
export function union<A extends [unknown, ...Array<unknown>]>(
  dsls: { [K in keyof A]: DSL<A[K]> },
  id?: string
): DSL<A[number]> { ... }
```

Added in v3.0.0
