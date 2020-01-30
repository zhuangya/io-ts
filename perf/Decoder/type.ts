import * as Ajv from 'ajv'
import * as Benchmark from 'benchmark'
import { Kind, URIS } from 'fp-ts/lib/HKT'
import * as t from '../../src'
import * as D from '../../src/Decoder'
import * as J from '../../src/JsonSchema'
import * as S from '../../src/Schemable'

/*
index (good) x 692,993 ops/sec ±2.05% (83 runs sampled)
decoder (good) x 1,363,445 ops/sec ±0.51% (85 runs sampled)
AJV (good) x 33,714,367 ops/sec ±1.24% (83 runs sampled)
index (bad) x 1,149,093 ops/sec ±2.39% (86 runs sampled)
decoder (bad) x 1,225,891 ops/sec ±3.16% (88 runs sampled)
AJV (bad) x 6,963,926 ops/sec ±2.11% (85 runs sampled)
Fastest is AJV (good)
*/

const suite = new Benchmark.Suite()

interface Schema<A> {
  <S extends URIS>(S: S.Schemable<S>): Kind<S, A>
}

function make<A>(f: Schema<A>): Schema<A> {
  return f
}

const TPerson = t.strict({
  name: t.string,
  age: t.number,
  parents: t.type({
    father: t.type({ name: t.string }),
    mother: t.type({ name: t.string })
  })
})

const Person = make(S =>
  S.type({
    name: S.string,
    age: S.number,
    parents: S.type({
      father: S.type({ name: S.string }),
      mother: S.type({ name: S.string })
    })
  })
)

const DPerson = Person(D.decoder)

const AJVPerson = Person(J.jsonSchema)

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

const ajv = new Ajv({ allErrors: true })
const validateJSON = ajv.compile(AJVPerson)

suite
  .add('index (good)', function() {
    TPerson.decode(good)
  })
  .add('decoder (good)', function() {
    DPerson.decode(good)
  })
  .add('AJV (good)', function() {
    validateJSON(good)
  })
  .add('index (bad)', function() {
    TPerson.decode(bad)
  })
  .add('decoder (bad)', function() {
    DPerson.decode(bad)
  })
  .add('AJV (bad)', function() {
    validateJSON(bad)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
