---
title: JsonSchema.ts
nav_order: 9
parent: Modules
---

# JsonSchema overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [JsonSchema (interface)](#jsonschema-interface)
- [URI (type alias)](#uri-type-alias)
- [Int (constant)](#int-constant)
- [URI (constant)](#uri-constant)
- [UnknownArray (constant)](#unknownarray-constant)
- [UnknownRecord (constant)](#unknownrecord-constant)
- [boolean (constant)](#boolean-constant)
- [jsonSchema (constant)](#jsonschema-constant)
- [number (constant)](#number-constant)
- [string (constant)](#string-constant)
- [array (function)](#array-function)
- [constants (function)](#constants-function)
- [constantsOr (function)](#constantsor-function)
- [intersection (function)](#intersection-function)
- [intersection (function)](#intersection-function-1)
- [intersection (function)](#intersection-function-2)
- [intersection (function)](#intersection-function-3)
- [lazy (function)](#lazy-function)
- [partial (function)](#partial-function)
- [record (function)](#record-function)
- [sum (function)](#sum-function)
- [tuple (function)](#tuple-function)
- [tuple (function)](#tuple-function-1)
- [tuple (function)](#tuple-function-2)
- [tuple (function)](#tuple-function-3)
- [tuple (function)](#tuple-function-4)
- [type (function)](#type-function)
- [union (function)](#union-function)

---

# JsonSchema (interface)

**Signature**

```ts
export interface JsonSchema<A> extends C.Const<unknown, A> {}
```

Added in v3.0.0

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v3.0.0

# Int (constant)

**Signature**

```ts
export const Int: JsonSchema<S.Int> = ...
```

Added in v3.0.0

# URI (constant)

**Signature**

```ts
export const URI: "JsonSchema" = ...
```

Added in v3.0.0

# UnknownArray (constant)

**Signature**

```ts
export const UnknownArray: JsonSchema<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord (constant)

**Signature**

```ts
export const UnknownRecord: JsonSchema<Record<string, unknown>> = ...
```

Added in v3.0.0

# boolean (constant)

**Signature**

```ts
export const boolean: JsonSchema<boolean> = ...
```

Added in v3.0.0

# jsonSchema (constant)

**Signature**

```ts
export const jsonSchema: S.Schemable<URI> & S.WithUnion<URI> = ...
```

Added in v3.0.0

# number (constant)

**Signature**

```ts
export const number: JsonSchema<number> = ...
```

Added in v3.0.0

# string (constant)

**Signature**

```ts
export const string: JsonSchema<string> = ...
```

Added in v3.0.0

# array (function)

**Signature**

```ts
export declare function array<A>(jsonSchema: JsonSchema<A>): JsonSchema<Array<A>> { ... }
```

Added in v3.0.0

# constants (function)

**Signature**

```ts
export declare function constants<A>(as: NonEmptyArray<A>): JsonSchema<A> { ... }
```

Added in v3.0.0

# constantsOr (function)

**Signature**

```ts
export declare function constantsOr<A, B>(as: NonEmptyArray<A>, jsonSchema: JsonSchema<B>): JsonSchema<A | B> { ... }
```

Added in v3.0.0

# intersection (function)

**Signature**

```ts
export declare function intersection<A, B, C, D, E>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<A & B & C & D & E>
export declare function intersection<A, B, C, D>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<A & B & C & D>
export declare function intersection<A, B, C>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]
): JsonSchema<A & B & C>
export declare function intersection<A, B>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<A & B> { ... }
```

Added in v3.0.0

# intersection (function)

**Signature**

```ts
export declare function intersection<A, B, C, D, E>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<A & B & C & D & E>
export declare function intersection<A, B, C, D>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<A & B & C & D>
export declare function intersection<A, B, C>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]
): JsonSchema<A & B & C>
export declare function intersection<A, B>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<A & B> { ... }
```

Added in v3.0.0

# intersection (function)

**Signature**

```ts
export declare function intersection<A, B, C, D, E>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<A & B & C & D & E>
export declare function intersection<A, B, C, D>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<A & B & C & D>
export declare function intersection<A, B, C>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]
): JsonSchema<A & B & C>
export declare function intersection<A, B>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<A & B> { ... }
```

Added in v3.0.0

# intersection (function)

**Signature**

```ts
export declare function intersection<A, B, C, D, E>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<A & B & C & D & E>
export declare function intersection<A, B, C, D>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<A & B & C & D>
export declare function intersection<A, B, C>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]
): JsonSchema<A & B & C>
export declare function intersection<A, B>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<A & B> { ... }
```

Added in v3.0.0

# lazy (function)

**Signature**

```ts
export declare function lazy<A>(f: () => JsonSchema<A>): JsonSchema<A> { ... }
```

Added in v3.0.0

# partial (function)

**Signature**

```ts
export declare function partial<A>(jsonSchemas: { [K in keyof A]: JsonSchema<A[K]> }): JsonSchema<Partial<A>> { ... }
```

Added in v3.0.0

# record (function)

**Signature**

```ts
export declare function record<A>(jsonSchema: JsonSchema<A>): JsonSchema<Record<string, A>> { ... }
```

Added in v3.0.0

# sum (function)

**Signature**

```ts
export declare function sum<T extends string>(
  tag: T
): <A>(jsonSchemas: { [K in keyof A]: JsonSchema<A[K] & Record<T, K>> }) => JsonSchema<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple (function)

**Signature**

```ts
export declare function tuple<A, B, C, D, E>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<[A, B, C, D, E]>
export declare function tuple<A, B, C, D>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<[A, B, C, D]>
export declare function tuple<A, B, C>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]
): JsonSchema<[A, B, C]>
export declare function tuple<A, B>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<[A, B]>
export declare function tuple<A>(jsonSchemas: [JsonSchema<A>]): JsonSchema<[A]> { ... }
```

Added in v3.0.0

# tuple (function)

**Signature**

```ts
export declare function tuple<A, B, C, D, E>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<[A, B, C, D, E]>
export declare function tuple<A, B, C, D>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<[A, B, C, D]>
export declare function tuple<A, B, C>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]
): JsonSchema<[A, B, C]>
export declare function tuple<A, B>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<[A, B]>
export declare function tuple<A>(jsonSchemas: [JsonSchema<A>]): JsonSchema<[A]> { ... }
```

Added in v3.0.0

# tuple (function)

**Signature**

```ts
export declare function tuple<A, B, C, D, E>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<[A, B, C, D, E]>
export declare function tuple<A, B, C, D>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<[A, B, C, D]>
export declare function tuple<A, B, C>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]
): JsonSchema<[A, B, C]>
export declare function tuple<A, B>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<[A, B]>
export declare function tuple<A>(jsonSchemas: [JsonSchema<A>]): JsonSchema<[A]> { ... }
```

Added in v3.0.0

# tuple (function)

**Signature**

```ts
export declare function tuple<A, B, C, D, E>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<[A, B, C, D, E]>
export declare function tuple<A, B, C, D>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<[A, B, C, D]>
export declare function tuple<A, B, C>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]
): JsonSchema<[A, B, C]>
export declare function tuple<A, B>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<[A, B]>
export declare function tuple<A>(jsonSchemas: [JsonSchema<A>]): JsonSchema<[A]> { ... }
```

Added in v3.0.0

# tuple (function)

**Signature**

```ts
export declare function tuple<A, B, C, D, E>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>, JsonSchema<E>]
): JsonSchema<[A, B, C, D, E]>
export declare function tuple<A, B, C, D>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>, JsonSchema<D>]
): JsonSchema<[A, B, C, D]>
export declare function tuple<A, B, C>(
  jsonSchemas: [JsonSchema<A>, JsonSchema<B>, JsonSchema<C>]
): JsonSchema<[A, B, C]>
export declare function tuple<A, B>(jsonSchemas: [JsonSchema<A>, JsonSchema<B>]): JsonSchema<[A, B]>
export declare function tuple<A>(jsonSchemas: [JsonSchema<A>]): JsonSchema<[A]> { ... }
```

Added in v3.0.0

# type (function)

**Signature**

```ts
export declare function type<A>(jsonSchemas: { [K in keyof A]: JsonSchema<A[K]> }): JsonSchema<A> { ... }
```

Added in v3.0.0

# union (function)

**Signature**

```ts
export declare function union<A extends Array<unknown>>(
  jsonSchemas: { [K in keyof A]: JsonSchema<A[K]> }
): JsonSchema<A[number]> { ... }
```

Added in v3.0.0
