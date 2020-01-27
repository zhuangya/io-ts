---
title: Guard.ts
nav_order: 7
parent: Modules
---

# Guard overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Guard (interface)](#guard-interface)
- [URI (type alias)](#uri-type-alias)
- [Int (constant)](#int-constant)
- [URI (constant)](#uri-constant)
- [UnknownArray (constant)](#unknownarray-constant)
- [UnknownRecord (constant)](#unknownrecord-constant)
- [boolean (constant)](#boolean-constant)
- [guard (constant)](#guard-constant)
- [number (constant)](#number-constant)
- [string (constant)](#string-constant)
- [array (function)](#array-function)
- [constants (function)](#constants-function)
- [constantsOr (function)](#constantsor-function)
- [intersection (function)](#intersection-function)
- [lazy (function)](#lazy-function)
- [parse (function)](#parse-function)
- [partial (function)](#partial-function)
- [record (function)](#record-function)
- [sum (function)](#sum-function)
- [tuple (function)](#tuple-function)
- [type (function)](#type-function)
- [union (function)](#union-function)

---

# Guard (interface)

**Signature**

```ts
export interface Guard<A> {
  is: (u: unknown) => u is A
}
```

Added in v3.0.0

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v3.0.0

# Int (constant)

**Signature**

```ts
export const Int: Guard<S.Int> = ...
```

Added in v3.0.0

# URI (constant)

**Signature**

```ts
export const URI: "Guard" = ...
```

Added in v3.0.0

# UnknownArray (constant)

**Signature**

```ts
export const UnknownArray: Guard<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord (constant)

**Signature**

```ts
export const UnknownRecord: Guard<Record<string, unknown>> = ...
```

Added in v3.0.0

# boolean (constant)

**Signature**

```ts
export const boolean: Guard<boolean> = ...
```

Added in v3.0.0

# guard (constant)

**Signature**

```ts
export const guard: S.Schemable<URI> & S.WithParse<URI> & S.WithUnion<URI> = ...
```

Added in v3.0.0

# number (constant)

**Signature**

```ts
export const number: Guard<number> = ...
```

Added in v3.0.0

# string (constant)

**Signature**

```ts
export const string: Guard<string> = ...
```

Added in v3.0.0

# array (function)

**Signature**

```ts
export function array<A>(guard: Guard<A>): Guard<Array<A>> { ... }
```

Added in v3.0.0

# constants (function)

**Signature**

```ts
export function constants<A>(as: NonEmptyArray<A>): Guard<A> { ... }
```

Added in v3.0.0

# constantsOr (function)

**Signature**

```ts
export function constantsOr<A, B>(as: NonEmptyArray<A>, guard: Guard<B>): Guard<A | B> { ... }
```

Added in v3.0.0

# intersection (function)

**Signature**

```ts
export function intersection<A, B, C, D, E>(
  guards: [Guard<A>, Guard<B>, Guard<C>, Guard<D>, Guard<E>]
): Guard<A & B & C & D & E>
export function intersection<A, B, C, D>(guards: [Guard<A>, Guard<B>, Guard<C>, Guard<D>]): Guard<A & B & C & D>
export function intersection<A, B, C>(guards: [Guard<A>, Guard<B>, Guard<C>]): Guard<A & B & C>
export function intersection<A, B>(guards: [Guard<A>, Guard<B>]): Guard<A & B> { ... }
```

Added in v3.0.0

# lazy (function)

**Signature**

```ts
export function lazy<A>(f: () => Guard<A>): Guard<A> { ... }
```

Added in v3.0.0

# parse (function)

**Signature**

```ts
export function parse<A, B>(guard: Guard<A>, parser: (a: A) => Either<string, B>): Guard<B> { ... }
```

Added in v3.0.0

# partial (function)

**Signature**

```ts
export function partial<A>(guards: { [K in keyof A]: Guard<A[K]> }): Guard<Partial<A>> { ... }
```

Added in v3.0.0

# record (function)

**Signature**

```ts
export function record<A>(guard: Guard<A>): Guard<Record<string, A>> { ... }
```

Added in v3.0.0

# sum (function)

**Signature**

```ts
export function sum<T extends string>(
  tag: T
): <A>(guards: { [K in keyof A]: Guard<A[K] & Record<T, K>> }) => Guard<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple (function)

**Signature**

```ts
export function tuple<A, B, C, D, E>(guards: [Guard<A>, Guard<B>, Guard<C>, Guard<D>, Guard<E>]): Guard<[A, B, C, D, E]>
export function tuple<A, B, C, D>(guards: [Guard<A>, Guard<B>, Guard<C>, Guard<D>]): Guard<[A, B, C, D]>
export function tuple<A, B, C>(guards: [Guard<A>, Guard<B>, Guard<C>]): Guard<[A, B, C]>
export function tuple<A, B>(guards: [Guard<A>, Guard<B>]): Guard<[A, B]>
export function tuple<A>(guards: [Guard<A>]): Guard<[A]> { ... }
```

Added in v3.0.0

# type (function)

**Signature**

```ts
export function type<A>(guards: { [K in keyof A]: Guard<A[K]> }): Guard<A> { ... }
```

Added in v3.0.0

# union (function)

**Signature**

```ts
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  guards: { [K in keyof A]: Guard<A[K]> }
): Guard<A[number]> { ... }
```

Added in v3.0.0
