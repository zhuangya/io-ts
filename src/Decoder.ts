/**
 * Missing combinators:
 * - brand
 * - `Int` decoder
 *
 * Open questions:
 * - is it possible to handle `enum`s?
 * - how to change a field? (for example snake case to camel case)
 * - is it possible to define a Decoder which fails with additional fields?
 * - is it possible to get only the first error?
 * - is it possible to optimize sum types?
 *
 * @since 3.0.0
 */
import * as E from 'fp-ts/lib/Either'
import { Refinement, flow } from 'fp-ts/lib/function'
import * as DE from './DecodeError'

//
// model
//

/**
 * @since 3.0.0
 */
export interface Decoder<A> {
  readonly name: string
  readonly decode: (u: unknown) => E.Either<DE.DecodeError, A>
}

/**
 * @since 3.0.0
 */
export type Decoding<D> = D extends Decoder<infer A> ? A : never

//
// primitives
//

/**
 * @since 3.0.0
 */
export function refinement<A>(refinement: Refinement<unknown, A>, name: string): Decoder<A> {
  return {
    name,
    decode: E.fromPredicate(refinement, u => DE.decodeError(name, u))
  }
}

/**
 * @since 3.0.0
 */
export const string: Decoder<string> = refinement((u: unknown): u is string => typeof u === 'string', 'string')

/**
 * @since 3.0.0
 */
export const number: Decoder<number> = refinement((u: unknown): u is number => typeof u === 'number', 'number')

/**
 * @since 3.0.0
 */
export const boolean: Decoder<boolean> = refinement((u: unknown): u is boolean => typeof u === 'boolean', 'boolean')

/**
 * @since 3.0.0
 */
export const UnknownRecord: Decoder<Record<string, unknown>> = refinement(
  (u: unknown): u is Record<string, unknown> => Object.prototype.toString.call(u) === '[object Object]',
  'Record<string, unknown>'
)

/**
 * @since 3.0.0
 */
export const UnknownArray: Decoder<Array<unknown>> = refinement(Array.isArray, 'Array<unknown>')

/**
 * @since 3.0.0
 */
export function literal<L extends string | number | boolean>(literal: L, name?: string): Decoder<L> {
  const expected = name ?? JSON.stringify(literal)
  return refinement((u: unknown): u is L => u === literal, expected)
}

/**
 * @since 3.0.0
 */
export function keyof<A>(keys: Record<keyof A, unknown>, name?: string): Decoder<keyof A> {
  const expected =
    name ??
    Object.keys(keys)
      .map(k => JSON.stringify(k))
      .join(' | ')
  return refinement(
    (u: unknown): u is keyof A => typeof u === 'string' && Object.prototype.hasOwnProperty.call(keys, u),
    expected
  )
}

//
// combinators
//

const getStructNames = (decoders: Record<string, Decoder<any>>): string =>
  Object.keys(decoders)
    .map(k => `${k}: ${decoders[k].name}`)
    .join(', ')

const getTupleNames = (decoders: Array<Decoder<any>>, sep: string): string =>
  decoders.map(decoder => decoder.name).join(sep)

/**
 * @since 3.0.0
 */
export function type<A>(decoders: { [K in keyof A]: Decoder<A[K]> }, name?: string): Decoder<A> {
  const expected = name ?? `{ ${getStructNames(decoders)} }`
  return {
    name: expected,
    decode: u => {
      const e = UnknownRecord.decode(u)
      if (E.isLeft(e)) {
        return E.left(DE.decodeError(expected, u))
      } else {
        const r = e.right
        let a: A = {} as any
        const es: Array<[string, DE.DecodeError]> = []
        for (const k in decoders) {
          const e = decoders[k].decode(r[k])
          if (E.isLeft(e)) {
            es.push([k, e.left])
          } else {
            a[k] = e.right
          }
        }
        return DE.isNonEmpty(es) ? E.left(DE.decodeError(expected, u, DE.labeledProduct(es))) : E.right(a)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function partial<A>(decoders: { [K in keyof A]: Decoder<A[K]> }, name?: string): Decoder<Partial<A>> {
  const expected = name ?? `Partial<{ ${getStructNames(decoders)} }>`
  return {
    name: expected,
    decode: u => {
      const e = UnknownRecord.decode(u)
      if (E.isLeft(e)) {
        return E.left(DE.decodeError(expected, u))
      } else {
        const r = e.right
        let a: Partial<A> = {}
        const es: Array<[string, DE.DecodeError]> = []
        for (const k in decoders) {
          if (r[k] !== undefined) {
            const e = decoders[k].decode(r[k])
            if (E.isLeft(e)) {
              es.push([k, e.left])
            } else {
              a[k] = e.right
            }
          }
        }
        return DE.isNonEmpty(es) ? E.left(DE.decodeError(expected, u, DE.labeledProduct(es))) : E.right(a)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function record<V>(decoder: Decoder<V>, name?: string): Decoder<Record<string, V>> {
  const expected = name ?? `Record<string, ${decoder.name}>`
  return {
    name: expected,
    decode: u => {
      const e = UnknownRecord.decode(u)
      if (E.isLeft(e)) {
        return E.left(DE.decodeError(expected, u))
      } else {
        const r = e.right
        let a: Record<string, V> = {}
        const es: Array<[string, DE.DecodeError]> = []
        for (const k in r) {
          const e = decoder.decode(r[k])
          if (E.isLeft(e)) {
            es.push([k, e.left])
          } else {
            a[k] = e.right
          }
        }
        return DE.isNonEmpty(es) ? E.left(DE.decodeError(expected, u, DE.labeledProduct(es))) : E.right(a)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function array<A>(decoder: Decoder<A>, name?: string): Decoder<Array<A>> {
  const expected = name ?? `Array<${decoder.name}>`
  return {
    name: expected,
    decode: u => {
      const e = UnknownArray.decode(u)
      if (E.isLeft(e)) {
        return E.left(DE.decodeError(expected, u))
      } else {
        const us = e.right
        const len = us.length
        const a: Array<A> = new Array(len)
        const es: Array<[number, DE.DecodeError]> = []
        for (let i = 0; i < len; i++) {
          const e = decoder.decode(us[i])
          if (E.isLeft(e)) {
            es.push([i, e.left])
          } else {
            a[i] = e.right
          }
        }
        return DE.isNonEmpty(es) ? E.left(DE.decodeError(expected, us, DE.indexedProduct(es))) : E.right(a)
      }
    }
  }
}

/**
 * @since 3.0.0
 */
export function tuple<A extends [unknown, ...Array<unknown>]>(
  decoders: { [K in keyof A]: Decoder<A[K]> },
  name?: string
): Decoder<A> {
  const expected = name ?? `[${getTupleNames(decoders, ', ')}]`
  return {
    name: expected,
    decode: u => {
      const e = UnknownArray.decode(u)
      if (E.isLeft(e)) {
        return E.left(DE.decodeError(expected, u))
      } else {
        const us = e.right
        const len = decoders.length
        const a: A = new Array(len) as any
        const es: Array<[number, DE.DecodeError]> = []
        for (let i = 0; i < len; i++) {
          const e = decoders[i].decode(us[i])
          if (E.isLeft(e)) {
            es.push([i, e.left])
          } else {
            a[i] = e.right
          }
        }
        return DE.isNonEmpty(es) ? E.left(DE.decodeError(expected, us, DE.indexedProduct(es))) : E.right(a)
      }
    }
  }
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

/**
 * @since 3.0.0
 */
export function intersection<A extends [unknown, unknown, ...Array<unknown>]>(
  decoders: { [K in keyof A]: Decoder<A[K]> },
  name?: string
): Decoder<{ [K in keyof UnionToIntersection<A[number]>]: UnionToIntersection<A[number]>[K] }> {
  const expected = name ?? `(${getTupleNames(decoders, ' & ')})`
  return {
    name: expected,
    decode: u => {
      const as: Array<unknown> = []
      const es: Array<DE.DecodeError> = []
      for (let i = 0; i < decoders.length; i++) {
        const e = decoders[i].decode(u)
        if (E.isLeft(e)) {
          es.push(e.left)
        } else {
          as[i] = e.right
        }
      }
      return DE.isNonEmpty(es) ? E.left(DE.decodeError(expected, u, DE.and(es))) : E.right(Object.assign({}, ...as))
    }
  }
}

/**
 * @since 3.0.0
 */
export function union<A extends [unknown, unknown, ...Array<unknown>]>(
  decoders: { [K in keyof A]: Decoder<A[K]> },
  name?: string
): Decoder<A[number]> {
  const expected = name ?? `(${getTupleNames(decoders, ' | ')})`
  return {
    name: expected,
    decode: u => {
      const es: Array<DE.DecodeError> = []
      for (let i = 0; i < decoders.length; i++) {
        const e = decoders[i].decode(u)
        if (E.isLeft(e)) {
          es.push(e.left)
        } else {
          return e
        }
      }
      return E.left(DE.decodeError(expected, u, DE.or(es as any)))
    }
  }
}

/**
 * @since 3.0.0
 */
export function recursive<A>(name: string, f: () => Decoder<A>): Decoder<A> {
  let memoized: Decoder<A>
  function getMemoized(): Decoder<A> {
    if (!memoized) {
      const { decode } = f()
      memoized = {
        name,
        decode: flow(
          decode,
          E.mapLeft(e => ({ ...e, expected: name }))
        )
      }
    }
    return memoized
  }
  return {
    name,
    decode: u => getMemoized().decode(u)
  }
}

// /**
//  * @since 3.0.0
//  */
// export function withExpected<A>(decoder: Decoder<A>, f: (e: DE.DecodeError) => string): Decoder<A> {
//   return {
//     name: decoder.name,
//     decode: flow(
//       decoder.decode,
//       E.mapLeft(e => ({ ...e, expected: f(e) }))
//     )
//   }
// }

// export function required<N extends string, A, M extends string = N>(
//   name: N,
//   decoder: Decoder<A>,
//   rename?: M
// ): Decoder<{ [K in M]: A }> {
//   const to = rename || name
//   return flow(
//     UnknownRecord,
//     E.chain(r =>
//       pipe(
//         decoder(r[name]),
//         E.bimap(
//           e => ({ ...e, expected: `required ${JSON.stringify(name)} field` }),
//           a => ({ [to]: a } as { [K in M]: A })
//         )
//       )
//     )
//   )
// }

// export function optional<N extends string, A, M extends string = N>(
//   name: N,
//   decoder: Decoder<A>,
//   rename?: M
// ): Decoder<{ [K in M]?: A }> {
//   const to = rename || name
//   return flow(
//     UnknownRecord,
//     E.chain(r => {
//       if (r[name] === undefined) {
//         return E.right({})
//       }
//       return pipe(
//         decoder(r[name]),
//         E.bimap(
//           e => ({ ...e, expected: `optional ${JSON.stringify(name)} field` }),
//           a => ({ [to]: a } as { [K in M]: A })
//         )
//       )
//     })
//   )
// }
