/**
 * @since 3.0.0
 */
import { make, Tree } from 'fp-ts/lib/Tree'
import { DecodeError } from './DecodeError'

/**
 * @since 3.0.0
 */
export function toTree(e: DecodeError): Tree<string> {
  const value = (e: DecodeError): string => `Expected a valid ${e.expected}, but was ${JSON.stringify(e.actual)}`
  const d = e.detail
  if (d) {
    switch (d._tag) {
      case 'IndexedProduct':
        return make(
          value(e),
          d.errors.map(([i, e]) => {
            const t = toTree(e)
            return { ...t, value: `(${i}) ${t.value}` }
          })
        )
      case 'LabeledProduct':
        return make(
          value(e),
          d.errors.map(([k, e]) => {
            const t = toTree(e)
            return { ...t, value: `(${JSON.stringify(k)}) ${t.value}` }
          })
        )
      case 'And':
      case 'Or':
        return make(value(e), d.errors.map(toTree))
    }
  } else {
    return make(value(e))
  }
}
