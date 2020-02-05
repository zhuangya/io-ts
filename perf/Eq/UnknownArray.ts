import * as Benchmark from 'benchmark'
import { UnknownArray } from '../../src/Eq'

const suite = new Benchmark.Suite()

const as = [1, 2, 3]

const bs = [1, 2, 3]

const cs = [1, 2, 3, 4]

suite
  .add('UnknownArray (===)', function() {
    UnknownArray.equals(as, as)
  })
  .add('UnknownArray (true)', function() {
    UnknownArray.equals(as, bs)
  })
  .add('UnknownArray (false)', function() {
    UnknownArray.equals(as, cs)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
