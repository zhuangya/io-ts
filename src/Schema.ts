/**
 * @since 3.0.0
 */
import { Kind, URIS } from 'fp-ts/lib/HKT'
import * as S from './Schemable'
import * as DSL from './DSL'
import * as R from 'fp-ts/lib/Record'

/**
 * @since 3.0.0
 */
export interface Schema<A> {
  <S extends URIS>(S: S.Schemable<S> & S.WithUnion<S>): Kind<S, A>
}

/**
 * @since 3.0.0
 */
export function make<A>(f: Schema<A>): Schema<A> {
  return S.memoize(f)
}

/**
 * @since 3.0.0
 */
export function getTransformer(refs: Record<string, Schema<unknown>>): <A>(dsl: DSL.DSL<A>) => Schema<A> {
  function fromModel(model: DSL.Model): Schema<any> {
    switch (model._tag) {
      case '$ref':
        const ref = refs[model.id]
        // TODO handle undefined
        return ref
      case 'literal':
        return make(S => S.literal(model.value, model.id))
      case 'literals':
        return make(S => S.literals(model.values, model.id))
      case 'literalsOr':
        return make(S => S.literalsOr(model.values, fromModel(model.model)(S), model.id))
      case 'string':
        return make(S => S.string)
      case 'number':
        return make(S => S.number)
      case 'boolean':
        return make(S => S.boolean)
      case 'UnknownArray':
        return make(S => S.UnknownArray)
      case 'UnknownRecord':
        return make(S => S.UnknownRecord)
      case 'type':
        return make(S => S.type(R.record.map(model.properties, model => fromModel(model)(S))))
      case 'partial':
        return make(S => S.partial(R.record.map(model.properties, model => fromModel(model)(S))))
      case 'record':
        return make(S => S.record(fromModel(model.codomain)(S)))
      case 'array':
        return make(S => S.array(fromModel(model.items)(S)))
      case 'tuple2':
        return make(S => S.tuple2(fromModel(model.items[0])(S), fromModel(model.items[1])(S)))
      case 'tuple3':
        return make(S =>
          S.tuple3(fromModel(model.items[0])(S), fromModel(model.items[1])(S), fromModel(model.items[2])(S))
        )
      case 'intersection':
        return make(S => S.intersection(fromModel(model.models[0])(S), fromModel(model.models[1])(S)))
      case 'sum':
        return make(S => S.sum(model.tag)(R.record.map(model.models, model => fromModel(model)(S))))
      case 'lazy':
        const schema = make(S => {
          return S.lazy(model.id, () => {
            refs[model.id] = schema
            return fromModel(model.model)(S)
          })
        })
        return schema
      case 'union':
        return make(S => S.union(model.models.map(model => fromModel(model)(S)) as any))
    }
  }
  return dsl => fromModel(dsl.dsl())
}
