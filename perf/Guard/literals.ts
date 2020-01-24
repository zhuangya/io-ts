import * as Benchmark from 'benchmark'
import * as G from '../../src/Guard'

const suite = new Benchmark.Suite()

const L = G.literals(['a'])

suite
  .add('literals (good)', function() {
    L.is('a')
  })
  .add('literals (bad)', function() {
    L.is('d')
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
