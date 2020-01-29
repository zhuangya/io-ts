import * as Ajv from 'ajv'
import * as Benchmark from 'benchmark'
import { Kind, URIS } from 'fp-ts/lib/HKT'
import * as t from '../../src'
import * as D from '../../src/Decoder'
import * as J from '../../src/JsonSchema'
import * as S from '../../src/Schemable'

/*
index (good) x 694,970 ops/sec ±0.70% (88 runs sampled)
decoder (good) x 1,357,466 ops/sec ±0.78% (87 runs sampled)
decoder with expected (good) x 1,279,203 ops/sec ±2.20% (86 runs sampled)
AJV (good) x 48,323 ops/sec ±2.78% (88 runs sampled)
index (bad) x 1,156,739 ops/sec ±2.58% (84 runs sampled)
decoder (bad) x 1,237,579 ops/sec ±2.62% (86 runs sampled)
decoder with expected (bad) x 903,575 ops/sec ±2.31% (88 runs sampled)
AJV (good) x 43,797 ops/sec ±3.56% (84 runs sampled)
Fastest is decoder (bad)
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

const DPersonWithExpected = D.withExpected(DPerson, 'DPerson')

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

const ajv = new Ajv()

function run<A>(jsonSchema: object, a: A): boolean {
  return ajv.compile(jsonSchema)(a) as any
}

suite
  .add('index (good)', function() {
    TPerson.decode(good)
  })
  .add('decoder (good)', function() {
    DPerson.decode(good)
  })
  .add('decoder with expected (good)', function() {
    DPersonWithExpected.decode(good)
  })
  .add('AJV (good)', function() {
    run(AJVPerson, good)
  })
  .add('index (bad)', function() {
    TPerson.decode(bad)
  })
  .add('decoder (bad)', function() {
    DPerson.decode(bad)
  })
  .add('decoder with expected (bad)', function() {
    DPersonWithExpected.decode(bad)
  })
  .add('AJV (bad)', function() {
    run(AJVPerson, bad)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
