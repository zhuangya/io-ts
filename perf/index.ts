import * as Ajv from 'ajv'
import * as Benchmark from 'benchmark'
import { Kind, URIS } from 'fp-ts/lib/HKT'
import * as t from '../src'
import * as D from '../src/Decoder'
import * as J from '../src/JsonSchema'
import * as S from '../src/Schemable'

/*
index (good) x 425,596 ops/sec ±0.50% (88 runs sampled)
decoder (good) x 692,827 ops/sec ±0.75% (85 runs sampled)
AJV (good) x 10,998 ops/sec ±1.67% (84 runs sampled)
index (bad) x 374,653 ops/sec ±2.27% (85 runs sampled)
decoder (bad) x 571,560 ops/sec ±2.67% (90 runs sampled)
AJV (bad) x 10,885 ops/sec ±2.24% (86 runs sampled)
Fastest is decoder (good)
*/

const suite = new Benchmark.Suite()

interface Schema<A> {
  <S extends URIS>(S: S.Schemable<S>): Kind<S, A>
}

function make<A>(f: Schema<A>): Schema<A> {
  return f
}

const TVector = t.tuple([t.number, t.number, t.number])
const Vector = make(S => S.tuple([S.number, S.number, S.number]))

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
        location: [5, 6, 7],
        mass: 8,
        population: 'a',
        habitable: true
      }
    }
  ]
}

const ajv = new Ajv()

function run<A>(jsonSchema: object, a: A): boolean {
  return ajv.compile(jsonSchema)(a) as any
}

suite
  .add('index (good)', function() {
    TUnion.decode(good)
  })
  .add('decoder (good)', function() {
    DUnion.decode(good)
  })
  .add('AJV (good)', function() {
    run(JUnion, good)
  })
  .add('index (bad)', function() {
    TUnion.decode(bad)
  })
  .add('decoder (bad)', function() {
    DUnion.decode(bad)
  })
  .add('AJV (bad)', function() {
    run(JUnion, bad)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
