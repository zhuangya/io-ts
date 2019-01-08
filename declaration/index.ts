import * as t from '../src'

//
// type
//

const T1 = t.type({
  a: t.string
})

const T2 = t.type({
  b: T1
})

const T3 = t.type({
  c: T2
})

const T4 = t.type({
  d: T3
})

export const T5 = t.type({
  e: T4
})

//
// partial
//

const P1 = t.partial({
  a: t.string
})

const P2 = t.partial({
  b: P1
})

const P3 = t.partial({
  c: P2
})

const P4 = t.partial({
  d: P3
})

export const P5 = t.partial({
  e: P4
})

//
// dictionary
//

const D1 = t.dictionary(t.string, t.number)

const D2 = t.dictionary(t.string, D1)

const D3 = t.dictionary(t.string, D2)

const D4 = t.dictionary(t.string, D3)

export const D5 = t.dictionary(t.string, D4)

//
// alias pattern
//

const _Person = t.type({
  name: t.string,
  age: t.number
})

export interface Person extends t.TypeOf<typeof _Person> {}

export const Person: t.Type<Person, Person, unknown> = _Person

export const TestPerson = t.type({
  person: Person
})
