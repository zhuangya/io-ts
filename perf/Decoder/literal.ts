import * as Benchmark from 'benchmark'
import * as D from '../../src/Decoder'

const suite = new Benchmark.Suite()

const Ls = D.literals(['a'])
const L = D.literal('a')

suite
  .add('literals (good)', function() {
    Ls.decode('a')
  })
  .add('literal (good)', function() {
    L.decode('a')
  })
  .add('literals (bad)', function() {
    Ls.decode(1)
  })
  .add('literal (bad)', function() {
    L.decode(1)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
