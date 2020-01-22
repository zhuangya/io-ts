import * as Benchmark from 'benchmark'
import * as t from '../../src'
import * as C from '../../src/Codec'
import { range } from 'fp-ts/lib/Array'

/*
TUnion (good) x 1,269,637 ops/sec ±0.43% (88 runs sampled)
CUnion (good) x 44,216 ops/sec ±0.55% (82 runs sampled)
TUnion (bad) x 1,244,076 ops/sec ±4.06% (85 runs sampled)
CUnion (bad) x 41,267 ops/sec ±0.34% (88 runs sampled)
Fastest is TUnion (good),TUnion (bad)
*/

const suite = new Benchmark.Suite()

const getT = <T extends string>(type: T) =>
  t.strict({
    type: t.literal(type),
    a: t.string
  })

const getC = <T extends string>(type: T) =>
  C.type({
    type: C.literal(type),
    a: C.string
  })

const getInputT = (n: number) => range(1, n).map(n => getT(`T${n}`))

const getInputC = (n: number) => range(1, n).map(n => getC(`T${n}`))

const TUnion = t.union(getInputT(100) as any)

const CUnion = C.union(getInputC(100) as any)

const good = {
  type: 'F',
  a: 'a'
}

const bad = {
  type: 'F',
  a: 1
}

suite
  .add('TUnion (good)', function() {
    TUnion.decode(good)
  })
  .add('CUnion (good)', function() {
    CUnion.decode(good)
  })
  .add('TUnion (bad)', function() {
    TUnion.decode(bad)
  })
  .add('CUnion (bad)', function() {
    CUnion.decode(bad)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
