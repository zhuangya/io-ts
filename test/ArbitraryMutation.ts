import * as fc from 'fast-check'
import { isLeft, isRight } from 'fp-ts/lib/Either'
import { Kind, URIS } from 'fp-ts/lib/HKT'
import * as Arb from '../src/Arbitrary'
import * as ArbMut from '../src/ArbitraryMutation'
import * as D from '../src/Decoder'
import * as G from '../src/Guard'
import * as S from '../src/Schemable'

interface Schema<A> {
  <S extends URIS>(S: S.Schemable<S>): Kind<S, A>
}

function make<A>(f: Schema<A>): Schema<A> {
  return S.memoize(f)
}

function assert<A>(schema: Schema<A>): void {
  const arb = schema(Arb.arbitrary)
  const am = schema(ArbMut.arbitraryMutation)
  const decoder = schema(D.decoder)
  const guard = schema(G.guard)
  fc.assert(fc.property(arb, a => guard.is(a) && isRight(decoder.decode(a))))
  fc.assert(fc.property(am.mutation, m => !guard.is(m) && isLeft(decoder.decode(m))))
}

describe('ArbitraryMutation', () => {
  describe('type', () => {
    it('should support empty types', () => {
      const schema = make(S => S.type({}))
      const am = schema(ArbMut.arbitraryMutation)
      fc.assert(fc.property(am.mutation, a => Array.isArray(a) && a.length === 0))
    })
  })

  describe('partial', () => {
    it('should support empty types', () => {
      const schema = make(S => S.partial({}))
      const am = schema(ArbMut.arbitraryMutation)
      fc.assert(fc.property(am.mutation, a => Array.isArray(a) && a.length === 0))
    })
  })

  it('lazy', () => {
    interface A {
      a: string
      b?: A
      c?: number
    }

    const schema: Schema<A> = make(S =>
      S.lazy('A', () => S.intersection(S.type({ a: S.string }), S.partial({ b: schema(S), c: S.number })))
    )
    assert(schema)
  })
})
