import * as assert from 'assert'
import * as E from '../src/Expression'
import { printNode } from '../src/transformers'

describe('TypeNode', () => {
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

    assert.deepStrictEqual(
      printNode(expression.expression()),
      'S.lazy(() => S.type({ a: S.number, b: S.literalsOr([null], A(S)) }))'
    )
  })
})
