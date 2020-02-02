---
title: Eq.ts
nav_order: 8
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
- [literals](#literals)
- [literalsOr](#literalsor)
- [number](#number)
- [partial](#partial)
- [record](#record)
- [refinement](#refinement)
- [string](#string)
- [sum](#sum)
- [tuple](#tuple)
- [type](#type)

---

# UnknownArray

**Signature**

```ts
export const UnknownArray: Eq<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: Eq<Record<string, unknown>> = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export const array: <A>(eq: Eq<A>) => Eq<Array<A>> = ...
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: Eq<boolean> = ...
```

Added in v3.0.0

# eq

**Signature**

```ts
export const eq: typeof E.eq & S.Schemable<E.URI> & S.WithRefinement<E.URI> = ...
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B, C, D, E>(eqs: [Eq<A>, Eq<B>, Eq<C>, Eq<D>, Eq<E>]): Eq<A & B & C & D & E>
export function intersection<A, B, C, D>(eqs: [Eq<A>, Eq<B>, Eq<C>, Eq<D>]): Eq<A & B & C & D>
export function intersection<A, B, C>(eqs: [Eq<A>, Eq<B>, Eq<C>]): Eq<A & B & C>
export function intersection<A, B>(eqs: [Eq<A>, Eq<B>]): Eq<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(f: () => Eq<A>): Eq<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends S.Literal>(_as: NonEmptyArray<A>): Eq<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends S.Literal, B>(as: NonEmptyArray<A>, eq: Eq<B>): Eq<A | B> { ... }
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: Eq<number> = ...
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(eqs: { [K in keyof A]: Eq<A[K]> }): Eq<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export const record: <A>(eq: Eq<A>) => Eq<Record<string, A>> = ...
```

Added in v3.0.0

# refinement

**Signature**

```ts
export function refinement<A, B extends A>(eq: Eq<A>, _parser: (a: A) => Either<string, B>): Eq<B> { ... }
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: Eq<string> = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum<T extends string>(tag: T): <A>(eqs: { [K in keyof A]: Eq<A[K] & Record<T, K>> }) => Eq<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple<A, B, C, D, E>(eqs: [Eq<A>, Eq<B>, Eq<C>, Eq<D>, Eq<E>]): Eq<[A, B, C, D, E]>
export function tuple<A, B, C, D>(eqs: [Eq<A>, Eq<B>, Eq<C>, Eq<D>]): Eq<[A, B, C, D]>
export function tuple<A, B, C>(eqs: [Eq<A>, Eq<B>, Eq<C>]): Eq<[A, B, C]>
export function tuple<A, B>(eqs: [Eq<A>, Eq<B>]): Eq<[A, B]>
export function tuple<A>(eqs: [Eq<A>]): Eq<[A]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export const type: <A>(eqs: { [K in keyof A]: Eq<A[K]> }) => Eq<A> = ...
```

Added in v3.0.0
