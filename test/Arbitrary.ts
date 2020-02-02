import * as fc from 'fast-check'
import * as Arb from '../src/Arbitrary'
import * as ArbMut from '../src/ArbitraryMutation'
import * as D from '../src/Decoder'
import * as E from '../src/Eq'
import * as G from '../src/Guard'
import * as J from '../src/JsonSchema'
import { URIS, Kind } from 'fp-ts/lib/HKT'
import * as S from '../src/Schemable'
import { isRight, right, left, isLeft, Either } from 'fp-ts/lib/Either'
import * as Ajv from 'ajv'

const ajv = new Ajv()

interface Schema<A> {
  <S extends URIS>(S: S.Schemable<S>): Kind<S, A>
}

function make<A>(f: Schema<A>): Schema<A> {
  return f
}

function assert<A>(schema: Schema<A>): void {
  const arb = schema(Arb.arbitrary)
  const mutation = schema(ArbMut.arbitraryMutation)
  const decoder = schema(D.decoder)
  const eq = schema(E.eq)
  const guard = schema(G.guard)
  const jsonSchema = ajv.compile(schema(J.jsonSchema)())
  fc.assert(
    fc.property(arb, a => guard.is(a) && eq.equals(a, a) && isRight(decoder.decode(a)) && Boolean(jsonSchema(a)))
  )
  fc.assert(fc.property(mutation, m => !guard.is(m) && isLeft(decoder.decode(m))))
}

interface SchemaWithUnion<A> {
  <S extends URIS>(S: S.Schemable<S> & S.WithUnion<S>): Kind<S, A>
}

function makeWithUnion<A>(f: SchemaWithUnion<A>): SchemaWithUnion<A> {
  return f
}

function assertWithUnion<A>(schema: SchemaWithUnion<A>): void {
  const arb = schema(Arb.arbitrary)
  const mutation = schema(ArbMut.arbitraryMutation)
  const decoder = schema(D.decoder)
  const guard = schema(G.guard)
  const jsonSchema = ajv.compile(schema(J.jsonSchema)())
  fc.assert(fc.property(arb, a => guard.is(a) && isRight(decoder.decode(a)) && Boolean(jsonSchema(a))))
  fc.assert(fc.property(mutation, m => !guard.is(m) && isLeft(decoder.decode(m))))
}

interface SchemaWithParse<A> {
  <S extends URIS>(S: S.Schemable<S> & S.WithParse<S>): Kind<S, A>
}

function makeWithParse<A>(f: SchemaWithParse<A>): SchemaWithParse<A> {
  return f
}

function assertWithParse<A>(schema: SchemaWithParse<A>): void {
  const arb = schema(Arb.arbitrary)
  const mutation = schema(ArbMut.arbitraryMutation)
  const decoder = schema(D.decoder)
  const guard = schema(G.guard)
  fc.assert(fc.property(arb, a => guard.is(a) && isRight(decoder.decode(a))))
  fc.assert(fc.property(mutation, m => !guard.is(m) && isLeft(decoder.decode(m))))
}

interface SchemaWithLazy<A> {
  <S extends URIS>(S: S.Schemable<S> & S.WithLazy<S> & S.WithParse<S>): Kind<S, A>
}

function makeWithLazy<A>(f: SchemaWithLazy<A>): SchemaWithLazy<A> {
  return f
}

function assertWithLazy<A>(schema: SchemaWithLazy<A>): void {
  const arb = schema(Arb.arbitrary)
  const mutation = schema(ArbMut.arbitraryMutation)
  const decoder = schema(D.decoder)
  const guard = schema(G.guard)
  fc.assert(fc.property(arb, a => guard.is(a) && isRight(decoder.decode(a))))
  fc.assert(fc.property(mutation, m => !guard.is(m) && isLeft(decoder.decode(m))))
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

  it('lazy', () => {
    interface A {
      a: string
      b: undefined | A
    }

    interface NonEmptyABrand {
      readonly NonEmptyA: unique symbol
    }

    type NonEmptyA = A & NonEmptyABrand

    function parser(a: A): Either<string, NonEmptyA> {
      return a.a.length > 0 ? right(a as any) : left('NonEmptyA')
    }

    const schema: SchemaWithLazy<NonEmptyA> = makeWithLazy(S =>
      S.lazy(() =>
        S.parse(
          S.type({
            a: S.string,
            b: S.literalsOr([undefined], schema(S))
          }),
          parser
        )
      )
    )
    assertWithLazy(schema)
  })
})
