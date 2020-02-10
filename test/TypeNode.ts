import * as assert from 'assert'
import * as T from '../src/TypeNode'
import { printNode } from '../src/transformers'

function assertTypeNode<A>(typeNode: T.TypeNode<A>, expected: string): void {
  assert.strictEqual(printNode(typeNode.typeNode()), expected)
}

describe('TypeNode', () => {
  it('string', () => {
    assertTypeNode(T.string, 'string')
  })

  it('number', () => {
    assertTypeNode(T.number, 'number')
  })

  it('boolean', () => {
    assertTypeNode(T.boolean, 'boolean')
  })

  it('UnknownArray', () => {
    assertTypeNode(T.UnknownArray, 'Array<unknown>')
  })

  it('UnknownRecord', () => {
    assertTypeNode(T.UnknownRecord, 'Record<string, unknown>')
  })

  it('array', () => {
    assertTypeNode(T.array(T.string), 'Array<string>')
  })

  it('record', () => {
    assertTypeNode(T.record(T.number), 'Record<string, number>')
  })

  it('union', () => {
    assertTypeNode(T.union([T.string, T.number]), 'string | number')
  })

  it('intersection', () => {
    assertTypeNode(T.intersection(T.string, T.number), 'string & number')
  })

  it('tuple2', () => {
    assertTypeNode(T.tuple2(T.string, T.number), '[string, number]')
  })

  it('tuple3', () => {
    assertTypeNode(T.tuple3(T.string, T.number, T.boolean), '[string, number, boolean]')
  })

  it('type', () => {
    assertTypeNode(T.type({ a: T.string }), '{\n    a: string;\n}')
  })

  it('partial', () => {
    assertTypeNode(T.partial({ a: T.string }), 'Partial<{\n    a: string;\n}>')
  })

  it('literals', () => {
    assertTypeNode(T.literals([1, 'a', null, true]), '1 | "a" | null | true')
  })

  it('literalsOr', () => {
    assertTypeNode(T.literalsOr([1, 'a', null], T.boolean), '1 | "a" | null | boolean')
  })

  it('sum', () => {
    assertTypeNode(
      T.sum('_tag')({
        A: T.type({ _tag: T.literal('A'), a: T.string }),
        B: T.type({ _tag: T.literal('B'), b: T.number })
      }),
      '{\n    _tag: "A";\n    a: string;\n} | {\n    _tag: "B";\n    b: number;\n}'
    )
  })

  describe('lazy', () => {
    it('lazy', () => {
      assertTypeNode(
        T.lazy('A', () =>
          T.type({
            a: T.number,
            b: T.literalsOr([null], T.$ref('A'))
          })
        ),
        '{\n    a: number;\n    b: null | A;\n}'
      )
    })

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

      assertTypeNode(typeNode, '{\n    a: number;\n    b: null | A;\n}')
    })
  })
})
