import * as assert from 'assert'
import * as t from '../src/index'
import { PathReporter } from '../src/PathReporter'
import { Either, right, left } from 'fp-ts/lib/Either'

export function assertSuccess<T>(result: Either<t.DecodeError, T>, expected?: T): void {
  if (result.isRight()) {
    if (expected !== undefined) {
      assert.deepEqual(result.value, expected)
    }
  } else {
    throw new Error(`${result} is not a right`)
  }
}

export function assertStrictSuccess<T>(result: Either<t.DecodeError, T>, expected: T): void {
  if (result.isRight()) {
    if (expected !== undefined) {
      assert.strictEqual(result.value, expected)
    }
  } else {
    throw new Error(`${result} is not a right`)
  }
}

export function assertFailure<T>(result: Either<t.DecodeError, T>, errors: Array<string>): void {
  if (result.isLeft()) {
    assert.deepEqual(PathReporter.report(result), errors)
  } else {
    throw new Error(`${result} is not a left`)
  }
}

class NumberFromStringType extends t.Type<number, string, unknown> {
  readonly _tag: 'NumberFromStringType' = 'NumberFromStringType'
  constructor() {
    super(
      'NumberFromString',
      t.number.is,
      (u, c) =>
        t.string.validate(u, c).chain(s => {
          const n = +s
          return isNaN(n) ? t.failure(u, c) : t.success(n)
        }),
      String
    )
  }
}

export const NumberFromString = new NumberFromStringType()

export const HyphenatedString = new t.Type<string, string, unknown>(
  'HyphenatedString',
  (v): v is string => t.string.is(v) && v.length === 3 && v[1] === '-',
  u => {
    const stringResult = t.string.decode(u)
    if (stringResult.isLeft()) {
      return left(t.leaf(u, 'HyphenatedString'))
    } else {
      const s = stringResult.value
      if (s.length === 2) {
        return right(s[0] + '-' + s[1])
      } else {
        return left(t.leaf(u, 'HyphenatedString'))
      }
    }
  },
  a => a[0] + a[2]
)

// export function withDefault<T extends t.Mixed>(
//   type: T,
//   defaultValue: t.TypeOf<T>
// ): t.Type<t.TypeOf<T>, t.TypeOf<T>, unknown> {
//   return new t.Type(
//     `withDefault(${type.name}, ${JSON.stringify(defaultValue)})`,
//     type.is,
//     v => type.decode(v != null ? v : defaultValue),
//     type.encode
//   )
// }
