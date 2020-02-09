---
title: TypeNode.ts
nav_order: 21
parent: Modules
---

# TypeNode overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [TypeNode (interface)](#typenode-interface)
- [URI (type alias)](#uri-type-alias)
- [\$ref](#ref)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [array](#array)
- [boolean](#boolean)
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
- [typeNode](#typenode)
- [union](#union)

---

# TypeNode (interface)

**Signature**

```ts
export interface TypeNode<A> {
  readonly typeNode: () => C.Const<ts.TypeNode, A>
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
export function $ref(id: string): TypeNode<unknown> { ... }
```

Added in v3.0.0

# URI

**Signature**

```ts
export const URI: "TypeNode" = ...
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export const UnknownArray: TypeNode<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: TypeNode<Record<string, unknown>> = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array<A>(items: TypeNode<A>): TypeNode<Array<A>> { ... }
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: TypeNode<boolean> = ...
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B>(typeNodeA: TypeNode<A>, typeNodeB: TypeNode<B>): TypeNode<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(id: string, f: () => TypeNode<A>): TypeNode<A> { ... }
```

Added in v3.0.0

# literal

**Signature**

```ts
export function literal<A extends Literal>(value: A): TypeNode<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends Literal>(values: NonEmptyArray<A>): TypeNode<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends Literal, B>(values: NonEmptyArray<A>, typeNode: TypeNode<B>): TypeNode<A | B> { ... }
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: TypeNode<number> = ...
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(properties: { [K in keyof A]: TypeNode<A[K]> }): TypeNode<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(codomain: TypeNode<A>): TypeNode<Record<string, A>> { ... }
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: TypeNode<string> = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum<T extends string>(
  _tag: T
): <A>(typeNodes: { [K in keyof A]: TypeNode<A[K] & Record<T, K>> }) => TypeNode<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple2

**Signature**

```ts
export function tuple2<A, B>(itemA: TypeNode<A>, itemB: TypeNode<B>): TypeNode<[A, B]> { ... }
```

Added in v3.0.0

# tuple3

**Signature**

```ts
export function tuple3<A, B, C>(itemA: TypeNode<A>, itemB: TypeNode<B>, itemC: TypeNode<C>): TypeNode<[A, B, C]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(properties: { [K in keyof A]: TypeNode<A[K]> }): TypeNode<A> { ... }
```

Added in v3.0.0

# typeNode

**Signature**

```ts
export const typeNode: S.Schemable<URI> & S.WithUnion<URI> = ...
```

Added in v3.0.0

# union

**Signature**

```ts
export function union<A extends [unknown, ...Array<unknown>]>(
  typeNodes: { [K in keyof A]: TypeNode<A[K]> }
): TypeNode<A[number]> { ... }
```

Added in v3.0.0
