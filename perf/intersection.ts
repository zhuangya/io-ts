import * as Benchmark from 'benchmark'
import * as t from '../src'

const suite = new Benchmark.Suite()

const T = t.intersection([t.type({ a: t.number }), t.type({ b: t.string })])

const valid = { a: 1, b: 'b' }
const invalid = { a: 1, b: 1 }

suite
  .add('t.intersection (valid)', function() {
    T.decode(valid)
  })
  .add('t.intersection (invalid)', function() {
    T.decode(invalid)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
