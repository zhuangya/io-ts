import * as fc from 'fast-check'
import * as Arb from '../src/Arbitrary'
import * as ArbMut from '../src/ArbitraryMutation'
import * as C from '../src/Compat'
import * as E from '../src/Eq'
import * as G from '../src/Guard'
import * as J from '../src/JsonSchema'
import { URIS, Kind } from 'fp-ts/lib/HKT'
import * as S from '../src/Schemable'
import { isRight, right, left, isLeft } from 'fp-ts/lib/Either'
import * as Ajv from 'ajv'

const ajv = new Ajv()

interface Schema<A> {
  <S extends URIS>(S: S.Schemable<S>): Kind<S, A>
}

function make<A>(f: Schema<A>): Schema<A> {
  return S.memoize(f)
}

function assert<A>(schema: Schema<A>): void {
  const arb = schema(Arb.arbitrary)
  const am = schema(ArbMut.arbitraryMutation)
  const compat = schema(C.compat)
  const eq = schema(E.eq)
  const guard = schema(G.guard)
  const validate = ajv.compile(schema(J.jsonSchema).compile(false))
  fc.assert(
    fc.property(
      arb,
      a =>
        guard.is(a) &&
        eq.equals(a, a) &&
        isRight(compat.decode(a)) &&
        Boolean(validate(a)) &&
        isRight(compat.decode(compat.encode(a)))
    )
  )
  fc.assert(fc.property(am.mutation, m => !guard.is(m) && isLeft(compat.decode(m))))
}

interface SchemaWithUnion<A> {
  <S extends URIS>(S: S.Schemable<S> & S.WithUnion<S>): Kind<S, A>
}

function makeWithUnion<A>(f: SchemaWithUnion<A>): SchemaWithUnion<A> {
  return S.memoize(f)
}

function assertWithUnion<A>(schema: SchemaWithUnion<A>): void {
  const arb = schema(Arb.arbitrary)
  const am = schema(ArbMut.arbitraryMutation)
  const compat = schema(C.compat)
  const validate = ajv.compile(schema(J.jsonSchema).compile(false))
  fc.assert(
    fc.property(
      arb,
      a => compat.is(a) && isRight(compat.decode(a)) && Boolean(validate(a)) && isRight(compat.decode(compat.encode(a)))
    )
  )
  fc.assert(fc.property(am.mutation, m => !compat.is(m) && isLeft(compat.decode(m))))
}

interface SchemaWithRefinement<A> {
  <S extends URIS>(S: S.Schemable<S> & S.WithRefinement<S>): Kind<S, A>
}

function makeWithRefinement<A>(f: SchemaWithRefinement<A>): SchemaWithRefinement<A> {
  return S.memoize(f)
}

function assertWithRefinement<A>(schema: SchemaWithRefinement<A>): void {
  const arb = schema(Arb.arbitrary)
  const am = schema(ArbMut.arbitraryMutation)
  const compat = schema(C.compat)
  fc.assert(fc.property(arb, a => compat.is(a) && isRight(compat.decode(a))))
  fc.assert(fc.property(am.mutation, m => !compat.is(m) && isLeft(compat.decode(m))))
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

  it('tuple2', () => {
    assert(make(S => S.tuple2(S.string, S.number)))
  })

  it('tuple3', () => {
    assert(make(S => S.tuple3(S.string, S.number, S.boolean)))
  })

  it('intersection', () => {
    assert(make(S => S.intersection(S.type({ a: S.string }), S.type({ b: S.number }))))
  })

  it('sum', () => {
    const A = make(S => S.type({ _tag: S.literal('A'), a: S.string }))
    const B = make(S => S.type({ _tag: S.literal('B'), b: S.number }))
    assert(make(S => S.sum('_tag')({ A: A(S), B: B(S) })))
  })

  it('refinement', () => {
    assertWithRefinement(makeWithRefinement(S => S.refinement(S.number, n => (n > 0 ? right(n) : left('Positive')))))
  })

  it('union', () => {
    assertWithUnion(makeWithUnion(S => S.union([S.type({ a: S.string }), S.type({ b: S.number })])))
  })

  it('lazy', () => {
    interface A {
      a: number
      b: null | A
    }

    const schema: Schema<A> = make(S =>
      S.lazy('A', () =>
        S.type({
          a: S.number,
          b: S.literalsOr([null], schema(S))
        })
      )
    )
    assert(schema)
  })
})
