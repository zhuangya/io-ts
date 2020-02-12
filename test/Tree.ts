import * as assert from 'assert'
import * as T from '../src/Tree'
import * as D from '../src/Decoder'
import * as E from 'fp-ts/lib/Either'
import * as DE from '../src/DecodeError'

function assertTree<A>(e: E.Either<DE.DecodeError, A>, expected: string): void {
  assert.deepStrictEqual((T.mapLeft(e) as any).left, expected)
}

describe('Tree', () => {
  it('literals', () => {
    const decoder = D.literals(['a', 1])
    assertTree(decoder.decode(null), 'Cannot decode null, expected "a" | 1')
  })

  it('literalsOr', () => {
    const decoder = D.literalsOr(['a', 1], D.type({ a: D.string, b: D.number }))
    assertTree(
      decoder.decode(null),
      `Cannot decode null, all the following conditions are not met
├─ Cannot decode null, expected "a" | 1
└─ Cannot decode null, expected Record<string, unknown>`
    )
  })

  it('string', () => {
    const decoder = D.string
    assertTree(decoder.decode(null), 'Cannot decode null, expected string')
  })

  it('number', () => {
    const decoder = D.number
    assertTree(decoder.decode(null), 'Cannot decode null, expected number')
  })

  it('boolean', () => {
    const decoder = D.boolean
    assertTree(decoder.decode(null), 'Cannot decode null, expected boolean')
  })

  it('UnknownArray', () => {
    const decoder = D.UnknownArray
    assertTree(decoder.decode(null), 'Cannot decode null, expected Array<unknown>')
  })

  it('UnknownRecord', () => {
    const decoder = D.UnknownRecord
    assertTree(decoder.decode(null), 'Cannot decode null, expected Record<string, unknown>')
  })

  it('type', () => {
    const decoder = D.type({ a: D.string, b: D.number })
    assertTree(
      decoder.decode({}),
      `Cannot decode {}
├─ ("a") Cannot decode undefined, expected string
└─ ("b") Cannot decode undefined, expected number`
    )
  })

  it('partial', () => {
    const decoder = D.partial({ a: D.string, b: D.number })
    assertTree(
      decoder.decode({ a: 1, b: 'b' }),
      `Cannot decode {"a":1,"b":"b"}
├─ ("a") Cannot decode 1, expected string
└─ ("b") Cannot decode "b", expected number`
    )
  })

  it('record', () => {
    const decoder = D.record(D.number)
    assertTree(
      decoder.decode({ a: 'a' }),
      `Cannot decode {"a":"a"}
└─ ("a") Cannot decode "a", expected number`
    )
  })

  it('array', () => {
    const decoder = D.array(D.number)
    assertTree(
      decoder.decode(['a']),
      `Cannot decode ["a"]
└─ (0) Cannot decode "a", expected number`
    )
  })

  it('tuple', () => {
    const decoder = D.tuple(D.string, D.number)
    assertTree(
      decoder.decode(['a', 'b']),
      `Cannot decode ["a","b"]
└─ (1) Cannot decode "b", expected number`
    )
  })

  it('intersection', () => {
    const decoder = D.intersection(D.type({ a: D.string }), D.type({ b: D.number }))
    assertTree(
      decoder.decode({}),
      `Cannot decode {}, some of the following conditions are not met
├─ Cannot decode {}
│  └─ ("a") Cannot decode undefined, expected string
└─ Cannot decode {}
   └─ ("b") Cannot decode undefined, expected number`
    )
  })

  it('sum', () => {
    const decoder = D.sum('_tag')({
      A: D.type({ _tag: D.literals(['A']), a: D.string }),
      B: D.type({ _tag: D.literals(['B']), b: D.number })
    })
    assertTree(
      decoder.decode({}),
      `Cannot decode {}
└─ ("_tag") "A" | "B"`
    )
    assertTree(
      decoder.decode({ _tag: 'A' }),
      `Cannot decode {"_tag":"A"}
└─ ("a") Cannot decode undefined, expected string`
    )
  })

  it('union', () => {
    const decoder = D.union([D.string, D.number, D.boolean])
    assertTree(
      decoder.decode(null),
      `Cannot decode null, all the following conditions are not met
├─ Cannot decode null, expected string
├─ Cannot decode null, expected number
└─ Cannot decode null, expected boolean`
    )
  })

  it('lazy', () => {
    interface A {
      a: number
      b: null | A
    }

    const decoder: D.Decoder<A> = D.lazy('A', () =>
      D.type({
        a: D.number,
        b: D.literalsOr([null], decoder)
      })
    )

    assertTree(
      decoder.decode({ a: 1, b: {} }),
      `Cannot decode {"a":1,"b":{}}, expected A
└─ ("b") Cannot decode {}, all the following conditions are not met
   ├─ Cannot decode {}, expected null
   └─ Cannot decode {}, expected A
      ├─ ("a") Cannot decode undefined, expected number
      └─ ("b") Cannot decode undefined, all the following conditions are not met
         ├─ Cannot decode undefined, expected null
         └─ Cannot decode undefined, expected A`
    )
  })
})
