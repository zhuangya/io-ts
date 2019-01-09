import { Either, right, left } from 'fp-ts/lib/Either'
import { identity } from 'fp-ts/lib/function'

const getNameFromProps = (props: Props): string =>
  `{ ${Object.keys(props)
    .map(k => `${k}: ${props[k].name}`)
    .join(', ')} }`

const hasOwnProperty = Object.prototype.hasOwnProperty

const isEmpty = (o: { [key: string]: unknown }): boolean => {
  for (const _k in o) {
    return false
  }
  return true
}

export type DecodeError =
  | Leaf
  | LabeledProduct // suitable for product types indexed by labels
  | IndexedProduct // suitable for product types indexed by integers
  | And // suitable for intersection types
  | Or // suitable for union types

export interface Leaf {
  type: 'Leaf'
  actual: unknown
  expected: string
}

export interface LabeledProduct {
  type: 'LabeledProduct'
  actual: unknown
  expected: string
  errors: { [key: string]: DecodeError }
}

export interface IndexedProduct {
  type: 'IndexedProduct'
  actual: unknown
  expected: string
  errors: Array<[number, DecodeError]>
}

export interface And {
  type: 'And'
  expected: string
  errors: Array<DecodeError>
}

export interface Or {
  type: 'Or'
  expected: string
  errors: Array<DecodeError>
}

export const leaf = (actual: unknown, expected: string): DecodeError => ({
  type: 'Leaf',
  actual,
  expected
})

export const labeledProduct = (
  actual: unknown,
  expected: string,
  errors: { [key: string]: DecodeError }
): DecodeError => ({
  type: 'LabeledProduct',
  actual,
  expected,
  errors
})

export const indexedProduct = (
  actual: unknown,
  expected: string,
  errors: Array<[number, DecodeError]>
): DecodeError => ({
  type: 'IndexedProduct',
  actual,
  expected,
  errors
})

export const and = (expected: string, errors: Array<DecodeError>): DecodeError => ({
  type: 'And',
  expected,
  errors
})

export const or = (expected: string, errors: Array<DecodeError>): DecodeError => ({
  type: 'Or',
  expected,
  errors
})

export const success: <A>(u: A) => Either<DecodeError, A> = right

export const failure = <A>(u: unknown, expected: string): Either<DecodeError, A> => left(leaf(u, expected))

interface Decoder<I, A> {
  readonly decode: (i: I) => Either<DecodeError, A>
}

interface Encoder<A, O> {
  readonly encode: (a: A) => O
}

export class Type<A, O, I> implements Decoder<I, A>, Encoder<A, O> {
  readonly _A!: A
  readonly _O!: O
  readonly decode: (i: I) => Either<DecodeError, A>
  constructor(
    /** a unique name for this runtime type */
    readonly name: string,
    /** a custom type guard */
    readonly is: (u: unknown) => u is A,
    /** succeeds if a value of type `I` can be decoded to a value of type `A` */
    readonly validate: (i: I, context: string) => Either<DecodeError, A>,
    /** converts a value of type `A` to a value of type `O` */
    readonly encode: (a: A) => O
  ) {
    this.decode = u => validate(u, this.name)
  }
}

export interface Mixed extends Type<any, any, unknown> {}

export type TypeOf<T extends any> = T['_A']

export type OutputOf<T extends any> = T['_O']

export type InputOf<T extends any> = T['_I']

const isNull = (u: unknown): u is null => u === null

export class NullType extends Type<null, null, unknown> {
  readonly _tag: 'NullType' = 'NullType'
  constructor() {
    super('null', isNull, (u, c) => (isNull(u) ? right(u) : failure(u, c)), identity)
  }
}

const nullType: NullType = new NullType()

const isUndefined = (u: unknown): u is undefined => u === void 0

export class UndefinedType extends Type<undefined, undefined, unknown> {
  readonly _tag: 'UndefinedType' = 'UndefinedType'
  constructor() {
    super('undefined', isUndefined, (u, c) => (isUndefined(u) ? right(u) : failure(u, c)), identity)
  }
}

const undefinedType: UndefinedType = new UndefinedType()

const isString = (u: unknown): u is string => typeof u === 'string'

export class StringType extends Type<string, string, unknown> {
  readonly _tag: 'StringType' = 'StringType'
  constructor() {
    super('string', isString, (u, c) => (isString(u) ? right(u) : failure(u, c)), identity)
  }
}

export const string: StringType = new StringType()

const isNumber = (u: unknown): u is number => typeof u === 'number'

export class NumberType extends Type<number, number, unknown> {
  readonly _tag: 'NumberType' = 'NumberType'
  constructor() {
    super('number', isNumber, (u, c) => (isNumber(u) ? right(u) : failure(u, c)), identity)
  }
}

export const number: NumberType = new NumberType()

const isBoolean = (u: unknown): u is boolean => typeof u === 'boolean'

export class BooleanType extends Type<boolean, boolean, unknown> {
  readonly _tag: 'BooleanType' = 'BooleanType'
  constructor() {
    super('boolean', isBoolean, (u, c) => (isBoolean(u) ? right(u) : failure(u, c)), identity)
  }
}

export const boolean: BooleanType = new BooleanType()

export class UnknownType extends Type<unknown, unknown, unknown> {
  readonly _tag: 'UnknownType' = 'UnknownType'
  constructor() {
    super('unknown', (_): _ is unknown => true, right, identity)
  }
}

export const unknown: UnknownType = new UnknownType()

export class AnyArrayType extends Type<Array<unknown>, Array<unknown>, unknown> {
  readonly _tag: 'AnyArrayType' = 'AnyArrayType'
  constructor() {
    super('Array', Array.isArray, (u, c) => (Array.isArray(u) ? right(u) : failure(u, c)), identity)
  }
}

const arrayType: AnyArrayType = new AnyArrayType()

const isAnyDictionary = (u: unknown): u is Record<string, unknown> => u !== null && typeof u === 'object'

export class AnyDictionaryType extends Type<Record<string, unknown>, Record<string, unknown>, unknown> {
  readonly _tag: 'AnyDictionaryType' = 'AnyDictionaryType'
  constructor() {
    super('Dictionary', isAnyDictionary, (i, c) => (isAnyDictionary(i) ? right(i) : failure(i, c)), identity)
  }
}

export const Dictionary: AnyDictionaryType = new AnyDictionaryType()

export class LiteralType<V extends string | number | boolean> extends Type<V, V, unknown> {
  readonly _tag: 'LiteralType' = 'LiteralType'
  constructor(
    name: LiteralType<V>['name'],
    is: LiteralType<V>['is'],
    decode: LiteralType<V>['validate'],
    encode: LiteralType<V>['encode'],
    readonly value: V
  ) {
    super(name, is, decode, encode)
  }
}

export const literal = <V extends string | number | boolean>(
  value: V,
  name: string = JSON.stringify(value)
): LiteralType<V> => {
  const is = (u: unknown): u is V => u === value
  return new LiteralType(name, is, (u, c) => (is(u) ? right(value) : failure(u, c)), identity, value)
}

export class KeyofType<D> extends Type<keyof D, keyof D, unknown> {
  readonly _tag: 'KeyofType' = 'KeyofType'
  constructor(
    name: KeyofType<D>['name'],
    is: KeyofType<D>['is'],
    decode: KeyofType<D>['validate'],
    encode: KeyofType<D>['encode'],
    readonly keys: D
  ) {
    super(name, is, decode, encode)
  }
}

export const keyof = <D extends Record<string, unknown>>(
  keys: D,
  name: string = Object.keys(keys)
    .map(k => JSON.stringify(k))
    .join(' | ')
): KeyofType<D> => {
  const is = (u: unknown): u is keyof D => string.is(u) && hasOwnProperty.call(keys, u)
  return new KeyofType(name, is, (u, c) => (is(u) ? right(u) : failure(u, c)), identity, keys)
}

export class InterfaceType<P extends Props> extends Type<
  { [K in keyof P]: TypeOf<P[K]> },
  { [K in keyof P]: OutputOf<P[K]> },
  unknown
> {
  readonly _tag: 'InterfaceType' = 'InterfaceType'
  constructor(
    name: InterfaceType<P>['name'],
    is: InterfaceType<P>['is'],
    decode: InterfaceType<P>['validate'],
    encode: InterfaceType<P>['encode'],
    readonly props: P
  ) {
    super(name, is, decode, encode)
  }
}

export interface Props {
  [key: string]: Mixed
}

export const type = <P extends Props>(props: P, name: string = getNameFromProps(props)): InterfaceType<P> => {
  const keys = Object.keys(props)
  const types = keys.map(key => props[key])
  const len = keys.length
  return new InterfaceType(
    name,
    (u): u is { [K in keyof P]: TypeOf<P[K]> } => {
      if (!Dictionary.is(u)) {
        return false
      }
      for (let i = 0; i < len; i++) {
        const k = keys[i]
        if (!hasOwnProperty.call(u, k) || !types[i].is(u[k])) {
          return false
        }
      }
      return true
    },
    (u, c) => {
      const dictionaryResult = Dictionary.validate(u, c)
      if (dictionaryResult.isLeft()) {
        return dictionaryResult
      } else {
        const o = dictionaryResult.value
        let a: any = {}
        const errors: { [key: string]: DecodeError } = {}
        for (let i = 0; i < len; i++) {
          const k = keys[i]
          const result = types[i].decode(o[k])
          if (result.isLeft()) {
            errors[k] = result.value
          } else {
            a[k] = result.value
          }
        }
        return isEmpty(errors) ? right(a) : left(labeledProduct(u, c, errors))
      }
    },
    a => {
      const s: any = {}
      for (let i = 0; i < len; i++) {
        const k = keys[i]
        s[k] = types[i].encode(a[k])
      }
      return s
    },
    props
  )
}

export class PartialType<P extends Props> extends Type<
  { [K in keyof P]?: TypeOf<P[K]> },
  { [K in keyof P]?: OutputOf<P[K]> },
  unknown
> {
  readonly _tag: 'PartialType' = 'PartialType'
  constructor(
    name: PartialType<P>['name'],
    is: PartialType<P>['is'],
    decode: PartialType<P>['validate'],
    encode: PartialType<P>['encode'],
    readonly props: P
  ) {
    super(name, is, decode, encode)
  }
}

export const partial = <P extends Props>(
  props: P,
  name: string = `Partial<${getNameFromProps(props)}>`
): PartialType<P> => {
  const keys = Object.keys(props)
  const types = keys.map(key => props[key])
  const len = keys.length
  const partials: Props = {}
  for (let i = 0; i < len; i++) {
    partials[keys[i]] = union([undefinedType, types[i]])
  }
  return new PartialType(
    name,
    (u): u is { [K in keyof P]?: TypeOf<P[K]> } => {
      if (!Dictionary.is(u)) {
        return false
      }
      for (let i = 0; i < len; i++) {
        const k = keys[i]
        if (!partials[k].is(u[k])) {
          return false
        }
      }
      return true
    },
    (u, c) => {
      const dictionaryResult = Dictionary.validate(u, c)
      if (dictionaryResult.isLeft()) {
        return dictionaryResult
      } else {
        const o = dictionaryResult.value
        let a: any = {}
        const errors: { [key: string]: DecodeError } = {}
        for (let i = 0; i < len; i++) {
          const k = keys[i]
          const result = partials[k].decode(o[k])
          if (result.isLeft()) {
            errors[k] = result.value
          } else {
            const v = result.value
            if (v !== undefined || hasOwnProperty.call(o, k)) {
              a[k] = v
            }
          }
        }
        return isEmpty(errors) ? right(a) : left(labeledProduct(u, c, errors))
      }
    },
    a => {
      const s: { [key: string]: any } = {}
      for (let i = 0; i < len; i++) {
        const k = keys[i]
        const ak = a[k]
        if (ak !== undefined) {
          s[k] = types[i].encode(ak)
        } else if (hasOwnProperty.call(a, k)) {
          s[k] = undefined
        }
      }
      return s as any
    },
    props
  )
}

export class UnionType<TS extends [Mixed, Mixed, ...Array<Mixed>]> extends Type<
  TypeOf<TS[number]>,
  OutputOf<TS[number]>,
  unknown
> {
  readonly _tag: 'UnionType' = 'UnionType'
  constructor(
    name: UnionType<TS>['name'],
    is: UnionType<TS>['is'],
    decode: UnionType<TS>['validate'],
    encode: UnionType<TS>['encode'],
    readonly types: TS
  ) {
    super(name, is, decode, encode)
  }
}

interface Index extends Record<string, Array<[unknown, Mixed]>> {}

const isLiteralType = (type: Mixed): type is LiteralType<string | number | boolean> =>
  (type as any)._tag === 'LiteralType'

const isInterfaceType = (type: Mixed): type is InterfaceType<Props> => (type as any)._tag === 'InterfaceType'

const isIntersectionType = (type: Mixed): type is IntersectionType<[Mixed, Mixed, ...Array<Mixed>]> =>
  (type as any)._tag === 'IntersectionType'

const isUnionType = (type: Mixed): type is UnionType<[Mixed, Mixed, ...Array<Mixed>]> =>
  (type as any)._tag === 'UnionType'

/** @internal */
export const getTypeIndex = (type: Mixed, override: Mixed = type): Index => {
  let r: Index = {}
  if (isInterfaceType(type)) {
    for (let k in type.props) {
      const prop = type.props[k]
      if (isLiteralType(prop)) {
        const value = prop.value
        r[k] = [[value, override]]
      }
    }
  } else if (isIntersectionType(type)) {
    const types = type.types
    r = getTypeIndex(types[0], type)
    for (let i = 1; i < types.length; i++) {
      const ti = getTypeIndex(types[i], type)
      for (const k in ti) {
        if (r.hasOwnProperty(k)) {
          r[k].push(...ti[k])
        } else {
          r[k] = ti[k]
        }
      }
    }
  } else if (isUnionType(type)) {
    return getIndex(type.types)
  }
  return r
}

/** @internal */
export const getIndex = (types: Array<Mixed>): Index => {
  const r: Index = getTypeIndex(types[0])
  for (let i = 1; i < types.length; i++) {
    const ti = getTypeIndex(types[i])
    for (const k in r) {
      if (ti.hasOwnProperty(k)) {
        const ips = r[k]
        const tips = ti[k]
        loop: for (let j = 0; j < tips.length; j++) {
          const tip = tips[j]
          const ii = ips.findIndex(([v]) => v === tip[0])
          if (ii === -1) {
            ips.push(tip)
          } else if (tips[ii][1] !== ips[ii][1]) {
            delete r[k]
            break loop
          }
        }
      } else {
        delete r[k]
      }
    }
  }
  return r
}

const first = (index: Index): [string, Array<[unknown, Mixed]>] | undefined => {
  for (let k in index) {
    return [k, index[k]]
  }
  return undefined
}

export const union = <TS extends [Mixed, Mixed, ...Array<Mixed>]>(
  types: TS,
  name: string = `(${types.map(type => type.name).join(' | ')})`
): UnionType<TS> => {
  const len = types.length
  const index = first(getIndex(types))
  if (index) {
    const tag = index[0]
    const pairs = index[1]
    const tagName = pairs.map(([v]) => JSON.stringify(v)).join(' | ')
    const find = (tagValue: unknown) => pairs.find(([v]) => v === tagValue)
    return new UnionType(
      name,
      (u): u is TypeOf<TS[number]> => {
        if (!Dictionary.is(u)) {
          return false
        }
        const pair = find(u[tag])
        return pair ? pair[1].is(u) : false
      },
      (u, c) => {
        const dictionaryResult = Dictionary.validate(u, c)
        if (dictionaryResult.isLeft()) {
          return dictionaryResult
        } else {
          const d = dictionaryResult.value
          const tagValue = d[tag]
          const pair = find(tagValue)
          if (!pair) {
            return left(labeledProduct(u, c, { [tag]: leaf(tagValue, tagName) }))
          } else {
            const typeResult = pair[1].decode(d)
            if (typeResult.isLeft()) {
              return left(and(c, [typeResult.value]))
            } else {
              return success(typeResult.value)
            }
          }
        }
      },
      a => find(a[tag])![1].encode(a),
      types
    )
  } else {
    return new UnionType(
      name,
      (u): u is TypeOf<TS[number]> => types.some(type => type.is(u)),
      (u, c) => {
        const errors: Array<DecodeError> = []
        for (let i = 0; i < len; i++) {
          const type = types[i]
          const result = type.decode(u)
          if (result.isRight()) {
            return result
          } else {
            errors.push(result.value)
          }
        }
        return left(or(c, errors))
      },
      a => {
        let i = 0
        for (; i < len - 1; i++) {
          const type = types[i]
          if (type.is(a)) {
            return type.encode(a)
          }
        }
        return types[i].encode(a)
      },
      types
    )
  }
}

export class ArrayType<T extends Mixed> extends Type<Array<TypeOf<T>>, Array<OutputOf<T>>, unknown> {
  readonly _tag: 'ArrayType' = 'ArrayType'
  constructor(
    name: ArrayType<T>['name'],
    is: ArrayType<T>['is'],
    decode: ArrayType<T>['validate'],
    encode: ArrayType<T>['encode'],
    readonly type: T
  ) {
    super(name, is, decode, encode)
  }
}

export const array = <T extends Mixed>(type: T, name: string = `Array<${type.name}>`): ArrayType<T> => {
  return new ArrayType(
    name,
    (u): u is Array<TypeOf<T>> => arrayType.is(u) && u.every(type.is),
    (u, c) => {
      const arrayResult = arrayType.validate(u, c)
      if (arrayResult.isLeft()) {
        return arrayResult
      } else {
        const us = arrayResult.value
        const len = us.length
        let a: Array<TypeOf<T>> = us
        const errors: Array<[number, DecodeError]> = []
        for (let i = 0; i < len; i++) {
          const x = us[i]
          const result = type.decode(x)
          if (result.isLeft()) {
            errors.push([i, result.value])
          } else {
            const vx = result.value
            if (vx !== x) {
              if (a === us) {
                a = us.slice()
              }
              a[i] = vx
            }
          }
        }
        return errors.length === 0 ? right(a) : left(indexedProduct(u, c, errors))
      }
    },
    type.encode === identity ? identity : a => a.map(type.encode),
    type
  )
}

/**
 * @see https://stackoverflow.com/a/50375286#50375286
 */
type UnionToIntersection<U> = (U extends any ? (u: U) => void : never) extends ((u: infer I) => void) ? I : never

export class IntersectionType<TS extends [Mixed, Mixed, ...Array<Mixed>]> extends Type<
  UnionToIntersection<TypeOf<TS[number]>>,
  UnionToIntersection<OutputOf<TS[number]>>,
  unknown
> {
  readonly _tag: 'IntersectionType' = 'IntersectionType'
  constructor(
    name: IntersectionType<TS>['name'],
    is: IntersectionType<TS>['is'],
    decode: IntersectionType<TS>['validate'],
    encode: IntersectionType<TS>['encode'],
    readonly types: TS
  ) {
    super(name, is, decode, encode)
  }
}

const mergeAll = (us: Array<unknown>): any => {
  let r: unknown = us[0]
  for (let i = 1; i < us.length; i++) {
    const u = us[i]
    if (u !== r) {
      r = Object.assign(r, u)
    }
  }
  return r
}

export function intersection<TS extends [Mixed, Mixed, ...Array<Mixed>]>(
  types: TS,
  name: string = `(${types.map(type => type.name).join(' & ')})`
): IntersectionType<TS> {
  const len = types.length
  return new IntersectionType(
    name,
    (u): u is any => types.every(type => type.is(u)),
    (u, c) => {
      const us: Array<unknown> = []
      const errors: Array<DecodeError> = []
      for (let i = 0; i < len; i++) {
        const type = types[i]
        const result = type.decode(u)
        if (result.isLeft()) {
          errors.push(result.value)
        } else {
          us.push(result.value)
        }
      }
      return errors.length === 0 ? right(mergeAll(us)) : left(and(c, errors))
    },
    a => mergeAll(types.map(type => type.encode(a))),
    types
  )
}

export class TupleType<TS extends [Mixed, Mixed, ...Array<Mixed>]> extends Type<
  { [K in keyof TS]: TypeOf<TS[K]> },
  { [K in keyof TS]: OutputOf<TS[K]> },
  unknown
> {
  readonly _tag: 'TupleType' = 'TupleType'
  constructor(
    name: TupleType<TS>['name'],
    is: TupleType<TS>['is'],
    decode: TupleType<TS>['validate'],
    encode: TupleType<TS>['encode'],
    readonly types: TS
  ) {
    super(name, is, decode, encode)
  }
}

export function tuple<TS extends [Mixed, Mixed, ...Array<Mixed>]>(
  types: TS,
  name: string = `[${types.map(type => type.name).join(', ')}]`
): TupleType<TS> {
  const len = types.length
  return new TupleType(
    name,
    (u): u is any => arrayType.is(u) && u.length === len && types.every((type, i) => type.is(u[i])),
    (u, c) => {
      const arrayResult = arrayType.validate(u, c)
      if (arrayResult.isLeft()) {
        return arrayResult
      } else {
        const us = arrayResult.value
        let t: Array<any> = []
        const errors: Array<[number, DecodeError]> = []
        for (let i = 0; i < len; i++) {
          const a = us[i]
          const type = types[i]
          const result = type.decode(a)
          if (result.isLeft()) {
            errors.push([i, result.value])
          } else {
            t[i] = result.value
          }
        }
        return errors.length === 0 ? right(t as any) : left(indexedProduct(u, c, errors))
      }
    },
    a => types.map((type, i) => type.encode(a[i])) as any,
    types
  )
}

export class DictionaryType<D extends Mixed, C extends Mixed> extends Type<
  { [K in TypeOf<D>]: TypeOf<C> },
  { [K in OutputOf<D>]: OutputOf<C> },
  unknown
> {
  readonly _tag: 'DictionaryType' = 'DictionaryType'
  constructor(
    name: DictionaryType<D, C>['name'],
    is: DictionaryType<D, C>['is'],
    decode: DictionaryType<D, C>['validate'],
    encode: DictionaryType<D, C>['encode'],
    readonly domain: D,
    readonly codomain: C
  ) {
    super(name, is, decode, encode)
  }
}

const isUnknownType = (type: Mixed): type is UnknownType => (type as any)._tag === 'UnknownType'

const isObject = (r: Record<string, unknown>) => Object.prototype.toString.call(r) !== '[object Object]'

export const dictionary = <D extends Mixed, C extends Mixed>(
  domain: D,
  codomain: C,
  name: string = `{ [K in ${domain.name}]: ${codomain.name} }`
): DictionaryType<D, C> => {
  return new DictionaryType(
    name,
    (u): u is { [K in TypeOf<D>]: TypeOf<C> } => {
      if (!Dictionary.is(u)) {
        return false
      }
      if (!isUnknownType(codomain) && isObject(u)) {
        return false
      }
      return Object.keys(u).every(k => domain.is(k) && codomain.is(u[k]))
    },
    (u, c) => {
      const dictionaryResult = Dictionary.validate(u, c)
      if (dictionaryResult.isLeft()) {
        return dictionaryResult
      } else {
        const o = dictionaryResult.value
        if (!isUnknownType(codomain) && isObject(o)) {
          return failure(u, c)
        }
        const a: Record<string, unknown> = {}
        const errors: { [key: string]: DecodeError } = {}
        const keys = Object.keys(o)
        const len = keys.length
        let changed: boolean = false
        for (let i = 0; i < len; i++) {
          let k = keys[i]
          const ok = o[k]
          const domainResult = domain.decode(k)
          if (domainResult.isLeft()) {
            errors[k] = domainResult.value
          } else {
            const vk = domainResult.value
            changed = changed || vk !== k
            k = vk
            const codomainResult = codomain.decode(ok)
            if (codomainResult.isLeft()) {
              errors[k] = codomainResult.value
            } else {
              const vok = codomainResult.value
              changed = changed || vok !== ok
              a[k] = vok
            }
          }
        }
        return isEmpty(errors) ? right((changed ? a : o) as any) : left(labeledProduct(u, c, errors))
      }
    },
    domain.encode === identity && codomain.encode === identity
      ? identity
      : a => {
          const s: { [key: string]: any } = {}
          const keys = Object.keys(a)
          const len = keys.length
          for (let i = 0; i < len; i++) {
            const k = keys[i]
            s[domain.encode(k)] = codomain.encode((a as any)[k])
          }
          return s as any
        },
    domain,
    codomain
  )
}

export class LazyType<A, O> extends Type<A, O, unknown> {
  readonly _tag: 'LazyType' = 'LazyType'
  constructor(
    name: LazyType<A, O>['name'],
    is: LazyType<A, O>['is'],
    decode: LazyType<A, O>['validate'],
    encode: LazyType<A, O>['encode'],
    readonly definition: () => Type<A, O, unknown>
  ) {
    super(name, is, decode, encode)
  }
}

export const lazy = <A, O>(name: string, definition: () => Type<A, O, unknown>): LazyType<A, O> => {
  let cache: Type<A, O, unknown>
  const run = (): Type<A, O, unknown> => {
    if (!cache) {
      cache = definition()
      ;(cache as any).name = name
    }
    return cache
  }
  return new LazyType(name, (u): u is A => run().is(u), u => run().decode(u), a => run().encode(a), run)
}

export { undefinedType as undefined, type as interface, nullType as null, arrayType as Array, identity }
