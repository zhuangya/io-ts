/**
 * Missing
 *   - `pipe` method
 *   - `null` primitive
 *   - `undefined` primitive
 *   - `void` primitive
 *   - `unknown` primitive
 * @since 3.0.0
 */
import * as C from './Codec';
import * as D from './Decoder';
import * as G from './Guard';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export function make(codec, guard) {
    return {
        is: guard.is,
        decode: codec.decode,
        encode: codec.encode
    };
}
/**
 * @since 3.0.0
 */
export function literal() {
    var _a, _b;
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return make((_a = C.codec).literal.apply(_a, values), (_b = G.guard).literal.apply(_b, values));
}
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var string = make(C.codec.string, G.guard.string);
/**
 * @since 3.0.0
 */
export var number = make(C.codec.number, G.guard.number);
/**
 * @since 3.0.0
 */
export var boolean = make(C.codec.boolean, G.guard.boolean);
/**
 * @since 3.0.0
 */
export var UnknownArray = make(C.codec.UnknownArray, G.guard.UnknownArray);
/**
 * @since 3.0.0
 */
export var UnknownRecord = make(C.codec.UnknownRecord, G.guard.UnknownRecord);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export function refinement(from, refinement, expected) {
    return make(C.refinement(from, refinement, expected), G.refinement(from, refinement));
}
/**
 * @since 3.0.0
 */
export function nullable(or) {
    return make(C.codec.nullable(or), G.guard.nullable(or));
}
/**
 * @since 3.0.0
 */
export function type(properties) {
    return make(C.codec.type(properties), G.guard.type(properties));
}
/**
 * @since 3.0.0
 */
export function partial(properties) {
    return make(C.codec.partial(properties), G.guard.partial(properties));
}
/**
 * @since 3.0.0
 */
export function record(codomain) {
    return make(C.codec.record(codomain), G.guard.record(codomain));
}
/**
 * @since 3.0.0
 */
export function array(items) {
    return make(C.codec.array(items), G.guard.array(items));
}
/**
 * @since 3.0.0
 */
export function tuple() {
    var _a, _b;
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return make((_a = C.codec).tuple.apply(_a, components), (_b = G.guard).tuple.apply(_b, components));
}
/**
 * @since 3.0.0
 */
export function intersection(left, right) {
    return make(C.codec.intersection(left, right), G.guard.intersection(left, right));
}
/**
 * @since 3.0.0
 */
export function union() {
    var _a, _b;
    var members = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        members[_i] = arguments[_i];
    }
    return {
        is: (_a = G.guard).union.apply(_a, members).is,
        decode: (_b = D.decoder).union.apply(_b, members).decode,
        encode: function (a) {
            for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
                var member = members_1[_i];
                if (member.is(a)) {
                    return member.encode(a);
                }
            }
        }
    };
}
/**
 * @since 3.0.0
 */
export function sum(tag) {
    var sumC = C.codec.sum(tag);
    var sumG = G.guard.sum(tag);
    return function (members) { return make(sumC(members), sumG(members)); };
}
/**
 * @since 3.0.0
 */
export function lazy(id, f) {
    return make(C.codec.lazy(id, f), G.guard.lazy(id, f));
}
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var URI = 'Compat';
/**
 * @since 3.0.0
 */
export var compat = {
    URI: URI,
    literal: literal,
    string: string,
    number: number,
    boolean: boolean,
    UnknownArray: UnknownArray,
    UnknownRecord: UnknownRecord,
    type: type,
    nullable: nullable,
    partial: partial,
    record: record,
    array: array,
    tuple: tuple,
    intersection: intersection,
    sum: sum,
    lazy: lazy,
    union: union
};
