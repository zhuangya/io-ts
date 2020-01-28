import * as fc from 'fast-check'
import * as A from '../src/Arbitrary'
import * as D from '../src/Decoder'
import * as E from '../src/Eq'
import * as G from '../src/Guard'
import * as J from '../src/JsonSchema'
import { URIS, Kind } from 'fp-ts/lib/HKT'
import * as S from '../src/Schemable'
import { isRight, right, left } from 'fp-ts/lib/Either'
import * as Ajv from 'ajv'

const ajv = new Ajv()

function run<A>(jsonSchema: J.JsonSchema<A>, a: A): boolean {
  return ajv.compile(jsonSchema)(a) as any
}

interface Schema<A> {
  <S extends URIS>(S: S.Schemable<S>): Kind<S, A>
}

function make<A>(f: Schema<A>): Schema<A> {
  return f
}

function assert<A>(schema: Schema<A>): void {
  const arb = schema(A.arbitrary)
  const decoder = schema(D.decoder)
  const eq = schema(E.eq)
  const guard = schema(G.guard)
  const jsonSchema = schema(J.jsonSchema)
  fc.assert(fc.property(arb, a => guard.is(a) && eq.equals(a, a) && isRight(decoder.decode(a)) && run(jsonSchema, a)))
}

interface SchemaWithUnion<A> {
  <S extends URIS>(S: S.Schemable<S> & S.WithUnion<S>): Kind<S, A>
}

function makeWithUnion<A>(f: SchemaWithUnion<A>): SchemaWithUnion<A> {
  return f
}

function assertWithUnion<A>(schema: SchemaWithUnion<A>): void {
  const arb = schema(A.arbitrary)
  const decoder = schema(D.decoder)
  const guard = schema(G.guard)
  const jsonSchema = schema(J.jsonSchema)
  fc.assert(fc.property(arb, a => guard.is(a) && isRight(decoder.decode(a)) && run(jsonSchema, a)))
}

interface SchemaWithParse<A> {
  <S extends URIS>(S: S.Schemable<S> & S.WithParse<S>): Kind<S, A>
}

function makeWithParse<A>(f: SchemaWithParse<A>): SchemaWithParse<A> {
  return f
}

function assertWithParse<A>(schema: SchemaWithParse<A>): void {
  const arb = schema(A.arbitrary)
  const decoder = schema(D.decoder)
  const guard = schema(G.guard)
  fc.assert(fc.property(arb, a => guard.is(a) && isRight(decoder.decode(a))))
}

describe('Arbitrary', () => {
  it('string', () => {
    assert(make(S => S.string))
  })

  it('number', () => {
    assert(make(S => S.number))
  })

  it('boolean', () => {
    assert(make(S => S.boolean))
  })

  it('UnknownArray', () => {
    assert(make(S => S.UnknownArray))
  })

  it('UnknownRecord', () => {
    assert(make(S => S.UnknownRecord))
  })

  it('literals', () => {
    assert(make(S => S.literals(['a', null])))
  })

  it('literalsOr', () => {
    assert(make(S => S.literalsOr(['a', null], S.type({ a: S.string }))))
  })

  it('type', () => {
    assert(
      make(S =>
        S.type({
          name: S.string,
          age: S.number
        })
      )
    )
  })

  it('partial', () => {
    assert(
      make(S =>
        S.partial({
          name: S.string,
          age: S.number
        })
      )
    )
  })

  it('record', () => {
    assert(make(S => S.record(S.string)))
  })

  it('array', () => {
    assert(make(S => S.array(S.string)))
  })

  it('tuple', () => {
    assert(make(S => S.tuple([S.string, S.number])))
  })

  it('intersection', () => {
    assert(make(S => S.intersection([S.type({ a: S.string }), S.type({ b: S.number })])))
  })

  it('sum', () => {
    const A = make(S => S.type({ _tag: S.literals(['A']), a: S.string }))
    const B = make(S => S.type({ _tag: S.literals(['B']), b: S.number }))
    assert(make(S => S.sum('_tag')({ A: A(S), B: B(S) })))
  })

  it('parse', () => {
    assertWithParse(makeWithParse(S => S.parse(S.number, n => (n > 0 ? right(n) : left('Positive')))))
  })

  it('union', () => {
    assertWithUnion(makeWithUnion(S => S.union([S.type({ a: S.string }), S.type({ b: S.number })])))
  })
})
