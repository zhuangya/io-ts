---
title: TypeNode.ts
nav_order: 19
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
- [tuple](#tuple)
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
export function intersection<A, B, C, D, E>(
  typeNodes: [TypeNode<A>, TypeNode<B>, TypeNode<C>, TypeNode<D>, TypeNode<E>]
): TypeNode<A & B & C & D & E>
export function intersection<A, B, C, D>(
  typeNodes: [TypeNode<A>, TypeNode<B>, TypeNode<C>, TypeNode<D>]
): TypeNode<A & B & C & D>
export function intersection<A, B, C>(typeNodes: [TypeNode<A>, TypeNode<B>, TypeNode<C>]): TypeNode<A & B & C>
export function intersection<A, B>(typeNodes: [TypeNode<A>, TypeNode<B>]): TypeNode<A & B> { ... }
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
export function literal<A extends S.Literal>(value: A): TypeNode<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): TypeNode<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends S.Literal, B>(values: NonEmptyArray<A>, typeNode: TypeNode<B>): TypeNode<A | B> { ... }
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

# tuple

**Signature**

```ts
export function tuple<A, B, C, D, E>(
  items: [TypeNode<A>, TypeNode<B>, TypeNode<C>, TypeNode<D>, TypeNode<E>],
  id?: string
): TypeNode<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  items: [TypeNode<A>, TypeNode<B>, TypeNode<C>, TypeNode<D>],
  id?: string
): TypeNode<[A, B, C, D]>
export function tuple<A, B, C>(items: [TypeNode<A>, TypeNode<B>, TypeNode<C>]): TypeNode<[A, B, C]>
export function tuple<A, B>(items: [TypeNode<A>, TypeNode<B>]): TypeNode<[A, B]>
export function tuple<A>(items: [TypeNode<A>]): TypeNode<[A]> { ... }
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
