/**
 * @since 3.0.0
 */
import { drawTree, Tree } from 'fp-ts/lib/Tree'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'

/**
 * @since 3.0.0
 */
export function toString(e: NonEmptyArray<Tree<string>>): string {
  return e.map(drawTree).join('\n')
}
