---
title: DSL.ts
nav_order: 7
parent: Modules
---

# DSL overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Declaration (interface)](#declaration-interface)
- [Expression (type alias)](#expression-type-alias)
- [\$ref](#ref)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [array](#array)
- [boolean](#boolean)
- [declaration](#declaration)
- [intersection](#intersection)
- [lazy](#lazy)
- [literals](#literals)
- [literalsOr](#literalsor)
- [number](#number)
- [partial](#partial)
- [record](#record)
- [string](#string)
- [sum](#sum)
- [tuple](#tuple)
- [type](#type)
- [union](#union)

---

# Declaration (interface)

**Signature**

```ts
export interface Declaration {
  readonly id: string
  readonly model: Expression
}
```

Added in v3.0.0

# Expression (type alias)

**Signature**

```ts
export type Expression =
  | {
      readonly _tag: 'literals'
      readonly values: NonEmptyArray<S.Literal>
    }
  | {
      readonly _tag: 'literalsOr'
      readonly values: NonEmptyArray<S.Literal>
      readonly model: Expression
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
      readonly models: Record<string, Expression>
    }
  | {
      readonly _tag: 'partial'
      readonly models: Record<string, Expression>
    }
  | {
      readonly _tag: 'record'
      readonly model: Expression
    }
  | {
      readonly _tag: 'array'
      readonly model: Expression
    }
  | {
      readonly _tag: 'tuple'
      readonly models: NonEmptyArray<Expression>
    }
  | {
      readonly _tag: 'intersection'
      readonly models: NonEmptyArray<Expression>
    }
  | {
      readonly _tag: 'sum'
      readonly tag: string
      readonly models: Record<string, Expression>
    }
  | {
      readonly _tag: 'union'
      readonly models: NonEmptyArray<Expression>
    }
  | {
      readonly _tag: 'lazy'
      readonly model: Expression
    }
  | {
      readonly _tag: '$ref'
      readonly id: string
    }
```

Added in v3.0.0

# \$ref

**Signature**

```ts
export function $ref(id: string): Expression { ... }
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export const UnknownArray: Expression = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: Expression = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array(model: Expression): Expression { ... }
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: Expression = ...
```

Added in v3.0.0

# declaration

**Signature**

```ts
export function declaration(id: string, model: Expression): Declaration { ... }
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection(models: NonEmptyArray<Expression>): Expression { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy(model: Expression): Expression { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): Expression { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends S.Literal>(values: NonEmptyArray<A>, model: Expression): Expression { ... }
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: Expression = ...
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial(models: Record<string, Expression>): Expression { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record(model: Expression): Expression { ... }
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: Expression = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum(tag: string, models: Record<string, Expression>): Expression { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple(models: NonEmptyArray<Expression>): Expression { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type(models: Record<string, Expression>): Expression { ... }
```

Added in v3.0.0

# union

**Signature**

```ts
export function union(models: NonEmptyArray<Expression>): Expression { ... }
```

Added in v3.0.0
