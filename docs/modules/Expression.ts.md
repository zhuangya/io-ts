---
title: Expression.ts
nav_order: 8
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
- [nullable](#nullable)
- [number](#number)
- [partial](#partial)
- [print](#print)
- [record](#record)
- [string](#string)
- [sum](#sum)
- [tuple](#tuple)
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
export declare function $ref(id: string): Expression<unknown>
```

Added in v3.0.0

# URI

**Signature**

```ts
export declare const URI: 'Expression'
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export declare const UnknownArray: Expression<unknown[]>
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export declare const UnknownRecord: Expression<Record<string, unknown>>
```

Added in v3.0.0

# array

**Signature**

```ts
export declare function array<A>(items: Expression<A>): Expression<Array<A>>
```

Added in v3.0.0

# boolean

**Signature**

```ts
export declare const boolean: Expression<boolean>
```

Added in v3.0.0

# expression

**Signature**

```ts
export declare const expression: S.Schemable<'Expression'> & S.WithUnion<'Expression'>
```

Added in v3.0.0

# intersection

**Signature**

```ts
export declare function intersection<A, B>(left: Expression<A>, right: Expression<B>): Expression<A & B>
```

Added in v3.0.0

# lazy

**Signature**

```ts
export declare function lazy<A>(id: string, f: () => Expression<A>): Expression<A>
```

Added in v3.0.0

# literal

**Signature**

```ts
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): Expression<A[number]>
```

Added in v3.0.0

# nullable

**Signature**

```ts
export declare function nullable<A>(or: Expression<A>): Expression<null | A>
```

Added in v3.0.0

# number

**Signature**

```ts
export declare const number: Expression<number>
```

Added in v3.0.0

# partial

**Signature**

```ts
export declare function partial<A>(properties: { [K in keyof A]: Expression<A[K]> }): Expression<Partial<A>>
```

Added in v3.0.0

# print

**Signature**

```ts
export declare function print(node: ts.Node): string
```

Added in v3.0.0

# record

**Signature**

```ts
export declare function record<A>(codomain: Expression<A>): Expression<Record<string, A>>
```

Added in v3.0.0

# string

**Signature**

```ts
export declare const string: Expression<string>
```

Added in v3.0.0

# sum

**Signature**

```ts
export declare function sum<T extends string>(
  tag: T
): <A>(members: { [K in keyof A]: Expression<A[K] & Record<T, K>> }) => Expression<A[keyof A]>
```

Added in v3.0.0

# tuple

**Signature**

```ts
export declare function tuple<A extends ReadonlyArray<unknown>>(
  ...components: { [K in keyof A]: Expression<A[K]> }
): Expression<A>
```

Added in v3.0.0

# type

**Signature**

```ts
export declare function type<A>(properties: { [K in keyof A]: Expression<A[K]> }): Expression<A>
```

Added in v3.0.0

# union

**Signature**

```ts
export declare function union<A extends ReadonlyArray<unknown>>(
  ...members: { [K in keyof A]: Expression<A[K]> }
): Expression<A[number]>
```

Added in v3.0.0
