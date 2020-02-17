/**
 * @since 3.0.0
 */
import * as E from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import { drawTree, make, Tree } from 'fp-ts/lib/Tree'
import { DecodeError } from './DecodeError'

function title(actual: unknown, expected: string | undefined) {
  return `Cannot decode ${JSON.stringify(actual)}` + (expected ? `, expected ${expected}` : '')
}

/**
 * @since 3.0.0
 */
export function toTree(e: DecodeError): Tree<string> {
  switch (e._tag) {
    case 'Leaf':
      return make(title(e.actual, e.expected))
    case 'Indexed':
      return make(
        title(e.actual, e.expected),
        e.errors.map(([i, e]) => {
          const t = toTree(e)
          return { ...t, value: `(${i}) ${t.value}` }
        })
      )
    case 'Labeled':
      return make(
        title(e.actual, e.expected),
        e.errors.map(([k, e]) => {
          const t = toTree(e)
          return { ...t, value: `(${JSON.stringify(k)}) ${t.value}` }
        })
      )
    case 'And':
      return make(
        `All the following conditions are not met` + (e.expected ? ` while decoding to ${e.expected}` : '') + ':',
        e.errors.map(toTree)
      )
  }
}

/**
 * @since 3.0.0
 */
export const mapLeft: <A>(e: E.Either<DecodeError, A>) => E.Either<string, A> = E.mapLeft(flow(toTree, drawTree))
