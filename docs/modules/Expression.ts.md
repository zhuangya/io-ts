---
title: Expression.ts
nav_order: 10
parent: Modules
---

# Expression overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Expression (interface)](#expression-interface)
- [URI (type alias)](#uri-type-alias)
- [\$ref](#ref)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [array](#array)
- [boolean](#boolean)
- [expression](#expression)
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

# Expression (interface)

**Signature**

```ts
export interface Expression<A> {
  readonly expression: () => C.Const<ts.Expression, A>
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
export function $ref(id: string): Expression<unknown> { ... }
```

Added in v3.0.0

# URI

**Signature**

```ts
export const URI: "Expression" = ...
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export const UnknownArray: Expression<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: Expression<Record<string, unknown>> = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array<A>(items: Expression<A>): Expression<Array<A>> { ... }
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: Expression<boolean> = ...
```

Added in v3.0.0

# expression

**Signature**

```ts
export const expression: S.Schemable<URI> & S.WithUnion<URI> = ...
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B>(left: Expression<A>, right: Expression<B>): Expression<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(id: string, f: () => Expression<A>): Expression<A> { ... }
```

Added in v3.0.0

# literal

**Signature**

```ts
export function literal<A extends Literal>(value: A): Expression<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends Literal>(values: readonly [A, ...Array<A>]): Expression<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends Literal, B>(
  values: readonly [A, ...Array<A>],
  or: Expression<B>
): Expression<A | B> { ... }
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: Expression<number> = ...
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(properties: { [K in keyof A]: Expression<A[K]> }): Expression<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(codomain: Expression<A>): Expression<Record<string, A>> { ... }
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: Expression<string> = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum<T extends string>(
  tag: T
): <A>(members: { [K in keyof A]: Expression<A[K] & Record<T, K>> }) => Expression<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple2

**Signature**

```ts
export function tuple2<A, B>(itemA: Expression<A>, itemB: Expression<B>): Expression<[A, B]> { ... }
```

Added in v3.0.0

# tuple3

**Signature**

```ts
export function tuple3<A, B, C>(
  itemA: Expression<A>,
  itemB: Expression<B>,
  itemC: Expression<C>
): Expression<[A, B, C]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(properties: { [K in keyof A]: Expression<A[K]> }): Expression<A> { ... }
```

Added in v3.0.0

# union

**Signature**

```ts
export function union<A extends [unknown, ...Array<unknown>]>(
  members: { [K in keyof A]: Expression<A[K]> }
): Expression<A[number]> { ... }
```

Added in v3.0.0
