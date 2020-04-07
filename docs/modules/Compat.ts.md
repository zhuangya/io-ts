---
title: Compat.ts
nav_order: 4
parent: Modules
---

# Compat overview

Missing

- `pipe` method
- `null` primitive
- `undefined` primitive
- `void` primitive
- `unknown` primitive

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Compat (interface)](#compat-interface)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [array](#array)
- [boolean](#boolean)
- [compat](#compat)
- [intersection](#intersection)
- [lazy](#lazy)
- [literal](#literal)
- [make](#make)
- [nullable](#nullable)
- [number](#number)
- [partial](#partial)
- [record](#record)
- [refinement](#refinement)
- [string](#string)
- [sum](#sum)
- [tuple](#tuple)
- [type](#type)
- [union](#union)

---

# Compat (interface)

Laws: same as `Codec`

**Signature**

```ts
export interface Compat<A> extends C.Codec<A>, G.Guard<A> {}
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
export declare const URI: 'Compat'
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export declare const UnknownArray: Compat<unknown[]>
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export declare const UnknownRecord: Compat<Record<string, unknown>>
```

Added in v3.0.0

# array

**Signature**

```ts
export declare function array<A>(items: Compat<A>): Compat<Array<A>>
```

Added in v3.0.0

# boolean

**Signature**

```ts
export declare const boolean: Compat<boolean>
```

Added in v3.0.0

# compat

**Signature**

```ts
export declare const compat: S.Schemable<'Compat'> & S.WithUnion<'Compat'>
```

Added in v3.0.0

# intersection

**Signature**

```ts
export declare function intersection<A, B>(left: Compat<A>, right: Compat<B>): Compat<A & B>
```

Added in v3.0.0

# lazy

**Signature**

```ts
export declare function lazy<A>(id: string, f: () => Compat<A>): Compat<A>
```

Added in v3.0.0

# literal

**Signature**

```ts
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): Compat<A[number]>
```

Added in v3.0.0

# make

**Signature**

```ts
export declare function make<A>(codec: C.Codec<A>, guard: G.Guard<A>): Compat<A>
```

Added in v3.0.0

# nullable

**Signature**

```ts
export declare function nullable<A>(or: Compat<A>): Compat<null | A>
```

Added in v3.0.0

# number

**Signature**

```ts
export declare const number: Compat<number>
```

Added in v3.0.0

# partial

**Signature**

```ts
export declare function partial<A>(properties: { [K in keyof A]: Compat<A[K]> }): Compat<Partial<A>>
```

Added in v3.0.0

# record

**Signature**

```ts
export declare function record<A>(codomain: Compat<A>): Compat<Record<string, A>>
```

Added in v3.0.0

# refinement

**Signature**

```ts
export declare function refinement<A, B extends A>(
  from: Compat<A>,
  refinement: (a: A) => a is B,
  expected: string
): Compat<B>
```

Added in v3.0.0

# string

**Signature**

```ts
export declare const string: Compat<string>
```

Added in v3.0.0

# sum

**Signature**

```ts
export declare function sum<T extends string>(
  tag: T
): <A>(members: { [K in keyof A]: Compat<A[K] & Record<T, K>> }) => Compat<A[keyof A]>
```

Added in v3.0.0

# tuple

**Signature**

```ts
export declare function tuple<A extends ReadonlyArray<unknown>>(
  ...components: { [K in keyof A]: Compat<A[K]> }
): Compat<A>
```

Added in v3.0.0

# type

**Signature**

```ts
export declare function type<A>(properties: { [K in keyof A]: Compat<A[K]> }): Compat<A>
```

Added in v3.0.0

# union

**Signature**

```ts
export declare function union<A extends ReadonlyArray<unknown>>(
  ...members: { [K in keyof A]: Compat<A[K]> }
): Compat<A[number]>
```

Added in v3.0.0
