# Installation

To install the candidate version:

```sh
npm i gcanti/io-ts#v3 fp-ts
```

# Decoder interface

```ts
export interface Decoder<A> {
  readonly decode: (u: unknown) => E.Either<NonEmptyArray<T.Tree<string>>, A>
}
```

**Example**

A codec representing `string` can be defined as:

```ts
import * as D from 'io-ts/lib/Decoder'

export const string: D.Decoder<string> = {
  decode: u =>
    typeof u === 'string' ? D.success(u) : D.failure(`cannot decode ${JSON.stringify(u)}, should be string`)
}
```

and we can use it as follows:

```ts
import { isRight } from 'fp-ts/lib/Either'

console.log(isRight(string.decode('a'))) // => true
console.log(isRight(string.decode(null))) // => false
```

More generally the result of calling `decode` can be handled using [`fold`](https://gcanti.github.io/fp-ts/modules/Either.ts.html#fold-function) along with `pipe` (which is similar to the pipeline operator)

```ts
import { pipe } from 'fp-ts/lib/pipeable'
import { fold } from 'fp-ts/lib/Either'

console.log(
  pipe(
    string.decode(null),
    fold(
      // failure handler
      errors => console.error(errors),
      // success handler
      a => console.log(a)
    )
  )
)
// => [ { value: 'cannot decode null, should be string', forest: [] } ]
```

# Combinators

We can combine these primitive decoders through _combinators_ to build composite types which represent entities like domain models, request payloads etc. in our applications.

## Built-in primitive decoders

- `string`
- `number`
- `boolean`
- `UnknownArray`
- `UnknownRecord`

## The `literal` constructor

The `literal` constructor describes one or more literals.

```ts
export const MyLiteral: D.Decoder<'a'> = D.literal('a')
export const MyLiterals: D.Decoder<'a' | 'b'> = D.literal('a', 'b')
```

## The `nullable` combinator

The `nullable` combinator describes a nullable value

```ts
export const NullableString: D.Decoder<null | string> = D.nullable(D.string)
```

## The `type` combinator

The `type` combinator describes an object with required fields.

```ts
export const Person = D.type({
  name: D.string,
  age: D.number
})

console.log(isRight(Person.decode({ name: 'name', age: 42 }))) // => true
console.log(isRight(Person.decode({ name: 'name' }))) // => false
```

The `type` combinator will strip additional fields while decoding

```ts
console.log(Person.decode({ name: 'name', age: 42, remeberMe: true }))
// => { _tag: 'Right', right: { name: 'name', age: 42 } }
```

## The `partial` combinator

The `partial` combinator describes an object with optional fields.

```ts
export const Person = D.partial({
  name: D.string,
  age: D.number
})

console.log(isRight(Person.decode({ name: 'name', age: 42 }))) // => true
console.log(isRight(Person.decode({ name: 'name' }))) // => true
```

The `partial` combinator will strip additional fields while decoding

```ts
console.log(Person.decode({ name: 'name', remeberMe: true }))
// => { _tag: 'Right', right: { name: 'name' } }
```

## The `record` combinator

The `record` combinator describes a `Record<string, ?>`

```ts
export const MyRecord: D.Decoder<Record<string, number>> = D.record(D.number)

console.log(isRight(MyRecord.decode({ a: 1, b: 2 }))) // => true
```

## The `array` combinator

The `array` combinator describes an array `Array<?>`

```ts
export const MyArray: D.Decoder<Array<number>> = D.array(D.number)

console.log(isRight(MyArray.decode([1, 2, 3]))) // => true
```

## The `tuple` combinator

The `tuple` combinator describes a `n`-tuple

```ts
export const MyTuple: D.Decoder<[string, number]> = D.tuple(D.string, D.number)

console.log(isRight(MyTuple.decode(['a', 1]))) // => true
```

The `tuple` combinator will strip additional components while decoding

```ts
console.log(MyTuple.decode(['a', 1, true])) // => { _tag: 'Right', right: [ 'a', 1 ] }
```

## The `intersection` combinator

The `intersection` combinator is useful in order to mix required and optional props

```ts
export const Person = D.intersection(
  D.type({
    name: D.string
  }),
  D.partial({
    age: D.number
  })
)

console.log(isRight(Person.decode({ name: 'name' }))) // => true
console.log(isRight(Person.decode({}))) // => false
```

## The `sum` combinator

The `sum` combinator describes tagged unions (aka sum types)

```ts
export const MySum: D.Decoder<
  | {
      type: 'A'
      a: string
    }
  | {
      type: 'B'
      b: number
    }
> = D.sum('type')({
  A: D.type({ type: D.literal('A'), a: D.string }),
  B: D.type({ type: D.literal('B'), b: D.number })
})
```
