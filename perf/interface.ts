import * as Benchmark from 'benchmark'
import * as t from '../src'

const suite = new Benchmark.Suite()

const T = t.type({
  name: t.string,
  age: t.number
})

const valid = { name: 'name', age: 45 }
const invalid = { name: 'name', age: 'age' }

suite
  .add('t.type (decode, valid)', function() {
    T.decode(valid)
  })
  .add('t.type (is, valid)', function() {
    T.is(valid)
  })
  .add('t.type (decode, invalid)', function() {
    T.decode(invalid)
  })
  .add('t.type (is, invalid)', function() {
    T.is(invalid)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
