import * as Benchmark from 'benchmark'
import { literals } from '../../src/Decoder'

/*
one (good) x 734,729,573 ops/sec ±0.37% (91 runs sampled)
one (bad) x 3,020,283 ops/sec ±1.84% (87 runs sampled)
strings (good) x 96,093,413 ops/sec ±1.26% (82 runs sampled)
strings (bad) x 2,975,751 ops/sec ±1.37% (89 runs sampled)
mixed (good) x 42,544,474 ops/sec ±0.99% (89 runs sampled)
mixed (bad) x 2,697,733 ops/sec ±1.96% (83 runs sampled)
*/

const suite = new Benchmark.Suite()

const one = literals(['a'])

const strings = literals(['a', 'b', 'c'])

const mixed = literals(['a', 2, 'c'])

suite
  .add('one (good)', function() {
    one.decode('a')
  })
  .add('one (bad)', function() {
    one.decode('d')
  })
  .add('strings (good)', function() {
    strings.decode('c')
  })
  .add('strings (bad)', function() {
    strings.decode('d')
  })
  .add('mixed (good)', function() {
    mixed.decode('c')
  })
  .add('mixed (bad)', function() {
    mixed.decode('d')
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
