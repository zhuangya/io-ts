---
title: Decoder.ts
nav_order: 6
parent: Modules
---

# Decoder overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Decoder (interface)](#decoder-interface)
- [TypeOf (type alias)](#typeof-type-alias)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [UnknownArray](#unknownarray)
- [UnknownRecord](#unknownrecord)
- [alt](#alt)
- [ap](#ap)
- [apFirst](#apfirst)
- [apSecond](#apsecond)
- [array](#array)
- [boolean](#boolean)
- [decoder](#decoder)
- [fromGuard](#fromguard)
- [intersection](#intersection)
- [lazy](#lazy)
- [literals](#literals)
- [literalsOr](#literalsor)
- [map](#map)
- [mapLeft](#mapleft)
- [never](#never)
- [number](#number)
- [parse](#parse)
- [partial](#partial)
- [record](#record)
- [refinement](#refinement)
- [string](#string)
- [sum](#sum)
- [tuple](#tuple)
- [type](#type)
- [union](#union)
- [withExpected](#withexpected)

---

# Decoder (interface)

**Signature**

```ts
export interface Decoder<A> {
  readonly decode: (u: unknown) => E.Either<DE.DecodeError, A>
}
```

Added in v3.0.0

# TypeOf (type alias)

**Signature**

```ts
export type TypeOf<D> = D extends Decoder<infer A> ? A : never
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
export const URI: "Decoder" = ...
```

Added in v3.0.0

# UnknownArray

**Signature**

```ts
export const UnknownArray: Decoder<Array<unknown>> = ...
```

Added in v3.0.0

# UnknownRecord

**Signature**

```ts
export const UnknownRecord: Decoder<Record<string, unknown>> = ...
```

Added in v3.0.0

# alt

**Signature**

```ts
<A>(that: () => Decoder<A>) => (fa: Decoder<A>) => Decoder<A>
```

Added in v3.0.0

# ap

**Signature**

```ts
<A>(fa: Decoder<A>) => <B>(fab: Decoder<(a: A) => B>) => Decoder<B>
```

Added in v3.0.0

# apFirst

**Signature**

```ts
<B>(fb: Decoder<B>) => <A>(fa: Decoder<A>) => Decoder<A>
```

Added in v3.0.0

# apSecond

**Signature**

```ts
<B>(fb: Decoder<B>) => <A>(fa: Decoder<A>) => Decoder<B>
```

Added in v3.0.0

# array

**Signature**

```ts
export function array<A>(decoder: Decoder<A>): Decoder<Array<A>> { ... }
```

Added in v3.0.0

# boolean

**Signature**

```ts
export const boolean: Decoder<boolean> = ...
```

Added in v3.0.0

# decoder

**Signature**

```ts
export const decoder: Applicative1<URI> & Alternative1<URI> & S.Schemable<URI> & S.WithParse<URI> & S.WithUnion<URI> = ...
```

Added in v3.0.0

# fromGuard

**Signature**

```ts
export function fromGuard<A>(guard: G.Guard<A>, expected: string): Decoder<A> { ... }
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B, C, D, E>(
  decoders: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>, Decoder<E>]
): Decoder<A & B & C & D & E>
export function intersection<A, B, C, D>(
  decoders: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>]
): Decoder<A & B & C & D>
export function intersection<A, B, C>(decoders: [Decoder<A>, Decoder<B>, Decoder<C>]): Decoder<A & B & C>
export function intersection<A, B>(decoders: [Decoder<A>, Decoder<B>]): Decoder<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(f: () => Decoder<A>): Decoder<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends S.Literal>(values: NonEmptyArray<A>): Decoder<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends S.Literal, B>(values: NonEmptyArray<A>, decoder: Decoder<B>): Decoder<A | B> { ... }
```

Added in v3.0.0

# map

**Signature**

```ts
<A, B>(f: (a: A) => B) => (fa: Decoder<A>) => Decoder<B>
```

Added in v3.0.0

# mapLeft

**Signature**

```ts
export function mapLeft<A>(decoder: Decoder<A>, f: (e: DE.DecodeError) => DE.DecodeError): Decoder<A> { ... }
```

Added in v3.0.0

# never

**Signature**

```ts
export const never: Decoder<never> = ...
```

Added in v3.0.0

# number

**Signature**

```ts
export const number: Decoder<number> = ...
```

Added in v3.0.0

# parse

**Signature**

```ts
export function parse<A, B>(decoder: Decoder<A>, parser: (a: A) => E.Either<string, B>): Decoder<B> { ... }
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(decoders: { [K in keyof A]: Decoder<A[K]> }): Decoder<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(decoder: Decoder<A>): Decoder<Record<string, A>> { ... }
```

Added in v3.0.0

# refinement

**Signature**

```ts
export const refinement: S.WithRefinement<URI>['refinement'] = ...
```

Added in v3.0.0

# string

**Signature**

```ts
export const string: Decoder<string> = ...
```

Added in v3.0.0

# sum

**Signature**

```ts
export function sum<T extends string>(
  tag: T
): <A>(decoders: { [K in keyof A]: Decoder<A[K] & Record<T, K>> }) => Decoder<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple<A, B, C, D, E>(
  decoders: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>, Decoder<E>]
): Decoder<[A, B, C, D, E]>
export function tuple<A, B, C, D>(decoders: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>]): Decoder<[A, B, C, D]>
export function tuple<A, B, C>(decoders: [Decoder<A>, Decoder<B>, Decoder<C>]): Decoder<[A, B, C]>
export function tuple<A, B>(decoders: [Decoder<A>, Decoder<B>]): Decoder<[A, B]>
export function tuple<A>(decoders: [Decoder<A>]): Decoder<[A]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(decoders: { [K in keyof A]: Decoder<A[K]> }): Decoder<A> { ... }
```

Added in v3.0.0

# union

**Signature**

```ts
export function union<A extends [unknown, ...Array<unknown>]>(
  decoders: { [K in keyof A]: Decoder<A[K]> }
): Decoder<A[number]> { ... }
```

Added in v3.0.0

# withExpected

**Signature**

```ts
export function withExpected<A>(decoder: Decoder<A>, expected: string): Decoder<A> { ... }
```

Added in v3.0.0
