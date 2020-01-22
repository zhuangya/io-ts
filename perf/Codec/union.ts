import * as Benchmark from 'benchmark'
import * as t from '../../src'
import * as C from '../../src/Codec'
import { range } from 'fp-ts/lib/Array'

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
