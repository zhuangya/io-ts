# TypeScript compatibility

Requires `typescript@3.2.2`

# Error as recursive data structure

```ts
export type DecodeError =
  | Leaf
  | LabeledProduct // suitable for product types indexed by labels
  | IndexedProduct // suitable for product types indexed by integers
  | And // suitable for intersection types
  | Or // suitable for union types

export interface Leaf {
  type: 'Leaf'
  actual: unknown
  expected: string
}

export interface LabeledProduct {
  type: 'LabeledProduct'
  actual: unknown
  expected: string
  errors: { [key: string]: DecodeError }
}

export interface IndexedProduct {
  type: 'IndexedProduct'
  actual: unknown
  expected: string
  errors: Array<[number, DecodeError]>
}

export interface And {
  type: 'And'
  expected: string
  errors: Array<DecodeError>
}

export interface Or {
  type: 'Or'
  expected: string
  errors: Array<DecodeError>
}
```

## Benchmark

Source code: [`./perf/benchmark.ts`](./perf/benchmark.ts)

`io-ts@1.x`

```
space-object (decode, valid) x 229,927 ops/sec ±0.29% (86 runs sampled)
space-object (is, valid) x 1,024,511 ops/sec ±0.67% (90 runs sampled)
space-object (decode, invalid) x 215,336 ops/sec ±0.43% (90 runs sampled)
space-object (is, invalid) x 1,132,026 ops/sec ±0.71% (89 runs sampled)
```

`io-ts@2.x`

```
space-object (decode, valid) x 667,327 ops/sec ±1.54% (86 runs sampled)
space-object (is, valid) x 1,204,448 ops/sec ±0.60% (88 runs sampled)
space-object (decode, invalid) x 606,182 ops/sec ±1.33% (80 runs sampled)
space-object (is, invalid) x 1,309,109 ops/sec ±0.66% (87 runs sampled)
```

# Type

## Type parameters

Type parameters are now all required (no more defaults).

`A`, `O`, `I` type parameters of

- `InterfaceType`
- `PartialType`
- `UnionType`
- `ArrayType`
- `IntersectionType`
- `TupleType`
- `DictionaryType`

are gone.

Example

```diff
-export class InterfaceType<P, A = any, O = A, I = mixed> extends Type<A, O, I> {
+export class InterfaceType<P extends Props> extends Type<
+  { [K in keyof P]: TypeOf<P[K]> },
+  { [K in keyof P]: OutputOf<P[K]> },
+  unknown
+> {
```

## validate

The new `validate` is almost backward compatible (the context is now a `string`)

Example

The following definition is compatible with both versions

```ts
const NumberFromString = new t.Type(
  'NumberFromStringType',
  t.number.is,
  (u, c) =>
    t.string.validate(u, c).chain(s => {
      const n = +s
      return isNaN(n) ? t.failure(u, c) : t.success(n)
    }),
  String
)
```

# Tagged unions

The `taggedUnion` combinator is dropped in favour of a internal optimization of `union`

# Reporters

There's no `Reporter` interface.

## PathReporter

The new `PathReporter` is almost backward compatible (unions and intersections messages are slighly different)

Example

```ts
const Person = t.type(
  {
    name: t.type({
      firstName: t.string,
      lastName: t.string
    }),
    age: t.union([t.number, t.undefined])
  },
  'Person'
)

console.log(PathReporter.report(Person.decode({ name: {}, age: 'foo' })))
```

Output

```ts
;[
  'Invalid value undefined supplied to Person/name: { firstName: string, lastName: string }/firstName: string',
  'Invalid value undefined supplied to Person/name: { firstName: string, lastName: string }/lastName: string',
  'Invalid value "foo" supplied to Person/age: (number | undefined)/_: number',
  'Invalid value "foo" supplied to Person/age: (number | undefined)/_: undefined'
]
```

Note the `_` instead of a number in the last two messages

## TreeReporter

`DecodeError` should simplify to write custom reporters since it retains more informations.

As an example I developed `TreeReporter`, here's the output using the `Person` runtime type above and trying to decode the same invalid value

Output

```
Expected Person, but was {
  "name": {},
  "age": "foo"
}
├─ Invalid key "name"
│  └─ Invalid { firstName: string, lastName: string }
│     ├─ Invalid key "firstName"
│     │  └─ Expected string, but was undefined
│     └─ Invalid key "lastName"
│        └─ Expected string, but was undefined
└─ Invalid key "age"
   └─ Invalid (number | undefined)
      ├─ Expected number, but was "foo"
      └─ Expected undefined, but was "foo"
```

# Exact

`ExactType` and `StrictType` are gone, `InterfaceType` now strips additional properties, this should make sure that `keyof` and `Object.keys` are aligned.

# Clean and Alias

No more needed.

Solution: cast.

Example

```ts
const _Person = t.type({
  name: t.string,
  age: t.number
})
export interface Person extends t.TypeOf<typeof _Person> {}
export const Person: t.Type<Person, Person, unknown> = _Person

const TestPerson = t.type({
  person: Person
})
```

# Readonly

Solution: custom combinator

Example

```ts
// custom combinator
const readonly = <A, O, I>(type: t.Type<A, O, I>): t.Type<Readonly<A>, Readonly<O>, I> => {
  return type
}

const Person = readonly(
  t.type({
    name: t.string,
    age: t.number
  })
)
```

# ReadonlyArray

Solution: custom combinator

Example

```ts
// custom combinator
const readonlyArray = <A extends Array<unknown>, O extends Array<unknown>, I>(
  type: t.Type<A, O, I>
): t.Type<ReadonlyArray<A[number]>, ReadonlyArray<O[number]>, I> => {
  return type as any
}

const Numbers = readonlyArray(t.array(t.number))
```

# Refinements / branded types / newtypes

Solution: custom runtime type

Example (branded type)

```ts
export interface IntegerBrand {
  readonly Integer: unique symbol
}

export type Integer = number & IntegerBrand

const isInteger = (u: unknown): u is Integer => t.number.is(u) && u % 1 === 0

export const Integer = new t.Type<Integer, number, unknown>(
  'Integer',
  isInteger,
  (u, c) => (isInteger(u) ? t.success(u) : t.failure(u, c)),
  n => n
)
```

Example (wrapper)

```ts
export class EUR {
  private readonly brand!: symbol
  constructor(readonly value: number) {}
}

export const EURType = new t.Type<EUR, number, unknown>(
  'EUR',
  (u): u is EUR => u instanceof EUR,
  (u, c) => t.number.validate(u, c).chain(n => t.success(new EUR(n))),
  eur => eur.value
)
```

# Custom error messages

Solution: custom combinator

Example

```ts
export const withValidate = <T extends t.Mixed>(type: T, validate: T['validate']): T => {
  return {
    ...type,
    validate,
    decode: u => validate(u, type.name)
  }
}

export const withDecodeError = <T extends t.Mixed>(
  type: T,
  f: (u: unknown, context: string, error: t.DecodeError) => t.DecodeError
): T => {
  return withValidate(type, (u, c) => type.validate(u, c).mapLeft(e => f(u, c, e)))
}

export const withMessage = <T extends t.Mixed>(type: T, message: string): T => {
  return withDecodeError(type, u => t.leaf(u, message))
}

console.log(withMessage(t.string, 'Please enter a string').decode(null))
/*
left({
  "type": "Leaf",
  "actual": null,
  "expected": "Please enter a string"
})
*/
```

# Old issues

## [Finding field names in a reporter #158](https://github.com/gcanti/io-ts/issues/158)

```ts
const toMessage = (error: t.DecodeError): string => `Invalid ${error.expected}`

const FormReporter = {
  report: <A>(result: Either<t.DecodeError, A>): Array<string> => {
    if (result.isRight()) {
      return []
    } else {
      const error = result.value
      if (error.type === 'LabeledProduct') {
        return Object.keys(error.errors).map(key => toMessage(error.errors[key]))
      } else {
        return [toMessage(error)]
      }
    }
  }
}

// ID
interface IDBrand {
  readonly ID: unique symbol
}
type ID = number & IDBrand
const isID = (u: unknown): u is ID => t.number.is(u) && u > 0 && u % 1 === 0
const ID = new t.Type<ID, number, unknown>('ID', isID, (u, c) => (isID(u) ? t.success(u) : t.failure(u, c)), t.identity)

// Username
const rxUsername = /^[a-z0-9]{1,16}$/
interface UsernameBrand {
  readonly Username: unique symbol
}
type Username = string & UsernameBrand
const isUsername = (u: unknown): u is Username => t.string.is(u) && rxUsername.test(u)
const Username = new t.Type<Username, string, unknown>(
  'Username',
  isUsername,
  (u, c) => (isUsername(u) ? t.success(u) : t.failure(u, c)),
  t.identity
)

// Email
const rxEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
interface EmailBrand {
  readonly Email: unique symbol
}
type Email = string & EmailBrand
const isEmail = (u: unknown): u is Email => t.string.is(u) && rxEmail.test(u)
const Email = new t.Type<Email, string, unknown>(
  'Email',
  isEmail,
  (u, c) => (isEmail(u) ? t.success(u) : t.failure(u, c)),
  t.identity
)

const nullable = <T extends t.Mixed>(type: T): t.UnionType<[t.NullType, T]> => {
  const U = t.union([t.null, type])
  return withMessage(U, type.name)
}

const User = t.type(
  {
    id: ID,
    username: Username,
    email: nullable(Email)
  },
  'User'
)

console.log(FormReporter.report(User.decode(null)))
/*
[ 'Invalid User' ]
*/

console.log(
  FormReporter.report(
    User.decode({
      id: 'a',
      username: 'fred',
      email: 'testtest.com'
    })
  )
)
/*
[ 'Invalid ID', 'Invalid Email' ]
*/
```

# Breaking changes

- errors as recursive data structure `DecodeError` (instead of an array)
- required type parameters for Type
- (#165) drop `A`, `O`, `I` type parameters of
  - `InterfaceType`
  - `PartialType`
  - `UnionType`
  - `ArrayType`
  - `IntersectionType`
  - `TupleType`
  - `DictionaryType`
- drop `Decoder` interface
- drop `Encoder` interface
- drop `pipe` method
- drop `asDecoder` method
- drop `asEncoder` method
- drop `any` runtime type
- drop `object` runtime type
- drop `never` runtime type
- drop `void` runtime type
- drop `mixed` type
- drop `TypeOfProps` type
- drop `TypeOfProps` type
- drop `Is` type
- (#147, #172) `InterfaceType` now strips additional properties
  - drop `StrictType` -> `InterfaceType`
  - drop `ExactType` -> `InterfaceType`
- (#172) drop `RefinementType`
  - drop `Integer` type
- (#173) drop `taggedUnion` combinator
- drop `clean` combinator
- drop `alias` combinator
- drop `readonly` combinator
- drop `readonlyArray` combinator
- drop `RecursionType` in favour of `LazyType`

# Open problems and old issues

- (#165) enforcing a `_tag` in the `Type` class?
- can we drop `partial` for optional props?
- remove Or?
- more type-level tests
- taggedUnion with a lazy member?
- better algorithm for detecting tagged unions?
- (#171) Excluding properties from validation in dictionary
- (#172) Factory methods and other helpers
- (#195) Unexpected validation path from partial type
- (#197) Convert to JSON Schema
- (#203) helper to map input after validation
