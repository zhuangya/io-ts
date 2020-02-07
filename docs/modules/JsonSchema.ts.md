---
title: JsonSchema.ts
nav_order: 12
parent: Modules
---

# JsonSchema overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [JsonSchema (type alias)](#jsonschema-type-alias)
- [Model (type alias)](#model-type-alias)
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
- [tuple](#tuple)
- [type](#type)
- [union](#union)

---

# JsonSchema (type alias)

**Signature**

```ts
export type JsonSchema<A> = C.Const<IO<Model>, A>
```

Added in v3.0.0

# Model (type alias)

**Signature**

```ts
export type Model = J.JSONSchema7
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
export function intersection<A, B, C, D, E>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<A & B & C & D & E>
export function intersection<A, B, C, D>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<A & B & C & D>
export function intersection<A, B, C>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]): JsonSchema<A & B & C>
export function intersection<A, B>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<A & B> { ... }
```

Added in v3.0.0

# jsonSchema

**Signature**

```ts
export const jsonSchema: S.TypeScriptable<URI> = ...
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
export function literal<A extends S.Literal>(value: A): JsonSchema<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): JsonSchema<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends S.Literal, B>(
  values: NonEmptyArray<A>,
  jsonSchema: JsonSchema<B>
): JsonSchema<A | B> { ... }
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
): <A>(jsonSchemas: { [K in keyof A]: JsonSchema<A[K] & Record<T, K>> }) => JsonSchema<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple<A, B, C, D, E>(
  items: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  items: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<[A, B, C, D]>
export function tuple<A, B, C>(items: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]): JsonSchema<[A, B, C]>
export function tuple<A, B>(items: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<[A, B]>
export function tuple<A>(items: [JsonSchema<A>]): JsonSchema<[A]> { ... }
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
