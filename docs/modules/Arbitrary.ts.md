---
title: Arbitrary.ts
nav_order: 1
parent: Modules
---

# Arbitrary overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Arbitrary (interface)](#arbitrary-interface)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [arbitrary](#arbitrary)
- [array](#array)
- [boolean](#boolean)
- [intersection](#intersection)
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

# Arbitrary (interface)

**Signature**

```ts
export interface Arbitrary<A> extends fc.Arbitrary<A> {}
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
export declare const URI: 'Arbitrary'
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export declare const UnknownArray: Arbitrary<unknown[]>
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export declare const UnknownRecord: Arbitrary<Record<string, unknown>>
```

Added in v3.0.0

# arbitrary

**Signature**

```ts
export declare const arbitrary: S.Schemable<'Arbitrary'> & S.WithUnion<'Arbitrary'>
```

Added in v3.0.0

# array

**Signature**

```ts
export declare function array<A>(items: Arbitrary<A>): Arbitrary<Array<A>>
```

Added in v3.0.0

# boolean

**Signature**

```ts
export declare const boolean: Arbitrary<boolean>
```

Added in v3.0.0

# intersection

**Signature**

```ts
export declare function intersection<A, B>(left: Arbitrary<A>, right: Arbitrary<B>): Arbitrary<A & B>
```

Added in v3.0.0

# lazy

**Signature**

```ts
export declare function lazy<A>(f: () => Arbitrary<A>): Arbitrary<A>
```

Added in v3.0.0

# literal

**Signature**

```ts
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): Arbitrary<A[number]>
```

Added in v3.0.0

# nullable

**Signature**

```ts
export declare function nullable<A>(or: Arbitrary<A>): Arbitrary<null | A>
```

Added in v3.0.0

# number

**Signature**

```ts
export declare const number: Arbitrary<number>
```

Added in v3.0.0

# partial

**Signature**

```ts
export declare function partial<A>(properties: { [K in keyof A]: Arbitrary<A[K]> }): Arbitrary<Partial<A>>
```

Added in v3.0.0

# record

**Signature**

```ts
export declare function record<A>(codomain: Arbitrary<A>): Arbitrary<Record<string, A>>
```

Added in v3.0.0

# string

**Signature**

```ts
export declare const string: Arbitrary<string>
```

Added in v3.0.0

# sum

**Signature**

```ts
export declare function sum<T extends string>(
  _tag: T
): <A>(members: { [K in keyof A]: Arbitrary<A[K] & Record<T, K>> }) => Arbitrary<A[keyof A]>
```

Added in v3.0.0

# tuple

**Signature**

```ts
export declare function tuple<A extends ReadonlyArray<unknown>>(
  ...components: { [K in keyof A]: Arbitrary<A[K]> }
): Arbitrary<A>
```

Added in v3.0.0

# type

**Signature**

```ts
export declare function type<A>(properties: { [K in keyof A]: Arbitrary<A[K]> }): Arbitrary<A>
```

Added in v3.0.0

# union

**Signature**

```ts
export declare function union<A extends ReadonlyArray<unknown>>(
  ...members: { [K in keyof A]: Arbitrary<A[K]> }
): Arbitrary<A[number]>
```

Added in v3.0.0
