import * as Benchmark from 'benchmark'
import { UnknownRecord } from '../../src/Eq'

const suite = new Benchmark.Suite()

const r1 = { a: 'a', b: 2, c: true }

const r2 = { a: 'a', b: 2, c: true }

const r3 = { a: 'a', d: 2, c: true }

suite
  .add('UnknownRecord (===)', function() {
    UnknownRecord.equals(r1, r1)
  })
  .add('UnknownRecord (true)', function() {
    UnknownRecord.equals(r1, r2)
  })
  .add('UnknownRecord (false)', function() {
    UnknownRecord.equals(r1, r3)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
