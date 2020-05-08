import * as fc from 'fast-check'
import * as T from '../src/Type'
import * as A from './Arbitrary'
import * as D from '../src/Decoder'
import * as G from '../src/Guard'
import { isRight } from 'fp-ts/lib/Either'
import * as t from '../src'
import { Kind, URIS } from 'fp-ts/lib/HKT'
import { memoize, Schemable, WithUnion } from '../src/Schemable'

interface Schema<A> {
  <S extends URIS>(S: Schemable<S> & WithUnion<S>): Kind<S, A>
}

function make<A>(f: Schema<A>): Schema<A> {
  return memoize(f)
}

function check<A>(schema: Schema<A>, type: t.Type<A>): void {
  const arb = schema(A.arbitrary)
  const decoder = schema(D.decoder)
  const guard = schema(G.guard)
  const itype = schema(T.instance)
  // decoder and type should be aligned
  fc.assert(fc.property(arb, (a) => isRight(decoder.decode(a)) === isRight(type.decode(a))))
  // interpreted type and type should be aligned
  fc.assert(fc.property(arb, (a) => isRight(itype.decode(a)) === isRight(type.decode(a))))
  // guard and `Type`'s `is` should be aligned
  fc.assert(fc.property(arb, (a) => guard.is(a) === type.is(a)))
}

describe('Type', () => {
  it('string', () => {
    check(
      make((S) => S.string),
      t.string
    )
  })

  it('number', () => {
    check(
      make((S) => S.number),
      t.number
    )
  })

  it('boolean', () => {
    check(
      make((S) => S.boolean),
      t.boolean
    )
  })

  it('UnknownArray', () => {
    check(
      make((S) => S.UnknownArray),
      t.UnknownArray
    )
  })

  it('UnknownRecord', () => {
    check(
      make((S) => S.UnknownRecord),
      t.UnknownRecord
    )
  })

  it('literal', () => {
    check(
      make((S) => S.literal('a', 'b')),
      t.keyof({ a: null, b: null })
    )
  })

  it('nullable', () => {
    check(
      make((S) => S.nullable(S.string)),
      t.union([t.null, t.string])
    )
  })

  it('type', () => {
    check(
      make((S) =>
        S.type({
          name: S.string,
          age: S.number
        })
      ),
      t.type({
        name: t.string,
        age: t.number
      })
    )
  })

  it('partial', () => {
    check(
      make((S) =>
        S.partial({
          name: S.string,
          age: S.number
        })
      ),
      t.partial({
        name: t.string,
        age: t.number
      })
    )
  })

  it('record', () => {
    check(
      make((S) => S.record(S.string)),
      t.record(t.string, t.string)
    )
  })

  it('array', () => {
    check(
      make((S) => S.array(S.string)),
      t.array(t.string)
    )
  })

  it('tuple', () => {
    check(
      make((S) => S.tuple(S.string)),
      t.tuple([t.string])
    )
    check(
      make((S) => S.tuple(S.string, S.number)),
      t.tuple([t.string, t.number])
    )
  })

  it('intersection', () => {
    check(
      make((S) => S.intersection(S.type({ a: S.string }), S.type({ b: S.number }))),
      t.intersection([t.type({ a: t.string }), t.type({ b: t.number })])
    )
  })

  it('sum', () => {
    check(
      make((S) =>
        S.sum('_tag')({
          A: S.type({ _tag: S.literal('A'), a: S.string }),
          B: S.type({ _tag: S.literal('B'), b: S.number })
        })
      ),
      t.union([t.type({ _tag: t.literal('A'), a: t.string }), t.type({ _tag: t.literal('B'), b: t.number })])
    )
  })

  it('lazy', () => {
    interface A {
      a: string
      b?: A
      c?: number
    }

    const schema: Schema<A> = make((S) =>
      S.lazy('A', () => S.intersection(S.type({ a: S.string }), S.partial({ b: schema(S), c: S.number })))
    )
    const type: t.Type<A> = t.recursion('A', () =>
      t.intersection([t.type({ a: t.string }), t.partial({ b: type, c: t.number })])
    )
    check(schema, type)
  })

  it('union', () => {
    check(
      make((S) => S.union(S.string, S.number)),
      t.union([t.string, t.number])
    )
  })
})
