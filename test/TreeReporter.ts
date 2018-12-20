import * as assert from 'assert'
import * as t from '../src'
import { TreeReporter } from '../src/TreeReporter'

describe('TreeReporter', () => {
  it('should output a tree', () => {
    const Person = t.type(
      {
        name: t.type({
          firstName: t.string,
          lastName: t.string
        }),
        age: t.union([t.number, t.undefined]),
        bio: t.intersection([t.string, t.string]),
        stats: t.tuple([t.number, t.number])
      },
      'Person'
    )
    assert.strictEqual(
      TreeReporter.report(
        Person.decode({ name: { firstName: 'firstName', lastName: 'lastName' }, age: 0, bio: 'bio', stats: [178, 70] })
      ),
      'No errors!'
    )
    assert.strictEqual(
      TreeReporter.report(Person.decode({ name: {}, age: 'foo', stats: [178] })),
      `Expected Person, but was {
  "name": {},
  "age": "foo",
  "stats": [
    178
  ]
}
├─ Invalid key "name"
│  └─ Invalid { firstName: string, lastName: string }
│     ├─ Invalid key "firstName"
│     │  └─ Expected string, but was undefined
│     └─ Invalid key "lastName"
│        └─ Expected string, but was undefined
├─ Invalid key "age"
│  └─ Invalid (number | undefined)
│     ├─ Expected number, but was "foo"
│     └─ Expected undefined, but was "foo"
├─ Invalid key "bio"
│  └─ Invalid (string & string)
│     ├─ Expected string, but was undefined
│     └─ Expected string, but was undefined
└─ Invalid key "stats"
   └─ Invalid [number, number]
      └─ Invalid key 1
         └─ Expected number, but was undefined`
    )
  })
})
