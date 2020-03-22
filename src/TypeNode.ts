/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const'
import * as ts from 'typescript'
import { Literal, fold } from './Literal'
import * as S from './Schemable'
import { ReadonlyNonEmptyArray } from './util'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export interface TypeNode<A> {
  readonly typeNode: () => C.Const<ts.TypeNode, A>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function $ref(id: string): TypeNode<unknown> {
  return {
    typeNode: () => C.make(ts.createTypeReferenceNode(id, undefined))
  }
}

const toLiteralTypeNode = fold<ts.TypeNode>(
  s => ts.createLiteralTypeNode(ts.createStringLiteral(s)),
  n => ts.createLiteralTypeNode(ts.createNumericLiteral(String(n))),
  b => ts.createLiteralTypeNode(ts.createLiteral(b)),
  () => ts.createKeywordTypeNode(ts.SyntaxKind.NullKeyword)
)

function toLiteralsTypeNode(values: ReadonlyNonEmptyArray<Literal>): Array<ts.TypeNode> {
  return values.map(toLiteralTypeNode)
}

/**
 * @since 3.0.0
 */
export function literal<A extends Literal>(value: A): TypeNode<A> {
  return {
    typeNode: () => C.make(toLiteralTypeNode(value))
  }
}

/**
 * @since 3.0.0
 */
export function literals<A extends Literal>(values: ReadonlyNonEmptyArray<A>): TypeNode<A> {
  return {
    typeNode: () => C.make(ts.createUnionTypeNode(toLiteralsTypeNode(values)))
  }
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(values: ReadonlyNonEmptyArray<A>, or: TypeNode<B>): TypeNode<A | B> {
  return {
    typeNode: () => C.make(ts.createUnionTypeNode([...toLiteralsTypeNode(values), or.typeNode()]))
  }
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const string: TypeNode<string> = {
  typeNode: () => C.make(ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword))
}

/**
 * @since 3.0.0
 */
export const number: TypeNode<number> = {
  typeNode: () => C.make(ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword))
}

/**
 * @since 3.0.0
 */
export const boolean: TypeNode<boolean> = {
  typeNode: () => C.make(ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword))
}

/**
 * @since 3.0.0
 */
export const UnknownArray: TypeNode<Array<unknown>> = {
  typeNode: () => C.make(ts.createTypeReferenceNode('Array', [ts.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)]))
}

/**
 * @since 3.0.0
 */
export const UnknownRecord: TypeNode<Record<string, unknown>> = {
  typeNode: () =>
    C.make(
      ts.createTypeReferenceNode('Record', [
        ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ts.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
      ])
    )
}

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function type<A>(properties: { [K in keyof A]: TypeNode<A[K]> }): TypeNode<A> {
  const typeNodes: Record<string, TypeNode<unknown>> = properties
  return {
    typeNode: () =>
      C.make(
        ts.createTypeLiteralNode(
          Object.keys(typeNodes).map(k =>
            ts.createPropertySignature(undefined, k, undefined, typeNodes[k].typeNode(), undefined)
          )
        )
      )
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(properties: { [K in keyof A]: TypeNode<A[K]> }): TypeNode<Partial<A>> {
  return {
    typeNode: () => C.make(ts.createTypeReferenceNode('Partial', [type(properties).typeNode()]))
  }
}

/**
 * @since 3.0.0
 */
export function record<A>(codomain: TypeNode<A>): TypeNode<Record<string, A>> {
  return {
    typeNode: () =>
      C.make(
        ts.createTypeReferenceNode('Record', [
          ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
          codomain.typeNode()
        ])
      )
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(items: TypeNode<A>): TypeNode<Array<A>> {
  return {
    typeNode: () => C.make(ts.createTypeReferenceNode('Array', [items.typeNode()]))
  }
}

/**
 * @since 3.0.0
 */
export function tuple<A extends ReadonlyArray<unknown>>(
  ...components: { [K in keyof A]: TypeNode<A[K]> }
): TypeNode<A> {
  return {
    typeNode: () => C.make(ts.createTupleTypeNode(components.map(c => c.typeNode())))
  }
}

/**
 * @since 3.0.0
 */
export function intersection<A, B>(left: TypeNode<A>, right: TypeNode<B>): TypeNode<A & B> {
  return {
    typeNode: () => C.make(ts.createIntersectionTypeNode([left.typeNode(), right.typeNode()]))
  }
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  _tag: T
): <A>(members: { [K in keyof A]: TypeNode<A[K] & Record<T, K>> }) => TypeNode<A[keyof A]> {
  return (members: Record<string, TypeNode<unknown>>) => {
    return {
      typeNode: () => C.make(ts.createUnionTypeNode(Object.keys(members).map(k => members[k].typeNode())))
    }
  }
}

/**
 * @since 3.0.0
 */
export function lazy<A>(id: string, f: () => TypeNode<A>): TypeNode<A> {
  let $ref: string
  return {
    typeNode: () => {
      if (!$ref) {
        $ref = id
        return C.make(f().typeNode())
      }
      return C.make(ts.createTypeReferenceNode($ref, undefined))
    }
  }
}

/**
 * @since 3.0.0
 */
export function union<A, B extends ReadonlyArray<unknown>>(
  member: TypeNode<A>,
  ...members: { [K in keyof B]: TypeNode<B[K]> }
): TypeNode<A | B[number]> {
  const ms = [member, ...members]
  return {
    typeNode: () => C.make(ts.createUnionTypeNode(ms.map(typeNode => typeNode.typeNode())))
  }
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const URI = 'TypeNode'

/**
 * @since 3.0.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly TypeNode: TypeNode<A>
  }
}

/**
 * @since 3.0.0
 */
export const typeNode: S.Schemable<URI> & S.WithUnion<URI> = {
  URI,
  literal,
  literals,
  literalsOr,
  string,
  number,
  boolean,
  UnknownArray,
  UnknownRecord,
  type,
  partial,
  record,
  array,
  tuple: tuple as S.Schemable<URI>['tuple'],
  intersection,
  sum,
  lazy,
  union
}

// -------------------------------------------------------------------------------------
// helpers
// -------------------------------------------------------------------------------------

const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed
})

const source = ts.createSourceFile('', '', ts.ScriptTarget.Latest)

/**
 * @since 3.0.0
 */
export function print(node: ts.Node): string {
  return printer.printNode(ts.EmitHint.Unspecified, node, source)
}
