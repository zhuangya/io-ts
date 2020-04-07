---
title: JsonSchema.ts
nav_order: 11
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
- [nullable](#nullable)
- [number](#number)
- [partial](#partial)
- [record](#record)
- [string](#string)
- [sum](#sum)
- [tuple](#tuple)
- [type](#type)
- [union](#union)

---

# JsonSchema (interface)

**Signature**

```ts
export interface JsonSchema<A> {
  readonly compile: (definitions?: Record<string, JSONSchema7 | undefined>) => C.Const<JSONSchema7, A>
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
export declare const URI: 'JsonSchema'
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export declare const UnknownArray: JsonSchema<unknown[]>
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export declare const UnknownRecord: JsonSchema<Record<string, unknown>>
```

Added in v3.0.0

# array

**Signature**

```ts
export declare function array<A>(items: JsonSchema<A>): JsonSchema<Array<A>>
```

Added in v3.0.0

# boolean

**Signature**

```ts
export declare const boolean: JsonSchema<boolean>
```

Added in v3.0.0

# intersection

**Signature**

```ts
export declare function intersection<A, B>(left: JsonSchema<A>, right: JsonSchema<B>): JsonSchema<A & B>
```

Added in v3.0.0

# jsonSchema

**Signature**

```ts
export declare const jsonSchema: S.Schemable<'JsonSchema'> & S.WithUnion<'JsonSchema'>
```

Added in v3.0.0

# lazy

**Signature**

```ts
export declare function lazy<A>(id: string, f: () => JsonSchema<A>): JsonSchema<A>
```

Added in v3.0.0

# literal

**Signature**

```ts
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): JsonSchema<A[number]>
```

Added in v3.0.0

# nullable

**Signature**

```ts
export declare function nullable<A>(or: JsonSchema<A>): JsonSchema<null | A>
```

Added in v3.0.0

# number

**Signature**

```ts
export declare const number: JsonSchema<number>
```

Added in v3.0.0

# partial

**Signature**

```ts
export declare function partial<A>(properties: { [K in keyof A]: JsonSchema<A[K]> }): JsonSchema<Partial<A>>
```

Added in v3.0.0

# record

**Signature**

```ts
export declare function record<A>(codomain: JsonSchema<A>): JsonSchema<Record<string, A>>
```

Added in v3.0.0

# string

**Signature**

```ts
export declare const string: JsonSchema<string>
```

Added in v3.0.0

# sum

**Signature**

```ts
export declare function sum<T extends string>(
  _tag: T
): <A>(members: { [K in keyof A]: JsonSchema<A[K] & Record<T, K>> }) => JsonSchema<A[keyof A]>
```

Added in v3.0.0

# tuple

**Signature**

```ts
export declare function tuple<A extends ReadonlyArray<unknown>>(
  ...components: { [K in keyof A]: JsonSchema<A[K]> }
): JsonSchema<A>
```

Added in v3.0.0

# type

**Signature**

```ts
export declare function type<A>(properties: { [K in keyof A]: JsonSchema<A[K]> }): JsonSchema<A>
```

Added in v3.0.0

# union

**Signature**

```ts
export declare function union<A extends ReadonlyArray<unknown>>(
  ...members: { [K in keyof A]: JsonSchema<A[K]> }
): JsonSchema<A[number]>
```

Added in v3.0.0
