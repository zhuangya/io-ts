/**
 * @since 3.0.0
 */
import * as ts from 'typescript'
import * as DSL from './DSL'
import * as S from './Schemable'
import * as O from 'fp-ts/lib/Option'

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
export function toTypeNode(dsl: DSL.DSL): ts.TypeNode {
  switch (dsl._tag) {
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
      return ts.createTypeReferenceNode('Array', [toTypeNode(dsl.items)])
    case 'record':
      return ts.createTypeReferenceNode('Record', [
        ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        toTypeNode(dsl.codomain)
      ])
    case 'union':
      return ts.createUnionTypeNode(dsl.dsls.map(dsl => toTypeNode(dsl)))
    case 'intersection':
      return ts.createIntersectionTypeNode(dsl.dsls.map(dsl => toTypeNode(dsl)))
    case 'tuple':
      return ts.createTupleTypeNode(dsl.items.map(dsl => toTypeNode(dsl)))
    case 'type':
    case 'partial':
      const typeLiteralNode = ts.createTypeLiteralNode(
        Object.keys(dsl.fields).map(k =>
          ts.createPropertySignature(undefined, k, undefined, toTypeNode(dsl.fields[k]), undefined)
        )
      )
      if (dsl._tag === 'partial') {
        return ts.createTypeReferenceNode('Partial', [typeLiteralNode])
      }
      return typeLiteralNode
    case '$ref':
      return ts.createTypeReferenceNode(dsl.id, undefined)
    case 'literals':
      return ts.createUnionTypeNode(toLiteralTypeNode(dsl.values))
    case 'literalsOr':
      return ts.createUnionTypeNode([...toLiteralTypeNode(dsl.values), toTypeNode(dsl.dsl)])
    case 'lazy':
      return toTypeNode(dsl.dsl)
    case 'sum':
      return ts.createUnionTypeNode(Object.keys(dsl.dsls).map(k => toTypeNode(dsl.dsls[k])))
  }
}

function toLiteralExpression(values: Array<S.Literal>): ts.Expression {
  return ts.createArrayLiteral(
    values.map(
      fold<ts.Expression>(
        s => ts.createStringLiteral(s),
        n => ts.createNumericLiteral(String(n)),
        b => ts.createLiteral(b),
        () => ts.createNull()
      )
    )
  )
}

/**
 * @since 3.0.0
 */
export function toExpression(dsl: DSL.DSL): ts.Expression {
  switch (dsl._tag) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'UnknownArray':
    case 'UnknownRecord':
      return ts.createPropertyAccess(schemable, dsl._tag)
    case '$ref':
      return ts.createCall(ts.createIdentifier(dsl.id), undefined, [schemable])
    case 'record':
      return ts.createCall(ts.createPropertyAccess(schemable, dsl._tag), undefined, [toExpression(dsl.codomain)])
    case 'array':
      return ts.createCall(ts.createPropertyAccess(schemable, dsl._tag), undefined, [toExpression(dsl.items)])
    case 'union':
    case 'intersection':
      return ts.createCall(ts.createPropertyAccess(schemable, dsl._tag), undefined, [
        ts.createArrayLiteral(dsl.dsls.map(dsl => toExpression(dsl)))
      ])
    case 'tuple':
      return ts.createCall(ts.createPropertyAccess(schemable, dsl._tag), undefined, [
        ts.createArrayLiteral(dsl.items.map(item => toExpression(item)))
      ])
    case 'type':
    case 'partial':
      return ts.createCall(ts.createPropertyAccess(schemable, dsl._tag), undefined, [
        ts.createObjectLiteral(
          Object.keys(dsl.fields).map(k => ts.createPropertyAssignment(k, toExpression(dsl.fields[k])))
        )
      ])
    case 'literals':
      return ts.createCall(ts.createPropertyAccess(schemable, dsl._tag), undefined, [toLiteralExpression(dsl.values)])
    case 'literalsOr':
      return ts.createCall(ts.createPropertyAccess(schemable, dsl._tag), undefined, [
        toLiteralExpression(dsl.values),
        toExpression(dsl.dsl)
      ])
    case 'lazy':
      return ts.createCall(ts.createPropertyAccess(schemable, dsl._tag), undefined, [
        ts.createArrowFunction(undefined, undefined, [], undefined, undefined, toExpression(dsl.dsl))
      ])
    case 'sum':
      return ts.createCall(
        ts.createCall(ts.createPropertyAccess(schemable, dsl._tag), undefined, [ts.createStringLiteral(dsl.tag)]),
        undefined,
        [
          ts.createObjectLiteral(
            Object.keys(dsl.dsls).map(k => ts.createPropertyAssignment(k, toExpression(dsl.dsls[k])))
          )
        ]
      )
  }
}

/**
 * @since 3.0.0
 */
export function toVariableStatement(
  declaration: DSL.Declaration
): { statement: ts.VariableStatement; typeNode: O.Option<ts.TypeAliasDeclaration> } {
  const typeAnnotation =
    declaration.dsl._tag === 'lazy'
      ? ts.createTypeReferenceNode('Schema', [ts.createTypeReferenceNode(declaration.id, undefined)])
      : undefined

  const typeNode =
    declaration.dsl._tag === 'lazy'
      ? O.some(
          ts.createTypeAliasDeclaration(undefined, undefined, declaration.id, undefined, toTypeNode(declaration.dsl))
        )
      : O.none

  const statement = ts.createVariableStatement(
    undefined,
    ts.createVariableDeclarationList(
      [
        ts.createVariableDeclaration(
          declaration.id,
          typeAnnotation,
          ts.createCall(make, undefined, [
            ts.createArrowFunction(
              undefined,
              undefined,
              [ts.createParameter(undefined, undefined, undefined, schemable)],
              undefined,
              undefined,
              toExpression(declaration.dsl)
            )
          ])
        )
      ],
      ts.NodeFlags.Const
    )
  )
  return { statement, typeNode }
}

/**
 * @since 3.0.0
 */
export function print(node: ts.Node): string {
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed
  })
  const source = ts.createSourceFile('', '', ts.ScriptTarget.Latest)
  return printer.printNode(ts.EmitHint.Unspecified, node, source)
}
