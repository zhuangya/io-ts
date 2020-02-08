/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const'
import * as O from 'fp-ts/lib/Option'
import * as ts from 'typescript'
import * as DSL from './DSL'
import * as S from './Schemable'
import { pipe } from 'fp-ts/lib/pipeable'

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

function fold<R>(
  onString: (s: string) => R,
  onNumber: (n: number) => R,
  onBoolean: (b: boolean) => R,
  onNull: () => R
): (literal: S.Literal) => R {
  return literal => {
    if (typeof literal === 'string') {
      return onString(literal)
    } else if (typeof literal === 'number') {
      return onNumber(literal)
    } else if (typeof literal === 'boolean') {
      return onBoolean(literal)
    } else {
      return onNull()
    }
  }
}

function toLiteralTypeNode(values: Array<S.Literal>): Array<ts.TypeNode> {
  return values.map(
    fold<ts.TypeNode>(
      s => ts.createLiteralTypeNode(ts.createStringLiteral(s)),
      n => ts.createLiteralTypeNode(ts.createNumericLiteral(String(n))),
      b => ts.createLiteralTypeNode(ts.createLiteral(b)),
      () => ts.createKeywordTypeNode(ts.SyntaxKind.NullKeyword)
    )
  )
}

/**
 * @since 3.0.0
 */
export function toTypeNode(model: DSL.Model): ts.TypeNode {
  switch (model._tag) {
    case 'string':
      return ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
    case 'number':
      return ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
    case 'boolean':
      return ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)
    case 'UnknownArray':
      return ts.createTypeReferenceNode('Array', [ts.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)])
    case 'UnknownRecord':
      return ts.createTypeReferenceNode('Record', [
        ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ts.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
      ])
    case 'array':
      return ts.createTypeReferenceNode('Array', [toTypeNode(model.items)])
    case 'record':
      return ts.createTypeReferenceNode('Record', [
        ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        toTypeNode(model.codomain)
      ])
    case 'union':
      return ts.createUnionTypeNode(model.models.map(model => toTypeNode(model)))
    case 'intersection':
      return ts.createIntersectionTypeNode(model.models.map(model => toTypeNode(model)))
    case 'tuple':
      return ts.createTupleTypeNode(model.items.map(item => toTypeNode(item)))
    case 'type':
    case 'partial':
      const typeLiteralNode = ts.createTypeLiteralNode(
        Object.keys(model.properties).map(k =>
          ts.createPropertySignature(undefined, k, undefined, toTypeNode(model.properties[k]), undefined)
        )
      )
      if (model._tag === 'partial') {
        return ts.createTypeReferenceNode('Partial', [typeLiteralNode])
      }
      return typeLiteralNode
    case '$ref':
      return ts.createTypeReferenceNode(model.id, undefined)
    case 'literal':
      return ts.createUnionTypeNode(toLiteralTypeNode([model.value]))
    case 'literals':
      return ts.createUnionTypeNode(toLiteralTypeNode(model.values))
    case 'literalsOr':
      return ts.createUnionTypeNode([...toLiteralTypeNode(model.values), toTypeNode(model.model)])
    case 'lazy':
      return toTypeNode(model.model)
    case 'sum':
      return ts.createUnionTypeNode(Object.keys(model.models).map(k => toTypeNode(model.models[k])))
  }
}

const toLiteralExpression = fold<ts.Expression>(
  s => ts.createStringLiteral(s),
  n => ts.createNumericLiteral(String(n)),
  b => ts.createLiteral(b),
  () => ts.createNull()
)

function toLiteralExpressions(values: Array<S.Literal>): ts.Expression {
  return ts.createArrayLiteral(values.map(toLiteralExpression))
}

/**
 * @since 3.0.0
 */
export function toExpression(model: DSL.Model): ts.Expression {
  switch (model._tag) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'UnknownArray':
    case 'UnknownRecord':
      return ts.createPropertyAccess(schemable, model._tag)
    case '$ref':
      return ts.createCall(ts.createIdentifier(model.id), undefined, [schemable])
    case 'record':
      return ts.createCall(ts.createPropertyAccess(schemable, model._tag), undefined, [toExpression(model.codomain)])
    case 'array':
      return ts.createCall(ts.createPropertyAccess(schemable, model._tag), undefined, [toExpression(model.items)])
    case 'union':
    case 'intersection':
      return ts.createCall(ts.createPropertyAccess(schemable, model._tag), undefined, [
        ts.createArrayLiteral(model.models.map(dsl => toExpression(dsl)))
      ])
    case 'tuple':
      return ts.createCall(ts.createPropertyAccess(schemable, model._tag), undefined, [
        ts.createArrayLiteral(model.items.map(item => toExpression(item)))
      ])
    case 'type':
    case 'partial':
      return ts.createCall(ts.createPropertyAccess(schemable, model._tag), undefined, [
        ts.createObjectLiteral(
          Object.keys(model.properties).map(k => ts.createPropertyAssignment(k, toExpression(model.properties[k])))
        )
      ])
    case 'literal':
      return ts.createCall(ts.createPropertyAccess(schemable, model._tag), undefined, [
        toLiteralExpression(model.value)
      ])
    case 'literals':
      return ts.createCall(ts.createPropertyAccess(schemable, model._tag), undefined, [
        toLiteralExpressions(model.values)
      ])
    case 'literalsOr':
      return ts.createCall(ts.createPropertyAccess(schemable, model._tag), undefined, [
        toLiteralExpressions(model.values),
        toExpression(model.model)
      ])
    case 'lazy':
      return ts.createCall(ts.createPropertyAccess(schemable, model._tag), undefined, [
        ts.createArrowFunction(undefined, undefined, [], undefined, undefined, toExpression(model.model))
      ])
    case 'sum':
      return ts.createCall(
        ts.createCall(ts.createPropertyAccess(schemable, model._tag), undefined, [ts.createStringLiteral(model.tag)]),
        undefined,
        [
          ts.createObjectLiteral(
            Object.keys(model.models).map(k => ts.createPropertyAssignment(k, toExpression(model.models[k])))
          )
        ]
      )
  }
}

/**
 * @since 3.0.0
 */
export function toDeclaration<A>(declaration: DSL.Declaration<A>): Declaration<A> {
  const id = declaration.id
  const model = declaration.dsl.dsl()
  const typeAnnotation =
    model._tag === 'lazy'
      ? ts.createTypeReferenceNode('Schema', [ts.createTypeReferenceNode(id, undefined)])
      : undefined

  const typeNode =
    model._tag === 'lazy'
      ? O.some(ts.createTypeAliasDeclaration(undefined, undefined, id, undefined, toTypeNode(model.model)))
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
              toExpression(model)
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
