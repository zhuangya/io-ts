/**
 * @since 3.0.0
 */
import * as fc from 'fast-check'
import * as Arb from './Arbitrary'
import * as S from './Schemable'

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const arbitraryMutation: S.Schemable<Arb.URI> &
  S.WithLazy<Arb.URI> &
  S.WithParse<Arb.URI> &
  S.WithUnion<Arb.URI> = {
  URI: Arb.URI,
  literals: () => fc.constant({}) as any,
  literalsOr: (_, arb) => fc.oneof(fc.constant({}), arb) as any,
  string: fc.oneof<number | boolean>(Arb.number, Arb.boolean) as any,
  number: fc.oneof<string | boolean>(Arb.string, Arb.boolean) as any,
  boolean: fc.oneof<string | number>(Arb.string, Arb.number) as any,
  UnknownArray: Arb.UnknownRecord as any,
  UnknownRecord: Arb.UnknownArray as any,
  type: arbs => Arb.type(arbs).filter(m => Object.keys(m).length > 0),
  partial: arbs => Arb.partial(arbs).filter(m => Object.keys(m).length > 0),
  record: arb => Arb.record(arb).filter(m => Object.keys(m).length > 0),
  array: arb => Arb.array(arb).filter(m => m.length > 0),
  tuple: Arb.tuple,
  intersection: Arb.intersection,
  sum: Arb.sum,
  lazy: Arb.lazy,
  parse: Arb.parse,
  union: Arb.union
}
