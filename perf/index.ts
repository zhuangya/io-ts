import * as Benchmark from 'benchmark'
import * as t from '../src'
import * as D from '../src/Decoder'
import * as Ajv from 'ajv'
import * as J from '../src/JsonSchema'

const suite = new Benchmark.Suite()

const TVector = t.tuple([t.number, t.number, t.number])
const DVector = D.tuple([D.number, D.number, D.number])
const JVector = J.tuple([J.number, J.number, J.number])

const TAsteroid = t.type({
  type: t.literal('asteroid'),
  location: TVector,
  mass: t.number
})
const DAsteroid = D.type({
  type: D.literals(['asteroid']),
  location: DVector,
  mass: D.number
})
const JAsteroid = J.type({
  type: J.literals(['asteroid']),
  location: JVector,
  mass: J.number
})

const TPlanet = t.type({
  type: t.literal('planet'),
  location: TVector,
  mass: t.number,
  population: t.number,
  habitable: t.boolean
})
const DPlanet = D.type({
  type: D.literals(['planet']),
  location: DVector,
  mass: D.number,
  population: D.number,
  habitable: D.boolean
})
const JPlanet = J.type({
  type: J.literals(['planet']),
  location: JVector,
  mass: J.number,
  population: J.number,
  habitable: J.boolean
})

const TRank = t.keyof({
  captain: null,
  'first mate': null,
  officer: null,
  ensign: null
})
const DRank = D.literals(['captain', 'first mate', 'officer', 'ensign'])
const JRank = J.literals(['captain', 'first mate', 'officer', 'ensign'])

const TCrewMember = t.type({
  name: t.string,
  age: t.number,
  rank: TRank,
  home: TPlanet
})
const DCrewMember = D.type({
  name: D.string,
  age: D.number,
  rank: DRank,
  home: DPlanet
})
const JCrewMember = J.type({
  name: J.string,
  age: J.number,
  rank: JRank,
  home: JPlanet
})

const TShip = t.type({
  type: t.literal('ship'),
  location: TVector,
  mass: t.number,
  name: t.string,
  crew: t.array(TCrewMember)
})
const DShip = D.type({
  type: D.literals(['ship']),
  location: DVector,
  mass: D.number,
  name: D.string,
  crew: D.array(DCrewMember)
})
const JShip = J.type({
  type: J.literals(['ship']),
  location: JVector,
  mass: J.number,
  name: J.string,
  crew: J.array(JCrewMember)
})

const TUnion = t.union([TAsteroid, TPlanet, TShip])
const DUnion = D.sum('type')({
  asteroid: DAsteroid,
  planet: DPlanet,
  ship: DShip
})
const JUnion = J.sum('type')({
  asteroid: JAsteroid,
  planet: JPlanet,
  ship: JShip
})

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
  .add('TUnion (good)', function() {
    TUnion.decode(good)
  })
  .add('DUnion (good)', function() {
    DUnion.decode(good)
  })
  .add('JUnion (good)', function() {
    run(JUnion, good)
  })
  .add('TUnion (bad)', function() {
    TUnion.decode(bad)
  })
  .add('DUnion (bad)', function() {
    DUnion.decode(bad)
  })
  .add('JUnion (bad)', function() {
    run(JUnion, bad)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
