import * as assert from 'assert'
import * as t from '../src'
import { PathReporter } from '../src/PathReporter'

describe('PathReporter', () => {
  it('should say something when there are no errors', () => {
    assert.deepEqual(PathReporter.report(t.number.decode(1)), [])
  })
})
