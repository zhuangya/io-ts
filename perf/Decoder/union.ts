import * as Benchmark from 'benchmark'
import * as t from '../../src'
import * as d from '../../src/Decoder'
import { range } from 'fp-ts/lib/Array'

const suite = new Benchmark.Suite()

const getT = <T extends string>(type: T) =>
  t.strict({
    type: t.literal(type),
    a: t.string
  })

const getD = <T extends string>(type: T) =>
  d.type({
    type: d.literal(type),
    a: d.string
  })

const getInputT = (n: number) => range(1, n).map(n => getT(`T${n}`))

const getInputD = (n: number) => range(1, n).map(n => getD(`T${n}`))

const TUnion = t.union(getInputT(100) as any)

const DUnion = d.union(getInputD(100) as any)

const good = {
  type: 'F',
  a: 'a'
}

const bad = {
  type: 'F',
  a: 1
}

suite
  .add('TPerson (good)', function() {
    TUnion.decode(good)
  })
  .add('DPerson (good)', function() {
    DUnion.decode(good)
  })
  .add('TPerson (bad)', function() {
    TUnion.decode(bad)
  })
  .add('DPerson (bad)', function() {
    DUnion.decode(bad)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
