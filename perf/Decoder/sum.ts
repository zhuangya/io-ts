import * as Ajv from 'ajv'
import * as Benchmark from 'benchmark'
import { Kind, URIS } from 'fp-ts/lib/HKT'
import * as t from '../../src'
import * as D from '../../src/Decoder'
import * as J from '../../src/JsonSchema'
import * as S from '../../src/Schemable'

/*
index (good) x 3,372,830 ops/sec ±1.42% (87 runs sampled)
decoder (good) x 4,350,520 ops/sec ±0.75% (87 runs sampled)
AJV (good) x 65,193 ops/sec ±0.81% (89 runs sampled)
index (bad) x 2,704,714 ops/sec ±3.35% (84 runs sampled)
decoder (bad) x 3,392,211 ops/sec ±2.05% (88 runs sampled)
AJV (bad) x 64,509 ops/sec ±1.48% (89 runs sampled)
Fastest is decoder (good)
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

const ajv = new Ajv()

function run<A>(jsonSchema: object, a: A): boolean {
  return ajv.compile(jsonSchema)(a) as any
}

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
    run(JSum, good)
  })
  .add('index (bad)', function() {
    TSum.decode(bad)
  })
  .add('decoder (bad)', function() {
    DSum.decode(bad)
  })
  .add('AJV (bad)', function() {
    run(JSum, bad)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
