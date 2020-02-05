import * as Benchmark from 'benchmark'
import { literals } from '../../src/Decoder'

/*
one (good) x 733,532,358 ops/sec ±0.38% (89 runs sampled)
one (bad) x 724,720,855 ops/sec ±0.47% (84 runs sampled)
strings (good) x 99,177,385 ops/sec ±0.64% (91 runs sampled)
strings (bad) x 93,355,376 ops/sec ±0.56% (85 runs sampled)
mixed (good) x 41,301,997 ops/sec ±0.45% (90 runs sampled)
mixed (bad) x 33,521,174 ops/sec ±1.09% (90 runs sampled)
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
