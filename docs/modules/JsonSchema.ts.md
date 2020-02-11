---
title: JsonSchema.ts
nav_order: 13
parent: Modules
---

# JsonSchema overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [JsonSchema (interface)](#jsonschema-interface)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [array](#array)
- [boolean](#boolean)
- [intersection](#intersection)
- [jsonSchema](#jsonschema)
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

# JsonSchema (interface)

**Signature**

```ts
export interface JsonSchema<A> {
  readonly compile: (lazy: boolean) => C.Const<JSONSchema7, A>
}
```

Added in v3.0.0

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v3.0.0

# URI

**Signature**

```ts
export const URI: "JsonSchema" = ...
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export const UnknownArray: JsonSchema<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: JsonSchema<Record<string, unknown>> = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array<A>(items: JsonSchema<A>): JsonSchema<Array<A>> { ... }
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: JsonSchema<boolean> = ...
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B>(jsonSchemaA: JsonSchema<A>, jsonSchemaB: JsonSchema<B>): JsonSchema<A & B> { ... }
```

Added in v3.0.0

# jsonSchema

**Signature**

```ts
export const jsonSchema: S.Schemable<URI> & S.WithUnion<URI> = ...
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(id: string, f: () => JsonSchema<A>): JsonSchema<A> { ... }
```

Added in v3.0.0

# literal

**Signature**

```ts
export function literal<A extends Literal>(value: A): JsonSchema<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends Literal>(values: NonEmptyArray<A>): JsonSchema<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends Literal, B>(values: NonEmptyArray<A>, or: JsonSchema<B>): JsonSchema<A | B> { ... }
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: JsonSchema<number> = ...
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(properties: { [K in keyof A]: JsonSchema<A[K]> }): JsonSchema<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(codomain: JsonSchema<A>): JsonSchema<Record<string, A>> { ... }
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: JsonSchema<string> = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum<T extends string>(
  _tag: T
): <A>(members: { [K in keyof A]: JsonSchema<A[K] & Record<T, K>> }) => JsonSchema<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple2

**Signature**

```ts
export function tuple2<A, B>(itemA: JsonSchema<A>, itemB: JsonSchema<B>): JsonSchema<[A, B]> { ... }
```

Added in v3.0.0

# tuple3

**Signature**

```ts
export function tuple3<A, B, C>(
  itemA: JsonSchema<A>,
  itemB: JsonSchema<B>,
  itemC: JsonSchema<C>
): JsonSchema<[A, B, C]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(properties: { [K in keyof A]: JsonSchema<A[K]> }): JsonSchema<A> { ... }
```

Added in v3.0.0

# union

**Signature**

```ts
export function union<A extends [unknown, ...Array<unknown>]>(
  jsonSchemas: { [K in keyof A]: JsonSchema<A[K]> }
): JsonSchema<A[number]> { ... }
```

Added in v3.0.0
