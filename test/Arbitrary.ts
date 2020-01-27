import * as fc from 'fast-check'
import * as A from '../src/Arbitrary'
import * as D from '../src/Decoder'
import * as E from '../src/Eq'
import * as G from '../src/Guard'
import { URIS, Kind } from 'fp-ts/lib/HKT'
import * as S from '../src/Schemable'
import { isRight, right, left } from 'fp-ts/lib/Either'

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
  // TODO JsonSchema
  fc.assert(fc.property(arb, a => guard.is(a) && eq.equals(a, a) && isRight(decoder.decode(a))))
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
  // TODO JsonSchema
  fc.assert(fc.property(arb, a => guard.is(a) && isRight(decoder.decode(a))))
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
  it('constants', () => {
    assert(make(S => S.constants(['a', null])))
  })

  it('constantsOr', () => {
    assert(make(S => S.constantsOr(['a', null], S.type({ a: S.string }))))
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

  it('lazy', () => {
    interface Rec {
      a: number
      b: Array<Rec>
    }
    const end: Rec = { a: 0, b: [] }
    const schema: Schema<Rec> = make(S =>
      S.lazy((...args: Array<any>) => {
        const iterations: number = args[0]
        if (iterations && iterations < 10) {
          return S.type({
            a: S.number,
            b: S.array(schema(S))
          })
        }
        return S.constants([end])
      })
    )
    assert(schema)
  })

  it('sum', () => {
    assert(
      make(S =>
        S.sum('_tag')({
          A: S.type({ _tag: S.constants(['A']), a: S.string }),
          B: S.type({ _tag: S.constants(['B']), b: S.number })
        })
      )
    )
  })

  it('parse', () => {
    assertWithParse(makeWithParse(S => S.parse(S.number, n => (n > 0 ? right(n) : left('Positive')))))
  })

  it('union', () => {
    assertWithUnion(makeWithUnion(S => S.union([S.type({ a: S.string }), S.type({ b: S.number })])))
  })
})
