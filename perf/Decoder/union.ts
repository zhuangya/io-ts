import * as Benchmark from 'benchmark'
import * as t from '../../src'
import * as D from '../../src/Decoder'

const suite = new Benchmark.Suite()

const TUnion = t.union([
  t.type({
    _tag: t.literal('A'),
    a: t.string
  }),
  t.type({
    _tag: t.literal('B'),
    b: t.string
  })
])

const DUnion = D.sum('_tag')({
  A: D.type({ a: D.string }),
  B: D.type({ b: D.string })
})

const good = {
  _tag: 'B',
  b: 'b'
}

const bad = {
  _tag: 'B',
  b: 1
}

suite
  .add('TUnion (good)', function() {
    TUnion.decode(good)
  })
  .add('DUnion (good)', function() {
    DUnion.decode(good)
  })
  .add('TUnion (bad)', function() {
    TUnion.decode(bad)
  })
  .add('DUnion (bad)', function() {
    DUnion.decode(bad)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
