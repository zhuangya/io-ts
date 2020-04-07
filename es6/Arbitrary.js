var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * @since 3.0.0
 */
import * as fc from 'fast-check';
import * as S from './Schemable';
import { intersect } from './Decoder';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export function literal() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return fc.oneof.apply(fc, values.map(function (v) { return fc.constant(v); }));
}
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var string = fc.oneof(fc.string(), fc.asciiString(), fc.fullUnicodeString(), fc.hexaString(), fc.lorem());
/**
 * @since 3.0.0
 */
export var number = fc.oneof(fc.float(), fc.double(), fc.integer());
/**
 * @since 3.0.0
 */
export var boolean = fc.boolean();
/**
 * @since 3.0.0
 */
export var UnknownArray = fc.array(fc.anything());
/**
 * @since 3.0.0
 */
export var UnknownRecord = fc.dictionary(string, fc.anything());
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export function nullable(or) {
    return fc.oneof(fc.constant(null), or);
}
/**
 * @since 3.0.0
 */
export function type(properties) {
    return fc.record(properties);
}
/**
 * @since 3.0.0
 */
export function partial(properties) {
    var keys = fc.oneof.apply(fc, Object.keys(properties).map(function (p) { return fc.constant(p); }));
    return keys.chain(function (key) {
        var p = __assign({}, properties);
        delete p[key];
        return fc.record(p);
    });
}
/**
 * @since 3.0.0
 */
export function record(codomain) {
    return fc.dictionary(string, codomain);
}
/**
 * @since 3.0.0
 */
export function array(items) {
    return fc.array(items);
}
/**
 * @since 3.0.0
 */
export function tuple() {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    if (components.length === 0) {
        return fc.constant([]);
    }
    return fc.tuple.apply(fc, components);
}
/**
 * @since 3.0.0
 */
export function intersection(left, right) {
    return fc.tuple(left, right).map(function (_a) {
        var a = _a[0], b = _a[1];
        return intersect(a, b);
    });
}
/**
 * @since 3.0.0
 */
export function sum(_tag) {
    return function (members) { return fc.oneof.apply(fc, Object.keys(members).map(function (k) { return members[k]; })); };
}
/**
 * @since 3.0.0
 */
export function lazy(f) {
    var get = S.memoize(f);
    return fc.constant(null).chain(function () { return get(); });
}
/**
 * @since 3.0.0
 */
export function union() {
    var members = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        members[_i] = arguments[_i];
    }
    return fc.oneof.apply(fc, members);
}
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var URI = 'Arbitrary';
/**
 * @since 3.0.0
 */
export var arbitrary = {
    URI: URI,
    literal: literal,
    string: string,
    number: number,
    boolean: boolean,
    UnknownArray: UnknownArray,
    UnknownRecord: UnknownRecord,
    nullable: nullable,
    type: type,
    partial: partial,
    record: record,
    array: array,
    tuple: tuple,
    intersection: intersection,
    sum: sum,
    lazy: function (_, f) { return lazy(f); },
    union: union
};
