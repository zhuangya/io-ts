import * as assert from 'assert'
import * as DSL from '../src/DSL'
import * as T from '../src/transformers'

function assertTypeNode<A>(dsl: DSL.DSL<A>, expected: string): void {
  assert.strictEqual(T.printNode(T.toTypeNode(dsl.dsl(false)).typeNode()), expected)
}

function assertExpression<A>(dsl: DSL.DSL<A>, expected: string): void {
  assert.strictEqual(T.printNode(T.toExpression(dsl.dsl(false)).expression()), expected)
}
function assertDeclaration<A>(declaration: DSL.Declaration<A>, expected: string): void {
  assert.strictEqual(T.printDeclaration(T.toDeclaration(declaration)), expected)
}

describe('transformers', () => {
  describe('toTypeNode', () => {
    it('string', () => {
      assertTypeNode(DSL.string, 'string')
    })

    it('number', () => {
      assertTypeNode(DSL.number, 'number')
    })

    it('boolean', () => {
      assertTypeNode(DSL.boolean, 'boolean')
    })

    it('UnknownArray', () => {
      assertTypeNode(DSL.UnknownArray, 'Array<unknown>')
    })

    it('UnknownRecord', () => {
      assertTypeNode(DSL.UnknownRecord, 'Record<string, unknown>')
    })

    it('array', () => {
      assertTypeNode(DSL.array(DSL.string), 'Array<string>')
    })

    it('record', () => {
      assertTypeNode(DSL.record(DSL.number), 'Record<string, number>')
    })

    it('union', () => {
      assertTypeNode(DSL.union([DSL.string, DSL.number]), 'string | number')
    })

    it('intersection', () => {
      assertTypeNode(DSL.intersection(DSL.string, DSL.number), 'string & number')
    })

    it('tuple2', () => {
      assertTypeNode(DSL.tuple2(DSL.string, DSL.number), '[string, number]')
    })

    it('tuple3', () => {
      assertTypeNode(DSL.tuple3(DSL.string, DSL.number, DSL.boolean), '[string, number, boolean]')
    })

    it('type', () => {
      assertTypeNode(DSL.type({ a: DSL.string }), '{\n    a: string;\n}')
    })

    it('partial', () => {
      assertTypeNode(DSL.partial({ a: DSL.string }), 'Partial<{\n    a: string;\n}>')
    })

    it('$ref', () => {
      assertTypeNode(DSL.$ref('Person'), 'Person')
    })

    it('literals', () => {
      assertTypeNode(DSL.literals([1, 'a', null, true]), '1 | "a" | null | true')
    })

    it('literalsOr', () => {
      assertTypeNode(DSL.literalsOr([1, 'a', null], DSL.boolean), '1 | "a" | null | boolean')
    })

    it('sum', () => {
      assertTypeNode(
        DSL.sum('_tag')({
          A: DSL.type({ _tag: DSL.literal('A'), a: DSL.string }),
          B: DSL.type({ _tag: DSL.literal('B'), b: DSL.number })
        }),
        '{\n    _tag: "A";\n    a: string;\n} | {\n    _tag: "B";\n    b: number;\n}'
      )
    })

    describe('lazy', () => {
      it('using the $ref constructor', () => {
        assertTypeNode(
          DSL.lazy('A', () =>
            DSL.type({
              a: DSL.number,
              b: DSL.literalsOr([null], DSL.$ref('A'))
            })
          ),
          '{\n    a: number;\n    b: null | A;\n}'
        )
      })

      it('using a recursive definition', () => {
        interface A {
          a: number
          b: null | A
        }

        const dsl: DSL.DSL<A> = DSL.lazy('A', () =>
          DSL.type({
            a: DSL.number,
            b: DSL.literalsOr([null], dsl)
          })
        )

        assertTypeNode(dsl, '{\n    a: number;\n    b: null | A;\n}')
      })
    })
  })

  describe('toExpression', () => {
    it('string', () => {
      assertExpression(DSL.string, 'S.string')
    })

    it('number', () => {
      assertExpression(DSL.number, 'S.number')
    })

    it('boolean', () => {
      assertExpression(DSL.boolean, 'S.boolean')
    })

    it('UnknownArray', () => {
      assertExpression(DSL.UnknownArray, 'S.UnknownArray')
    })

    it('UnknownRecord', () => {
      assertExpression(DSL.UnknownRecord, 'S.UnknownRecord')
    })

    it('array', () => {
      assertExpression(DSL.array(DSL.string), 'S.array(S.string)')
    })

    it('record', () => {
      assertExpression(DSL.record(DSL.number), 'S.record(S.number)')
    })

    it('union', () => {
      assertExpression(DSL.union([DSL.string, DSL.number]), 'S.union([S.string, S.number])')
    })

    it('intersection', () => {
      assertExpression(DSL.intersection(DSL.string, DSL.number), 'S.intersection(S.string, S.number)')
    })

    it('tuple2', () => {
      assertExpression(DSL.tuple2(DSL.string, DSL.number), 'S.tuple2(S.string, S.number)')
    })

    it('tuple3', () => {
      assertExpression(DSL.tuple3(DSL.string, DSL.number, DSL.boolean), 'S.tuple3(S.string, S.number, S.boolean)')
    })

    it('type', () => {
      assertExpression(DSL.type({ a: DSL.string }), 'S.type({ a: S.string })')
    })

    it('partial', () => {
      assertExpression(DSL.partial({ a: DSL.string }), 'S.partial({ a: S.string })')
    })

    it('$ref', () => {
      assertExpression(DSL.$ref('Person'), 'Person(S)')
    })

    it('literals', () => {
      assertExpression(DSL.literals([1, 'a', null, true]), 'S.literals([1, "a", null, true])')
    })

    it('literalsOr', () => {
      assertExpression(DSL.literalsOr([1, 'a', null], DSL.boolean), 'S.literalsOr([1, "a", null], S.boolean)')
    })

    it('sum', () => {
      assertExpression(
        DSL.sum('_tag')({
          A: DSL.type({ _tag: DSL.literal('A'), a: DSL.string }),
          B: DSL.type({ _tag: DSL.literal('B'), b: DSL.number })
        }),
        'S.sum("_tag")({ A: S.type({ _tag: S.literal("A"), a: S.string }), B: S.type({ _tag: S.literal("B"), b: S.number }) })'
      )
    })

    describe('lazy', () => {
      it('using the $ref constructor', () => {
        assertExpression(
          DSL.lazy('A', () =>
            DSL.type({
              a: DSL.number,
              b: DSL.literalsOr([null], DSL.$ref('A'))
            })
          ),
          'S.lazy(() => S.type({ a: S.number, b: S.literalsOr([null], A(S)) }))'
        )
      })

      it('using a recursive definition', () => {
        interface A {
          a: number
          b: null | A
        }

        const dsl: DSL.DSL<A> = DSL.lazy('A', () =>
          DSL.type({
            a: DSL.number,
            b: DSL.literalsOr([null], dsl)
          })
        )

        assertExpression(dsl, 'S.lazy(() => S.type({ a: S.number, b: S.literalsOr([null], A(S)) }))')
      })
    })
  })

  describe('toDeclaration', () => {
    it('type', () => {
      const declaration = DSL.declaration('Person', DSL.type({ name: DSL.string, age: DSL.number }))
      assertDeclaration(declaration, 'const Person = make(S => S.type({ name: S.string, age: S.number }));')
    })

    describe('lazy', () => {
      it('using the $ref constructor', () => {
        const declaration = DSL.declaration(
          'A',
          DSL.lazy('A', () =>
            DSL.type({
              a: DSL.number,
              b: DSL.literalsOr([null], DSL.$ref('A'))
            })
          )
        )
        assertDeclaration(
          declaration,
          'type A = {\n    a: number;\n    b: null | A;\n};\nconst A: Schema<A> = make(S => S.lazy(() => S.type({ a: S.number, b: S.literalsOr([null], A(S)) })));'
        )
      })

      it('using a recursive definition', () => {
        interface A {
          a: number
          b: null | A
        }

        const dsl: DSL.DSL<A> = DSL.lazy('A', () =>
          DSL.type({
            a: DSL.number,
            b: DSL.literalsOr([null], dsl)
          })
        )

        const declaration = DSL.declaration('A', dsl)

        assertDeclaration(
          declaration,
          'type A = {\n    a: number;\n    b: null | A;\n};\nconst A: Schema<A> = make(S => S.lazy(() => S.type({ a: S.number, b: S.literalsOr([null], A(S)) })));'
        )
      })
    })
  })
})
