import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { drawTree, Tree } from 'fp-ts/lib/Tree'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'

/**
 * @since 3.0.0
 */
export function mapLeft<A>(e: E.Either<NonEmptyArray<Tree<string>>, A>): E.Either<string, A> {
  return pipe(
    e,
    E.mapLeft(forest => forest.map(drawTree).join('\n'))
  )
}
