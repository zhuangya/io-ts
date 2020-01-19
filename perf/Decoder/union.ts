import * as Benchmark from 'benchmark'
import * as t from '../../src'
import * as d from '../../src/Decoder'

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

const TUnion = t.union([getT('A'), getT('B'), getT('C'), getT('D'), getT('E'), getT('F')])

const DUnion = d.union([getD('A'), getD('B'), getD('C'), getD('D'), getD('E'), getD('F')])

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
    DUnion(good)
  })
  .add('TPerson (bad)', function() {
    TUnion.decode(bad)
  })
  .add('DPerson (bad)', function() {
    DUnion(bad)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
