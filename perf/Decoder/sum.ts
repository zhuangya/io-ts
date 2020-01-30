import * as Ajv from 'ajv'
import * as Benchmark from 'benchmark'
import { Kind, URIS } from 'fp-ts/lib/HKT'
import * as t from '../../src'
import * as D from '../../src/Decoder'
import * as J from '../../src/JsonSchema'
import * as S from '../../src/Schemable'

/*
index (good) x 3,392,031 ops/sec ±0.56% (87 runs sampled)
decoder (good) x 4,266,755 ops/sec ±1.25% (89 runs sampled)
AJV (good) x 4,624,733 ops/sec ±0.38% (87 runs sampled)
index (bad) x 2,677,015 ops/sec ±3.62% (84 runs sampled)
decoder (bad) x 3,425,453 ops/sec ±2.18% (86 runs sampled)
AJV (bad) x 3,598,042 ops/sec ±3.14% (87 runs sampled)
Fastest is AJV (good)
*/

const suite = new Benchmark.Suite()

interface Schema<A> {
  <S extends URIS>(S: S.Schemable<S>): Kind<S, A>
}

function make<A>(f: Schema<A>): Schema<A> {
  return f
}

const TSum = t.union([
  t.type({
    _tag: t.literal('A'),
    a: t.string
  }),
  t.type({
    _tag: t.literal('B'),
    b: t.string
  })
])

const Sum = make(S =>
  S.sum('_tag')({
    A: S.type({ _tag: S.literals(['A']), a: S.string }),
    B: S.type({ _tag: S.literals(['B']), b: S.string })
  })
)

const DSum = Sum(D.decoder)

const JSum = Sum(J.jsonSchema)

const ajv = new Ajv({ allErrors: true })
const validateJSON = ajv.compile(JSum)

const good = {
  _tag: 'B',
  b: 'b'
}

const bad = {
  _tag: 'B',
  b: 1
}

suite
  .add('index (good)', function() {
    TSum.decode(good)
  })
  .add('decoder (good)', function() {
    DSum.decode(good)
  })
  .add('AJV (good)', function() {
    validateJSON(good)
  })
  .add('index (bad)', function() {
    TSum.decode(bad)
  })
  .add('decoder (bad)', function() {
    DSum.decode(bad)
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
