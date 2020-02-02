import * as fc from 'fast-check'
import { isLeft, isRight, right, left } from 'fp-ts/lib/Either'
import { Kind, URIS } from 'fp-ts/lib/HKT'
import * as Arb from '../src/Arbitrary'
import * as ArbMut from '../src/ArbitraryMutation'
import * as D from '../src/Decoder'
import * as G from '../src/Guard'
import * as S from '../src/Schemable'

interface Schema<A> {
  <S extends URIS>(S: S.Schemable<S> & S.WithRefinement<S>): Kind<S, A>
}

function make<A>(f: Schema<A>): Schema<A> {
  return f
}

function assertWithLazy<A>(schema: Schema<A>): void {
  const arb = schema(Arb.arbitrary)
  const mutation = schema(ArbMut.arbitraryMutation)
  const decoder = schema(D.decoder)
  const guard = schema(G.guard)
  fc.assert(fc.property(arb, a => guard.is(a) && isRight(decoder.decode(a))))
  fc.assert(fc.property(mutation, m => !guard.is(m) && isLeft(decoder.decode(m))))
}

describe('ArbitraryMutation', () => {
  it('lazy', () => {
    interface A {
      a: string
      b: undefined | A
    }

    const schema: Schema<A> = make(S =>
      S.lazy(() =>
        S.refinement(
          S.type({
            a: S.string,
            b: S.literalsOr([undefined], schema(S))
          }),
          a => (a.a.length > 0 ? right(a) : left('empty string'))
        )
      )
    )
    assertWithLazy(schema)
  })
})
