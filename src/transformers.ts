/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as ts from 'typescript'
import * as DSL from './DSL'
import * as T from './TypeNode'
import * as E from './Expression'
import * as S from '../src/Schema'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export interface Model {
  readonly statement: ts.VariableStatement
  readonly typeNode: O.Option<ts.TypeAliasDeclaration>
}

/**
 * @since 3.0.0
 */
export type Declaration<A> = C.Const<Model, A>

/**
 * @since 3.0.0
 */
export interface Model {
  readonly statement: ts.VariableStatement
  readonly typeNode: O.Option<ts.TypeAliasDeclaration>
}

const schemable = ts.createIdentifier('S')

const make = ts.createIdentifier('make')

/**
 * @since 3.0.0
 */
export function toDeclaration<A>(declaration: DSL.Declaration<A>): Declaration<A> {
  const id = declaration.id
  const model = declaration.dsl.dsl(false)
  const deserializer = S.getDeserializer({})
  const schema = deserializer({
    dsl: () => model
  })
  const node = schema(T.typeNode)
  const expr = schema(E.expression)
  const typeAnnotation =
    model._tag === 'lazy'
      ? ts.createTypeReferenceNode('Schema', [ts.createTypeReferenceNode(id, undefined)])
      : undefined

  const typeNode =
    model._tag === 'lazy'
      ? O.some(ts.createTypeAliasDeclaration(undefined, undefined, id, undefined, node.typeNode()))
      : O.none

  const statement = ts.createVariableStatement(
    undefined,
    ts.createVariableDeclarationList(
      [
        ts.createVariableDeclaration(
          id,
          typeAnnotation,
          ts.createCall(make, undefined, [
            ts.createArrowFunction(
              undefined,
              undefined,
              [ts.createParameter(undefined, undefined, undefined, schemable)],
              undefined,
              undefined,
              expr.expression()
            )
          ])
        )
      ],
      ts.NodeFlags.Const
    )
  )
  return C.make({ statement, typeNode })
}

const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed
})

const source = ts.createSourceFile('', '', ts.ScriptTarget.Latest)

/**
 * @since 3.0.0
 */
export function printNode(node: ts.Node): string {
  return printer.printNode(ts.EmitHint.Unspecified, node, source)
}

/**
 * @since 3.0.0
 */
export function printDeclaration<A>(declaration: Declaration<A>): string {
  const { statement, typeNode } = declaration
  return (
    pipe(
      typeNode,
      O.map(tad => printNode(tad) + '\n'),
      O.getOrElse(() => '')
    ) + printNode(statement)
  )
}
