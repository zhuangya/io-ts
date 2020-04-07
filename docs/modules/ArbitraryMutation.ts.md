---
title: ArbitraryMutation.ts
nav_order: 2
parent: Modules
---

# ArbitraryMutation overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [ArbitraryMutation (interface)](#arbitrarymutation-interface)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [arbitraryMutation](#arbitrarymutation)
- [array](#array)
- [boolean](#boolean)
- [intersection](#intersection)
- [lazy](#lazy)
- [literal](#literal)
- [make](#make)
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

# ArbitraryMutation (interface)

**Signature**

```ts
export interface ArbitraryMutation<A> {
  /** the mutation */
  mutation: fc.Arbitrary<unknown>
  /** the corresponding valid arbitrary */
  arbitrary: fc.Arbitrary<A>
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
export declare const URI: 'ArbitraryMutation'
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export declare const UnknownArray: ArbitraryMutation<unknown[]>
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export declare const UnknownRecord: ArbitraryMutation<Record<string, unknown>>
```

Added in v3.0.0

# arbitraryMutation

**Signature**

```ts
export declare const arbitraryMutation: S.Schemable<'ArbitraryMutation'> & S.WithUnion<'ArbitraryMutation'>
```

Added in v3.0.0

# array

**Signature**

```ts
export declare function array<A>(items: ArbitraryMutation<A>): ArbitraryMutation<Array<A>>
```

Added in v3.0.0

# boolean

**Signature**

```ts
export declare const boolean: ArbitraryMutation<boolean>
```

Added in v3.0.0

# intersection

**Signature**

```ts
export declare function intersection<A, B>(
  left: ArbitraryMutation<A>,
  right: ArbitraryMutation<B>
): ArbitraryMutation<A & B>
```

Added in v3.0.0

# lazy

**Signature**

```ts
export declare function lazy<A>(f: () => ArbitraryMutation<A>): ArbitraryMutation<A>
```

Added in v3.0.0

# literal

**Signature**

```ts
export declare function literal<A extends ReadonlyArray<Literal>>(...values: A): ArbitraryMutation<A[number]>
```

Added in v3.0.0

# make

**Signature**

```ts
export declare function make<A>(mutation: fc.Arbitrary<unknown>, arbitrary: fc.Arbitrary<A>): ArbitraryMutation<A>
```

Added in v3.0.0

# nullable

**Signature**

```ts
export declare function nullable<A>(or: ArbitraryMutation<A>): ArbitraryMutation<null | A>
```

Added in v3.0.0

# number

**Signature**

```ts
export declare const number: ArbitraryMutation<number>
```

Added in v3.0.0

# partial

**Signature**

```ts
export declare function partial<A>(
  properties: { [K in keyof A]: ArbitraryMutation<A[K]> }
): ArbitraryMutation<Partial<A>>
```

Added in v3.0.0

# record

**Signature**

```ts
export declare function record<A>(codomain: ArbitraryMutation<A>): ArbitraryMutation<Record<string, A>>
```

Added in v3.0.0

# string

**Signature**

```ts
export declare const string: ArbitraryMutation<string>
```

Added in v3.0.0

# sum

**Signature**

```ts
export declare function sum<T extends string>(
  tag: T
): <A>(members: { [K in keyof A]: ArbitraryMutation<A[K] & Record<T, K>> }) => ArbitraryMutation<A[keyof A]>
```

Added in v3.0.0

# tuple

**Signature**

```ts
export declare function tuple<A extends ReadonlyArray<unknown>>(
  ...components: { [K in keyof A]: ArbitraryMutation<A[K]> }
): ArbitraryMutation<A>
```

Added in v3.0.0

# type

**Signature**

```ts
export declare function type<A>(properties: { [K in keyof A]: ArbitraryMutation<A[K]> }): ArbitraryMutation<A>
```

Added in v3.0.0

# union

**Signature**

```ts
export declare function union<A extends ReadonlyArray<unknown>>(
  ...members: { [K in keyof A]: ArbitraryMutation<A[K]> }
): ArbitraryMutation<A[number]>
```

Added in v3.0.0
