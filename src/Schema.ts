/**
 * @since 3.0.0
 */
import { Kind, URIS } from 'fp-ts/lib/HKT'
import * as S from './Schemable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export interface Schema<A> {
  <S extends URIS>(S: S.Schemable<S> & S.WithUnion<S>): Kind<S, A>
}

/**
 * @since 3.0.0
 */
export function make<A>(f: Schema<A>): Schema<A> {
  return S.memoize(f)
}
