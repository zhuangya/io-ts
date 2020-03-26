import * as S from './Schemable';
/**
 * @since 3.0.0
 */
export function make(f) {
    return S.memoize(f);
}
