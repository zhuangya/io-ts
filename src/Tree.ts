/**
 * @since 3.0.0
 */
import { make, Tree } from 'fp-ts/lib/Tree'
import { DecodeError } from './DecodeError'

/**
 * @since 3.0.0
 */
export function toTree(e: DecodeError): Tree<string> {
  const value = (e: DecodeError): string => `Cannot decode ${JSON.stringify(e.actual)} to expected ${e.expected}`
  switch (e._tag) {
    case 'Leaf':
      return make(value(e))
    case 'Indexed':
      return make(
        value(e),
        e.errors.map(([i, e]) => {
          const t = toTree(e)
          return { ...t, value: `(${i}) ${t.value}` }
        })
      )
    case 'Labeled':
      return make(
        value(e),
        e.errors.map(([k, e]) => {
          const t = toTree(e)
          return { ...t, value: `(${JSON.stringify(k)}) ${t.value}` }
        })
      )
    case 'And':
    case 'Or':
      return make(value(e), e.errors.map(toTree))
  }
}
