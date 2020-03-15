import * as Ajv from 'ajv'
import * as Benchmark from 'benchmark'
import { Kind, URIS } from 'fp-ts/lib/HKT'
import * as t from '../src'
import * as D from '../src/Decoder'
import * as J from '../src/JsonSchema'
import * as S from '../src/Schemable'

/*
index (good) x 436,539 ops/sec ±0.54% (83 runs sampled)
decoder (good) x 698,811 ops/sec ±0.57% (88 runs sampled)
AJV (good) x 1,805,587 ops/sec ±0.53% (88 runs sampled)
index (bad) x 378,278 ops/sec ±3.38% (82 runs sampled)
decoder (bad) x 579,156 ops/sec ±2.07% (89 runs sampled)
AJV (bad) x 1,557,123 ops/sec ±2.86% (87 runs sampled)
Fastest is AJV (good)
*/

const suite = new Benchmark.Suite()

interface Schema<A> {
  <S extends URIS>(S: S.Schemable<S>): Kind<S, A>
}

function make<A>(f: Schema<A>): Schema<A> {
  return f
}

const TVector = t.tuple([t.number, t.number])
const Vector = make(S => S.tuple(S.number, S.number))

const TAsteroid = t.type({
  type: t.literal('asteroid'),
  location: TVector,
  mass: t.number
})
const Asteroid = make(S =>
  S.type({
    type: S.literals(['asteroid']),
    location: Vector(S),
    mass: S.number
  })
)

const TPlanet = t.type({
  type: t.literal('planet'),
  location: TVector,
  mass: t.number,
  population: t.number,
  habitable: t.boolean
})
const Planet = make(S =>
  S.type({
    type: S.literals(['planet']),
    location: Vector(S),
    mass: S.number,
    population: S.number,
    habitable: S.boolean
  })
)

const TRank = t.keyof({
  captain: null,
  'first mate': null,
  officer: null,
  ensign: null
})
const Rank = make(S => S.literals(['captain', 'first mate', 'officer', 'ensign']))

const TCrewMember = t.type({
  name: t.string,
  age: t.number,
  rank: TRank,
  home: TPlanet
})
const CrewMember = make(S =>
  S.type({
    name: S.string,
    age: S.number,
    rank: Rank(S),
    home: Planet(S)
  })
)

const TShip = t.type({
  type: t.literal('ship'),
  location: TVector,
  mass: t.number,
  name: t.string,
  crew: t.array(TCrewMember)
})
const Ship = make(S =>
  S.type({
    type: S.literals(['ship']),
    location: Vector(S),
    mass: S.number,
    name: S.string,
    crew: S.array(CrewMember(S))
  })
)

const TUnion = t.union([TAsteroid, TPlanet, TShip])
const Union = make(S =>
  S.sum('type')({
    asteroid: Asteroid(S),
    planet: Planet(S),
    ship: Ship(S)
  })
)
const DUnion = Union(D.decoder)
const JUnion = Union(J.jsonSchema)

const good = {
  type: 'ship',
  location: [1, 2, 3],
  mass: 4,
  name: 'foo',
  crew: [
    {
      name: 'bar',
      age: 44,
      rank: 'captain',
      home: {
        type: 'planet',
        location: [5, 6, 7],
        mass: 8,
        population: 1000,
        habitable: true
      }
    }
  ]
}

const bad = {
  type: 'ship',
  location: [1, 2, 3],
  mass: 4,
  name: 'foo',
  crew: [
    {
      name: 'bar',
      age: 44,
      rank: 'captain',
      home: {
        type: 'planet',
        location: [5, 6],
        mass: 8,
        population: 'a',
        habitable: true
      }
    }
  ]
}

const ajv = new Ajv({ allErrors: true })
const validateJSON = ajv.compile(JUnion)

console.log((DUnion.decode(bad) as any).left)
console.log(validateJSON(bad))

suite
  .add('index (good)', function() {
    TUnion.decode(good)
  })
  .add('decoder (good)', function() {
    DUnion.decode(good)
  })
  .add('AJV (good)', function() {
    validateJSON(good)
  })
  .add('index (bad)', function() {
    TUnion.decode(bad)
  })
  .add('decoder (bad)', function() {
    DUnion.decode(bad)
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
// .run({ async: true })
