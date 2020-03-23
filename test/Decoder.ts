import * as assert from 'assert'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/lib/Tree'
import * as D from '../src/Decoder'

describe('Decoder', () => {
  describe('decoder', () => {
    it('map', () => {
      const decoder = pipe(
        D.string,
        D.map(s => s.length)
      )
      assert.deepStrictEqual(decoder.decode('aaa'), E.right(3))
    })

    it('of', () => {
      const decoder = D.decoder.of(1)
      assert.deepStrictEqual(decoder.decode(1), E.right(1))
      assert.deepStrictEqual(decoder.decode('a'), E.right(1))
    })

    it('ap', () => {
      const fab = D.decoder.of((s: string): number => s.length)
      const fa = D.string
      assert.deepStrictEqual(pipe(fab, D.ap(fa)).decode('aaa'), E.right(3))
    })

    it('alt', () => {
      const decoder = pipe(
        D.string,
        D.alt(() => pipe(D.number, D.map(String)))
      )
      assert.deepStrictEqual(decoder.decode('a'), E.right('a'))
      assert.deepStrictEqual(decoder.decode(1), E.right('1'))
    })

    it('zero', () => {
      const decoder = D.decoder.zero()
      assert.deepStrictEqual(decoder.decode(null), E.left([T.make('cannot decode null, should be never')]))
    })
  })

  describe('union', () => {
    it('should decode a valid input', () => {
      assert.deepStrictEqual(D.union(D.string).decode('a'), E.right('a'))
      const decoder = D.union(D.string, D.number)
      assert.deepStrictEqual(decoder.decode('a'), E.right('a'))
      assert.deepStrictEqual(decoder.decode(1), E.right(1))
    })

    it('should reject an invalid input', () => {
      const decoder = D.union(D.string, D.number)
      assert.deepStrictEqual(
        decoder.decode(true),
        E.left([
          T.make('member 0', [T.make('cannot decode true, should be string')]),
          T.make('member 1', [T.make('cannot decode true, should be number')])
        ])
      )
    })

    it('should handle zero members', () => {
      assert.deepStrictEqual(D.union().decode({}), E.left([T.make('cannot decode {}, should be never')]))
    })
  })
})
