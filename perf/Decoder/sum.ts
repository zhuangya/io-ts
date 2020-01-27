import * as Benchmark from 'benchmark'
import * as t from '../../src'
import * as D from '../../src/Decoder'
import * as Ajv from 'ajv'
import * as J from '../../src/JsonSchema'

const suite = new Benchmark.Suite()

const TSum = t.union([
  t.type({
    _tag: t.literal('A'),
    a: t.string
  }),
  t.type({
    _tag: t.literal('B'),
    b: t.string
  })
])

const DSum = D.sum('_tag')({
  A: D.type({ _tag: D.literals(['A']), a: D.string }),
  B: D.type({ _tag: D.literals(['B']), b: D.string })
})

const JSum = J.sum('_tag')({
  A: J.type({ _tag: J.literals(['A']), a: J.string }),
  B: J.type({ _tag: J.literals(['B']), b: J.string })
})

const ajv = new Ajv()

function run<A>(jsonSchema: object, a: A): boolean {
  return ajv.compile(jsonSchema)(a) as any
}

const good = {
  _tag: 'B',
  b: 'b'
}

const bad = {
  _tag: 'B',
  b: 1
}

suite
  .add('TSum (good)', function() {
    TSum.decode(good)
  })
  .add('DSum (good)', function() {
    DSum.decode(good)
  })
  .add('JSum (good)', function() {
    run(JSum, good)
  })
  .add('TSum (bad)', function() {
    TSum.decode(bad)
  })
  .add('DSum (bad)', function() {
    DSum.decode(bad)
  })
  .add('JSum (bad)', function() {
    run(JSum, bad)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
