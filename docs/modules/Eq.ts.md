---
title: Eq.ts
nav_order: 7
parent: Modules
---

# Eq overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [array](#array)
- [boolean](#boolean)
- [eq](#eq)
- [intersection](#intersection)
- [lazy](#lazy)
- [nullable](#nullable)
- [number](#number)
- [partial](#partial)
- [record](#record)
- [string](#string)
- [sum](#sum)
- [tuple](#tuple)
- [type](#type)

---

# UnknownArray

**Signature**

```ts
export declare const UnknownArray: E.Eq<unknown[]>
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export declare const UnknownRecord: E.Eq<Record<string, unknown>>
```

Added in v3.0.0

# array

**Signature**

```ts
export declare const array: <A>(eq: E.Eq<A>) => E.Eq<A[]>
```

Added in v3.0.0

# boolean

**Signature**

```ts
export declare const boolean: E.Eq<boolean>
```

Added in v3.0.0

# eq

**Signature**

```ts
export declare const eq: Contravariant1<'Eq'> & S.Schemable<'Eq'>
```

Added in v3.0.0

# intersection

**Signature**

```ts
export declare function intersection<A, B>(left: Eq<A>, right: Eq<B>): Eq<A & B>
```

Added in v3.0.0

# lazy

**Signature**

```ts
export declare function lazy<A>(f: () => Eq<A>): Eq<A>
```

Added in v3.0.0

# nullable

**Signature**

```ts
export declare function nullable<A>(or: Eq<A>): Eq<null | A>
```

Added in v3.0.0

# number

**Signature**

```ts
export declare const number: E.Eq<number>
```

Added in v3.0.0

# partial

**Signature**

```ts
export declare function partial<A>(properties: { [K in keyof A]: Eq<A[K]> }): Eq<Partial<A>>
```

Added in v3.0.0

# record

**Signature**

```ts
export declare const record: <A>(codomain: E.Eq<A>) => E.Eq<Record<string, A>>
```

Added in v3.0.0

# string

**Signature**

```ts
export declare const string: E.Eq<string>
```

Added in v3.0.0

# sum

**Signature**

```ts
export declare function sum<T extends string>(
  tag: T
): <A>(members: { [K in keyof A]: Eq<A[K] & Record<T, K>> }) => Eq<A[keyof A]>
```

Added in v3.0.0

# tuple

**Signature**

```ts
export declare const tuple: <A extends readonly unknown[]>(...components: { [K in keyof A]: E.Eq<A[K]> }) => E.Eq<A>
```

Added in v3.0.0

# type

**Signature**

```ts
export declare const type: <A>(eqs: { [K in keyof A]: E.Eq<A[K]> }) => E.Eq<A>
```

Added in v3.0.0
