// import * as Benchmark from 'benchmark'
// import * as t from '../../src'
// import * as D from '../../src/Decoder'
// import { range } from 'fp-ts/lib/Array'

// const suite = new Benchmark.Suite()

// const getT = <T extends string>(type: T) =>
//   t.strict({
//     type: t.literal(type),
//     a: t.string
//   })

// const getD = <T extends string>(type: T) =>
//   D.type({
//     type: D.literal(type),
//     a: D.string
//   })

// const getInputT = (n: number) => range(1, n).map(n => getT(`T${n}`))

// const getInputD = (n: number) => range(1, n).map(n => getD(`T${n}`))

// const TUnion = t.union(getInputT(100) as any)

// const DUnion = D.union(getInputD(100) as any)

// const good = {
//   type: 'F',
//   a: 'a'
// }

// const bad = {
//   type: 'F',
//   a: 1
// }

// suite
//   .add('TUnion (good)', function() {
//     TUnion.decode(good)
//   })
//   .add('DUnion (good)', function() {
//     DUnion.decode(good)
//   })
//   .add('TUnion (bad)', function() {
//     TUnion.decode(bad)
//   })
//   .add('DUnion (bad)', function() {
//     DUnion.decode(bad)
//   })
//   .on('cycle', function(event: any) {
//     console.log(String(event.target))
//   })
//   .on('complete', function(this: any) {
//     console.log('Fastest is ' + this.filter('fastest').map('name'))
//   })
//   .run({ async: true })
