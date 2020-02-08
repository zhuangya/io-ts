import * as assert from 'assert'
import * as T from '../src/TypeNode'
import { printNode } from '../src/transformers'

describe('TypeNode', () => {
  it('lazy', () => {
    interface A {
      a: number
      b: null | A
    }

    const typeNode: T.TypeNode<A> = T.lazy('A', () =>
      T.type({
        a: T.number,
        b: T.literalsOr([null], typeNode)
      })
    )

    assert.deepStrictEqual(printNode(typeNode.typeNode()), '{\n    a: number;\n    b: null | A;\n}')
  })
})
