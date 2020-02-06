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
- [DSL (type alias)](#dsl-type-alias)
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
  readonly dsl: DSL
}
```

Added in v3.0.0

# DSL (type alias)

**Signature**

```ts
export type DSL =
  | {
      readonly _tag: 'literals'
      readonly values: NonEmptyArray<S.Literal>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'literalsOr'
      readonly values: NonEmptyArray<S.Literal>
      readonly dsl: DSL
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
      readonly dsls: Record<string, DSL>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'partial'
      readonly dsls: Record<string, DSL>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'record'
      readonly dsl: DSL
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'array'
      readonly dsl: DSL
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'tuple'
      readonly dsls: NonEmptyArray<DSL>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'intersection'
      readonly dsls: NonEmptyArray<DSL>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'sum'
      readonly tag: string
      readonly dsls: Record<string, DSL>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'union'
      readonly dsls: NonEmptyArray<DSL>
      readonly id: string | undefined
    }
  | {
      readonly _tag: 'lazy'
      readonly id: string
      readonly dsl: DSL
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
export function $ref(id: string): DSL { ... }
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export const UnknownArray: DSL = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: DSL = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array(dsl: DSL, id?: string): DSL { ... }
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: DSL = ...
```

Added in v3.0.0

# declaration

**Signature**

```ts
export function declaration(id: string, dsl: DSL): Declaration { ... }
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection(dsls: NonEmptyArray<DSL>, id?: string): DSL { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy(id: string, dsl: DSL): DSL { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends S.Literal>(values: NonEmptyArray<A>, id?: string): DSL { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends S.Literal>(values: NonEmptyArray<A>, dsl: DSL, id?: string): DSL { ... }
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: DSL = ...
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial(dsls: Record<string, DSL>, id?: string): DSL { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record(dsl: DSL, id?: string): DSL { ... }
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: DSL = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum(tag: string, dsls: Record<string, DSL>, id?: string): DSL { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple(dsls: NonEmptyArray<DSL>, id?: string): DSL { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type(dsls: Record<string, DSL>, id?: string): DSL { ... }
```

Added in v3.0.0

# union

**Signature**

```ts
export function union(dsls: NonEmptyArray<DSL>, id?: string): DSL { ... }
```

Added in v3.0.0
