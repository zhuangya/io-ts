/**
 * @since 3.0.0
 */
import * as E from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import { drawTree, make, Tree } from 'fp-ts/lib/Tree'
import { DecodeError } from './DecodeError'

function title(actual: unknown, id: string | undefined, message: string | undefined) {
  if (message) {
    return message
  }
  return `Cannot decode ${JSON.stringify(actual)}` + (id ? `, expected ${id}` : '')
}

/**
 * @since 3.0.0
 */
export function toTree(e: DecodeError): Tree<string> {
  switch (e._tag) {
    case 'Leaf':
      return make(title(e.actual, e.id, e.message))
    case 'Indexed':
      return make(
        title(e.actual, e.id, e.message),
        e.errors.map(([i, e]) => {
          const t = toTree(e)
          return { ...t, value: `(${i}) ${t.value}` }
        })
      )
    case 'Labeled':
      return make(
        title(e.actual, e.id, e.message),
        e.errors.map(([k, e]) => {
          const t = toTree(e)
          return { ...t, value: `(${JSON.stringify(k)}) ${t.value}` }
        })
      )
    case 'And':
      return make(
        e.message
          ? e.message
          : `All the following conditions are not met` + (e.id ? ` while decoding to ${e.id}` : '') + ':',
        e.errors.map(toTree)
      )
  }
}

/**
 * @since 3.0.0
 */
export const mapLeft: <A>(e: E.Either<DecodeError, A>) => E.Either<string, A> = E.mapLeft(flow(toTree, drawTree))
