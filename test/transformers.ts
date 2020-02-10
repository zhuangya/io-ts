import * as assert from 'assert'
import * as DSL from '../src/DSL'
import * as T from '../src/transformers'

function assertDeclaration<A>(declaration: DSL.Declaration<A>, expected: string): void {
  assert.strictEqual(T.printDeclaration(T.toDeclaration(declaration)), expected)
}

describe('transformers', () => {
  describe('toDeclaration', () => {
    it('type', () => {
      const declaration = DSL.declaration('Person', DSL.type({ name: DSL.string, age: DSL.number }))
      assertDeclaration(declaration, 'const Person = make(S => S.type({ name: S.string, age: S.number }));')
    })

    it('lazy', () => {
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
  })
})
