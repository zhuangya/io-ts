/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'
import * as ts from 'typescript'
import * as DSL from './DSL'
import * as T from './TypeNode'
import * as E from './Expression'

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
export function toTypeNode(model: DSL.Model): T.TypeNode<unknown> {
  switch (model._tag) {
    case 'string':
      return T.string
    case 'number':
      return T.number
    case 'boolean':
      return T.boolean
    case 'UnknownArray':
      return T.UnknownArray
    case 'UnknownRecord':
      return T.UnknownRecord
    case 'array':
      return T.array(toTypeNode(model.items))
    case 'record':
      return T.record(toTypeNode(model.codomain))
    case 'union':
      return T.union(model.models.map(model => toTypeNode(model)) as any)
    case 'intersection':
      return T.intersection(model.models.map(model => toTypeNode(model)) as any)
    case 'tuple':
      return T.tuple(model.items.map(item => toTypeNode(item)) as any)
    case 'type':
      return T.type(
        R.record.map<DSL.Model, T.TypeNode<unknown>>(model.properties, model => toTypeNode(model))
      )
    case 'partial':
      return T.partial(
        R.record.map<DSL.Model, T.TypeNode<unknown>>(model.properties, model => toTypeNode(model))
      )
    case '$ref':
      return T.$ref(model.id)
    case 'literal':
      return T.literal(model.value)
    case 'literals':
      return T.literals(model.values)
    case 'literalsOr':
      return T.literalsOr(model.values, toTypeNode(model.model))
    case 'lazy':
      return T.lazy(model.id, () => toTypeNode(model.model))
    case 'sum':
      return T.sum(model.tag)(
        R.record.map<DSL.Model, T.TypeNode<unknown>>(model.models, model => toTypeNode(model)) as any
      )
  }
}

/**
 * @since 3.0.0
 */
export function toExpression(model: DSL.Model): E.Expression<unknown> {
  switch (model._tag) {
    case 'string':
      return E.string
    case 'number':
      return E.number
    case 'boolean':
      return E.boolean
    case 'UnknownArray':
      return E.UnknownArray
    case 'UnknownRecord':
      return E.UnknownRecord
    case 'array':
      return E.array(toExpression(model.items))
    case 'record':
      return E.record(toExpression(model.codomain))
    case 'union':
      return E.union(model.models.map(model => toExpression(model)) as any)
    case 'intersection':
      return E.intersection(model.models.map(model => toExpression(model)) as any)
    case 'tuple':
      return E.tuple(model.items.map(item => toExpression(item)) as any)
    case 'type':
      return E.type(
        R.record.map<DSL.Model, E.Expression<unknown>>(model.properties, model => toExpression(model))
      )
    case 'partial':
      return E.partial(
        R.record.map<DSL.Model, E.Expression<unknown>>(model.properties, model => toExpression(model))
      )
    case '$ref':
      return E.$ref(model.id)
    case 'literal':
      return E.literal(model.value)
    case 'literals':
      return E.literals(model.values)
    case 'literalsOr':
      return E.literalsOr(model.values, toExpression(model.model))
    case 'lazy':
      return E.lazy(model.id, () => toExpression(model.model))
    case 'sum':
      return E.sum(model.tag)(
        R.record.map<DSL.Model, E.Expression<unknown>>(model.models, model => toExpression(model)) as any
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
      ? O.some(ts.createTypeAliasDeclaration(undefined, undefined, id, undefined, toTypeNode(model.model).typeNode()))
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
              toExpression(model).expression()
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
