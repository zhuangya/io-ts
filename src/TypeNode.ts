/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/lib/Const'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as ts from 'typescript'
import { Literal, fold } from './Literal'
import * as S from './Schemable'

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

function toLiteralTypeNode(values: Array<Literal>): Array<ts.TypeNode> {
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
export function literal<A extends Literal>(value: A): TypeNode<A> {
  return {
    typeNode: () => C.make(ts.createUnionTypeNode(toLiteralTypeNode([value])))
  }
}

/**
 * @since 3.0.0
 */
export function literals<A extends Literal>(values: NonEmptyArray<A>): TypeNode<A> {
  return {
    typeNode: () => C.make(ts.createUnionTypeNode(toLiteralTypeNode(values)))
  }
}

/**
 * @since 3.0.0
 */
export function literalsOr<A extends Literal, B>(values: NonEmptyArray<A>, typeNode: TypeNode<B>): TypeNode<A | B> {
  return {
    typeNode: () => C.make(ts.createUnionTypeNode([...toLiteralTypeNode(values), typeNode.typeNode()]))
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
export function tuple<A, B, C, D, E>(
  items: [TypeNode<A>, TypeNode<B>, TypeNode<C>, TypeNode<D>, TypeNode<E>],
  id?: string
): TypeNode<[A, B, C, D, E]>
export function tuple<A, B, C, D>(
  items: [TypeNode<A>, TypeNode<B>, TypeNode<C>, TypeNode<D>],
  id?: string
): TypeNode<[A, B, C, D]>
export function tuple<A, B, C>(items: [TypeNode<A>, TypeNode<B>, TypeNode<C>]): TypeNode<[A, B, C]>
export function tuple<A, B>(items: [TypeNode<A>, TypeNode<B>]): TypeNode<[A, B]>
export function tuple<A>(items: [TypeNode<A>]): TypeNode<[A]>
export function tuple(items: Array<TypeNode<unknown>>): TypeNode<Array<unknown>> {
  return {
    typeNode: () => C.make(ts.createTupleTypeNode(items.map(item => item.typeNode())))
  }
}

/**
 * @since 3.0.0
 */
export function intersection<A, B, C, D, E>(
  typeNodes: [TypeNode<A>, TypeNode<B>, TypeNode<C>, TypeNode<D>, TypeNode<E>]
): TypeNode<A & B & C & D & E>
export function intersection<A, B, C, D>(
  typeNodes: [TypeNode<A>, TypeNode<B>, TypeNode<C>, TypeNode<D>]
): TypeNode<A & B & C & D>
export function intersection<A, B, C>(typeNodes: [TypeNode<A>, TypeNode<B>, TypeNode<C>]): TypeNode<A & B & C>
export function intersection<A, B>(typeNodes: [TypeNode<A>, TypeNode<B>]): TypeNode<A & B>
export function intersection(typeNodes: Array<TypeNode<unknown>>): TypeNode<unknown> {
  return {
    typeNode: () => C.make(ts.createIntersectionTypeNode(typeNodes.map(typeNode => typeNode.typeNode())))
  }
}

/**
 * @since 3.0.0
 */
export function sum<T extends string>(
  _tag: T
): <A>(typeNodes: { [K in keyof A]: TypeNode<A[K] & Record<T, K>> }) => TypeNode<A[keyof A]> {
  return members => {
    const typeNodes: Record<string, TypeNode<unknown>> = members
    return {
      typeNode: () => C.make(ts.createUnionTypeNode(Object.keys(typeNodes).map(k => typeNodes[k].typeNode())))
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
      return C.make(ts.createTypeReferenceNode(id, undefined))
    }
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, ...Array<unknown>]>(
  typeNodes: { [K in keyof A]: TypeNode<A[K]> }
): TypeNode<A[number]> {
  return {
    typeNode: () => C.make(ts.createUnionTypeNode(typeNodes.map(typeNode => typeNode.typeNode())))
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
  tuple,
  intersection,
  sum,
  lazy,
  union
}
