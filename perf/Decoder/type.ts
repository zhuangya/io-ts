import * as Benchmark from 'benchmark'
import * as t from '../../src'
import * as D from '../../src/Decoder'
import * as Ajv from 'ajv'

const suite = new Benchmark.Suite()

const TPerson = t.strict({
  name: t.string,
  age: t.number,
  parents: t.type({
    father: t.type({ name: t.string }),
    mother: t.type({ name: t.string })
  })
})

const DPerson = D.type({
  name: D.string,
  age: D.number,
  parents: D.type({
    father: D.type({ name: D.string }),
    mother: D.type({ name: D.string })
  })
})

const AJVPerson = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' },
    parents: {
      type: 'object',
      properties: {
        father: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            }
          },
          required: ['name']
        },
        mother: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            }
          },
          required: ['name']
        }
      },
      required: ['father', 'mother']
    }
  },
  required: ['name', 'age', 'parents']
}

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

const ajv = new Ajv()

function run<A>(jsonSchema: object, a: A): boolean {
  return ajv.compile(jsonSchema)(a) as any
}

suite
  .add('TPerson (good)', function() {
    TPerson.decode(good)
  })
  .add('DPerson (good)', function() {
    DPerson.decode(good)
  })
  .add('AJVPerson (good)', function() {
    run(AJVPerson, good)
  })
  .add('TPerson (bad)', function() {
    TPerson.decode(bad)
  })
  .add('DPerson (bad)', function() {
    DPerson.decode(bad)
  })
  .add('AJVPerson (good)', function() {
    run(AJVPerson, bad)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
