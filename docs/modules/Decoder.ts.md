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
- [literal](#literal)
- [literals](#literals)
- [literalsOr](#literalsor)
- [map](#map)
- [mapLeft](#mapleft)
- [never](#never)
- [number](#number)
- [parse](#parse)
- [partial](#partial)
- [record](#record)
- [string](#string)
- [sum](#sum)
- [tuple](#tuple)
- [type](#type)
- [union](#union)
- [withMessage](#withmessage)

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
export function array<A>(items: Decoder<A>, id?: string): Decoder<Array<A>> { ... }
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
export const decoder: Applicative1<URI> & Alternative1<URI> & S.Schemable<URI> & S.WithUnion<URI> & S.WithParse<URI> = ...
```

Added in v3.0.0

# fromGuard

**Signature**

```ts
export function fromGuard<A>(guard: G.Guard<A>, id?: string, message?: (u: unknown) => string): Decoder<A> { ... }
```

Added in v3.0.0

# intersection

**Signature**

```ts
export function intersection<A, B>(decoderA: Decoder<A>, decoderB: Decoder<B>, id?: string): Decoder<A & B> { ... }
```

Added in v3.0.0

# lazy

**Signature**

```ts
export function lazy<A>(id: string, f: () => Decoder<A>): Decoder<A> { ... }
```

Added in v3.0.0

# literal

**Signature**

```ts
export function literal<A extends Literal>(value: A, id?: string): Decoder<A> { ... }
```

Added in v3.0.0

# literals

**Signature**

```ts
export function literals<A extends Literal>(values: NonEmptyArray<A>, id?: string): Decoder<A> { ... }
```

Added in v3.0.0

# literalsOr

**Signature**

```ts
export function literalsOr<A extends Literal, B>(
  values: NonEmptyArray<A>,
  decoder: Decoder<B>,
  id?: string
): Decoder<A | B> { ... }
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
export function parse<A, B>(decoder: Decoder<A>, parser: (a: A) => E.Either<string, B>, id?: string): Decoder<B> { ... }
```

Added in v3.0.0

# partial

**Signature**

```ts
export function partial<A>(properties: { [K in keyof A]: Decoder<A[K]> }, id?: string): Decoder<Partial<A>> { ... }
```

Added in v3.0.0

# record

**Signature**

```ts
export function record<A>(codomain: Decoder<A>, id?: string): Decoder<Record<string, A>> { ... }
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
): <A>(decoders: { [K in keyof A]: Decoder<A[K] & Record<T, K>> }, id?: string) => Decoder<A[keyof A]> { ... }
```

Added in v3.0.0

# tuple

**Signature**

```ts
export function tuple<A, B, C, D, E>(
  items: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>, Decoder<E>],
  id?: string
): Decoder<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  items: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>],
  id?: string
): Decoder<[A, B, C, D]>
export function tuple<A, B, C>(items: [Decoder<A>, Decoder<B>, Decoder<C>], id?: string): Decoder<[A, B, C]>
export function tuple<A, B>(items: [Decoder<A>, Decoder<B>], id?: string): Decoder<[A, B]>
export function tuple<A>(items: [Decoder<A>], id?: string): Decoder<[A]> { ... }
```

Added in v3.0.0

# type

**Signature**

```ts
export function type<A>(properties: { [K in keyof A]: Decoder<A[K]> }, id?: string): Decoder<A> { ... }
```

Added in v3.0.0

# union

**Signature**

```ts
export function union<A extends [unknown, ...Array<unknown>]>(
  decoders: { [K in keyof A]: Decoder<A[K]> },
  id?: string
): Decoder<A[number]> { ... }
```

Added in v3.0.0

# withMessage

**Signature**

```ts
export function withMessage<A>(decoder: Decoder<A>, message: (e: DE.DecodeError) => string): Decoder<A> { ... }
```

Added in v3.0.0
