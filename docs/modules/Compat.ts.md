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
- [TypeOf (type alias)](#typeof-type-alias)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [array](#array)
- [boolean](#boolean)
- [compat](#compat)
- [intersection](#intersection)
- [lazy](#lazy)
- [literals](#literals)
- [literalsOr](#literalsor)
- [make](#make)
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
export interface Compat<A> extends C.Codec<A>, G.Guard<A> {
  readonly name: string
}
```

Added in v3.0.0

# TypeOf (type alias)

**Signature**

```ts
export type TypeOf<C> = C extends Compat<infer A> ? A : never
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
export const URI: "Compat" = ...
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export const UnknownArray: Compat<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: Compat<Record<string, unknown>> = ...
```

Added in v3.0.0

# array

**Signature**

```ts
export function array<A>(compat: Compat<A>, name: string = `Array<${compat.name}>`): Compat<Array<A>> { ... }
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: Compat<boolean> = ...
```

Added in v3.0.0

# compat

**Signature**

```ts
export const compat: Schemable<URI> & WithRefinement<URI> & WithUnion<URI> = ...
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B, C, D, E>(
  compats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>, Compat<E>],
  name?: string
): Compat<A & B & C & D & E>
export function intersection<A, B, C, D>(
  compats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>],
  name?: string
): Compat<A & B & C & D>
export function intersection<A, B, C>(compats: [Compat<A>, Compat<B>, Compat<C>], name?: string): Compat<A & B & C>
export function intersection<A, B>(compats: [Compat<A>, Compat<B>], name?: string): Compat<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(f: () => Compat<A>): Compat<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends Literal>(
  values: NonEmptyArray<A>,
  name: string = values.map(value => JSON.stringify(value)).join(' | ')
): Compat<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends Literal, B>(
  values: NonEmptyArray<A>,
  compat: Compat<B>,
  name?: string
): Compat<A | B> { ... }
```

Added in v3.0.0

# make

**Signature**

```ts
export function make<A>(
  name: string,
  is: G.Guard<A>['is'],
  decode: C.Codec<A>['decode'],
  encode: C.Codec<A>['encode']
): Compat<A> { ... }
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: Compat<number> = ...
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(
  compats: { [K in keyof A]: Compat<A[K]> },
  name: string = `Partial<${getStructName(compats)}>`
): Compat<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(
  compat: Compat<A>,
  name: string = `Record<string, ${compat.name}>`
): Compat<Record<string, A>> { ... }
```

Added in v3.0.0

# refinement

**Signature**

```ts
export function refinement<A, B extends A>(
  compat: Compat<A>,
  parser: (a: A) => Either<string, B>,
  name: string
): Compat<B> { ... }
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: Compat<string> = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum<T extends string>(
  tag: T
): <A>(compats: { [K in keyof A]: Compat<A[K] & Record<T, K>> }, name?: string) => Compat<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple<A, B, C, D, E>(
  compats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>, Compat<E>],
  name?: string
): Compat<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  compats: [Compat<A>, Compat<B>, Compat<C>, Compat<D>],
  name?: string
): Compat<[A, B, C, D]>
export function tuple<A, B, C>(compats: [Compat<A>, Compat<B>, Compat<C>], name?: string): Compat<[A, B, C]>
export function tuple<A, B>(compats: [Compat<A>, Compat<B>], name?: string): Compat<[A, B]>
export function tuple<A>(compats: [Compat<A>], name?: string): Compat<[A]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(compats: { [K in keyof A]: Compat<A[K]> }, name: string = getStructName(compats)): Compat<A> { ... }
```

Added in v3.0.0

# union

**Signature**

```ts
export function union<A extends [unknown, ...Array<unknown>]>(
  compats: { [K in keyof A]: Compat<A[K]> },
  name: string = getTupleName(compats, ' | ')
): Compat<A[number]> { ... }
```

Added in v3.0.0
