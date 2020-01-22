import * as Benchmark from 'benchmark'
import * as t from '../../src'
import * as d from '../../src/Decoder'

const suite = new Benchmark.Suite()

const TPerson = t.strict({
  name: t.string,
  age: t.number,
  parents: t.type({
    father: t.type({ name: t.string }),
    mother: t.type({ name: t.string })
  })
})

const DPerson = d.type({
  name: d.string,
  age: d.number,
  parents: d.type({
    father: d.type({ name: d.string }),
    mother: d.type({ name: d.string })
  })
})

const good = {
  name: 'name',
  age: 47,
  parents: {
    father: { name: 'father' },
    mother: { name: 'mother' }
  }
}

const bad = {
  name: 1,
  age: 47,
  parents: {
    father: { name: 'father' },
    mother: { name: 'mother' }
  }
}

suite
  .add('TPerson (good)', function() {
    TPerson.decode(good)
  })
  .add('DPerson (good)', function() {
    DPerson.decode(good)
  })
  .add('TPerson (bad)', function() {
    TPerson.decode(bad)
  })
  .add('DPerson (bad)', function() {
    DPerson.decode(bad)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
