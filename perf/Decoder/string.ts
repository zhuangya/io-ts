import * as Benchmark from 'benchmark'
import * as t from '../../src'
import * as d from '../../src/Decoder'

const suite = new Benchmark.Suite()

const Tstring = t.string

const Dstring = d.string

const good = 'a'

const bad = 1

suite
  .add('Tstring (good)', function() {
    Tstring.decode(good)
  })
  .add('Dstring (good)', function() {
    Dstring.decode(good)
  })
  .add('Tstring (bad)', function() {
    Tstring.decode(bad)
  })
  .add('Dstring (bad)', function() {
    Dstring.decode(bad)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
