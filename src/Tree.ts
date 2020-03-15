import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { drawTree, Tree } from 'fp-ts/lib/Tree'

/**
 * @since 3.0.0
 */
export function mapLeft<A>(e: E.Either<Tree<string>, A>): E.Either<string, A> {
  return pipe(e, E.mapLeft(drawTree))
}
