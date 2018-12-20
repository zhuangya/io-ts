import * as assert from 'assert'
import * as t from '../src/index'
import { assertSuccess, assertFailure } from './helpers'

describe('Dictionary', () => {
  it('should succeed decoding a valid value', () => {
    const T = t.Dictionary
    assertSuccess(T.decode({}))
    assertSuccess(T.decode([]))
    assertSuccess(T.decode([1]))
    assertSuccess(T.decode(new Number()))
    assertSuccess(T.decode(new Date()))
  })

  it('should fail decoding an invalid value', () => {
    const T = t.Dictionary
    assertFailure(T.decode('s'), ['Invalid value "s" supplied to Dictionary'])
    assertFailure(T.decode(1), ['Invalid value 1 supplied to Dictionary'])
    assertFailure(T.decode(true), ['Invalid value true supplied to Dictionary'])
    assertFailure(T.decode(null), ['Invalid value null supplied to Dictionary'])
    assertFailure(T.decode(undefined), ['Invalid value undefined supplied to Dictionary'])
  })
})

describe('Array', () => {
  it('should succeed decoding a valid value', () => {
    const T = t.Array
    assertSuccess(T.decode([]))
    assertSuccess(T.decode([1]))
  })

  it('should fail decoding an invalid value', () => {
    const T = t.Array
    assertFailure(T.decode('s'), ['Invalid value "s" supplied to Array'])
    assertFailure(T.decode(1), ['Invalid value 1 supplied to Array'])
    assertFailure(T.decode(true), ['Invalid value true supplied to Array'])
    assertFailure(T.decode(null), ['Invalid value null supplied to Array'])
    assertFailure(T.decode(undefined), ['Invalid value undefined supplied to Array'])
  })
})

describe('null', () => {
  it('should succeed decoding a valid value', () => {
    assertSuccess(t.null.decode(null))
  })
  it('should fail decoding an invalid value', () => {
    assertFailure(t.null.decode(1), ['Invalid value 1 supplied to null'])
  })
})

describe('undefined', () => {
  it('should succeed decoding a valid value', () => {
    assertSuccess(t.undefined.decode(undefined))
  })
  it('should fail decoding an invalid value', () => {
    assertFailure(t.undefined.decode(1), ['Invalid value 1 supplied to undefined'])
  })
})

describe('unknown', () => {
  it('should decode any value', () => {
    assertSuccess(t.unknown.decode(null))
    assertSuccess(t.unknown.decode(undefined))
    assertSuccess(t.unknown.decode('foo'))
    assertSuccess(t.unknown.decode(1))
    assertSuccess(t.unknown.decode(true))
    assertSuccess(t.unknown.decode({}))
    assertSuccess(t.unknown.decode([]))
    assertSuccess(t.unknown.decode(/a/))
  })

  it('should accept any value', () => {
    assert.ok(t.unknown.is(null))
    assert.ok(t.unknown.is(undefined))
    assert.ok(t.unknown.is('foo'))
    assert.ok(t.unknown.is(1))
    assert.ok(t.unknown.is(true))
    assert.ok(t.unknown.is({}))
    assert.ok(t.unknown.is([]))
    assert.ok(t.unknown.is(/a/))
  })
})

describe('boolean', () => {
  it('should decode boolean values', () => {
    assertSuccess(t.boolean.decode(true))
    assertSuccess(t.boolean.decode(false))
  })

  it('should not decode non-boolean values', () => {
    assertFailure(t.boolean.decode(1), ['Invalid value 1 supplied to boolean'])
  })
})

describe('Type', () => {
  describe('decode', () => {
    it('may be used as a static function', () => {
      const Person = t.type(
        {
          name: t.string,
          age: t.number
        },
        'Person'
      )
      const decode = Person.decode
      assertSuccess(decode({ name: 'name', age: 0 }))
      assertFailure(decode(null), ['Invalid value null supplied to Person'])
    })
  })
})
