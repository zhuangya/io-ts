"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @since 3.0.0
 */
var fc = require("fast-check");
var S = require("./Schemable");
var util_1 = require("./util");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
function literal() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return fc.oneof.apply(fc, values.map(function (v) { return fc.constant(v); }));
}
exports.literal = literal;
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
exports.string = fc.oneof(fc.string(), fc.asciiString(), fc.fullUnicodeString(), fc.hexaString(), fc.lorem());
/**
 * @since 3.0.0
 */
exports.number = fc.oneof(fc.float(), fc.double(), fc.integer());
/**
 * @since 3.0.0
 */
exports.boolean = fc.boolean();
/**
 * @since 3.0.0
 */
exports.UnknownArray = fc.array(fc.anything());
/**
 * @since 3.0.0
 */
exports.UnknownRecord = fc.dictionary(exports.string, fc.anything());
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
function nullable(or) {
    return fc.oneof(fc.constant(null), or);
}
exports.nullable = nullable;
/**
 * @since 3.0.0
 */
function type(properties) {
    return fc.record(properties);
}
exports.type = type;
/**
 * @since 3.0.0
 */
function partial(properties) {
    var keys = fc.oneof.apply(fc, Object.keys(properties).map(function (p) { return fc.constant(p); }));
    return keys.chain(function (key) {
        var p = __assign({}, properties);
        delete p[key];
        return fc.record(p);
    });
}
exports.partial = partial;
/**
 * @since 3.0.0
 */
function record(codomain) {
    return fc.dictionary(exports.string, codomain);
}
exports.record = record;
/**
 * @since 3.0.0
 */
function array(items) {
    return fc.array(items);
}
exports.array = array;
/**
 * @since 3.0.0
 */
function tuple() {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    if (components.length === 0) {
        return fc.constant([]);
    }
    return fc.tuple.apply(fc, components);
}
exports.tuple = tuple;
/**
 * @since 3.0.0
 */
function intersection(left, right) {
    return fc.tuple(left, right).map(function (_a) {
        var a = _a[0], b = _a[1];
        return util_1.intersect(a, b);
    });
}
exports.intersection = intersection;
/**
 * @since 3.0.0
 */
function sum(_tag) {
    return function (members) { return fc.oneof.apply(fc, Object.keys(members).map(function (k) { return members[k]; })); };
}
exports.sum = sum;
/**
 * @since 3.0.0
 */
function lazy(f) {
    var get = S.memoize(f);
    return fc.constant(null).chain(function () { return get(); });
}
exports.lazy = lazy;
/**
 * @since 3.0.0
 */
function union() {
    var members = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        members[_i] = arguments[_i];
    }
    return fc.oneof.apply(fc, members);
}
exports.union = union;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
exports.URI = 'Arbitrary';
/**
 * @since 3.0.0
 */
exports.arbitrary = {
    URI: exports.URI,
    literal: literal,
    string: exports.string,
    number: exports.number,
    boolean: exports.boolean,
    UnknownArray: exports.UnknownArray,
    UnknownRecord: exports.UnknownRecord,
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
