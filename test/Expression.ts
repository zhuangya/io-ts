import * as assert from 'assert'
import * as E from '../src/Expression'
import { printNode } from '../src/transformers'

function assertExpression<A>(expression: E.Expression<A>, expected: string): void {
  assert.deepStrictEqual(printNode(expression.expression()), expected)
}

describe('Expression', () => {
  it('string', () => {
    assertExpression(E.string, 'S.string')
  })

  it('string', () => {
    assertExpression(E.string, 'S.string')
  })

  it('number', () => {
    assertExpression(E.number, 'S.number')
  })

  it('boolean', () => {
    assertExpression(E.boolean, 'S.boolean')
  })

  it('UnknownArray', () => {
    assertExpression(E.UnknownArray, 'S.UnknownArray')
  })

  it('UnknownRecord', () => {
    assertExpression(E.UnknownRecord, 'S.UnknownRecord')
  })

  it('array', () => {
    assertExpression(E.array(E.string), 'S.array(S.string)')
  })

  it('record', () => {
    assertExpression(E.record(E.number), 'S.record(S.number)')
  })

  it('union', () => {
    assertExpression(E.union([E.string, E.number]), 'S.union([S.string, S.number])')
  })

  it('intersection', () => {
    assertExpression(E.intersection(E.string, E.number), 'S.intersection(S.string, S.number)')
  })

  it('tuple2', () => {
    assertExpression(E.tuple2(E.string, E.number), 'S.tuple2(S.string, S.number)')
  })

  it('tuple3', () => {
    assertExpression(E.tuple3(E.string, E.number, E.boolean), 'S.tuple3(S.string, S.number, S.boolean)')
  })

  it('type', () => {
    assertExpression(E.type({ a: E.string }), 'S.type({ a: S.string })')
  })

  it('partial', () => {
    assertExpression(E.partial({ a: E.string }), 'S.partial({ a: S.string })')
  })

  it('literals', () => {
    assertExpression(E.literals([1, 'a', null, true]), 'S.literals([1, "a", null, true])')
  })

  it('literalsOr', () => {
    assertExpression(E.literalsOr([1, 'a', null], E.boolean), 'S.literalsOr([1, "a", null], S.boolean)')
  })

  it('sum', () => {
    assertExpression(
      E.sum('_tag')({
        A: E.type({ _tag: E.literal('A'), a: E.string }),
        B: E.type({ _tag: E.literal('B'), b: E.number })
      }),
      'S.sum("_tag")({ A: S.type({ _tag: S.literal("A"), a: S.string }), B: S.type({ _tag: S.literal("B"), b: S.number }) })'
    )
  })

  describe('lazy', () => {
    it('lazy', () => {
      assertExpression(
        E.lazy('A', () =>
          E.type({
            a: E.number,
            b: E.literalsOr([null], E.$ref('A'))
          })
        ),
        'S.lazy(() => S.type({ a: S.number, b: S.literalsOr([null], A(S)) }))'
      )
    })

    it('lazy', () => {
      interface A {
        a: number
        b: null | A
      }

      const expression: E.Expression<A> = E.lazy('A', () =>
        E.type({
          a: E.number,
          b: E.literalsOr([null], expression)
        })
      )

      assertExpression(expression, 'S.lazy(() => S.type({ a: S.number, b: S.literalsOr([null], A(S)) }))')
    })
  })
})
