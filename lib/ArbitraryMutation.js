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
var Array_1 = require("fp-ts/lib/Array");
var function_1 = require("fp-ts/lib/function");
var A = require("./Arbitrary");
var G = require("./Guard");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
function make(mutation, arbitrary) {
    return { mutation: mutation, arbitrary: arbitrary };
}
exports.make = make;
var literalsArbitrary = A.union(A.string, A.number, A.boolean, fc.constant(null));
/**
 * @since 3.0.0
 */
function literal() {
    var _a, _b;
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return make(literalsArbitrary.filter(function_1.not((_a = G.guard).literal.apply(_a, values).is)), (_b = A.arbitrary).literal.apply(_b, values));
}
exports.literal = literal;
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
exports.string = make(fc.oneof(A.number, A.boolean), A.string);
/**
 * @since 3.0.0
 */
exports.number = make(fc.oneof(A.string, A.boolean), A.number);
/**
 * @since 3.0.0
 */
exports.boolean = make(fc.oneof(A.string, A.number, fc.oneof(fc.constant('true'), fc.constant('false'), fc.constant('0'), fc.constant('1'))), A.boolean);
/**
 * @since 3.0.0
 */
exports.UnknownArray = make(A.UnknownRecord, A.UnknownArray);
/**
 * @since 3.0.0
 */
exports.UnknownRecord = make(A.UnknownArray, A.UnknownRecord);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
var nullMutation = make(fc.constant({}), fc.constant(null));
/**
 * @since 3.0.0
 */
function nullable(or) {
    return union(nullMutation, or);
}
exports.nullable = nullable;
/**
 * @since 3.0.0
 */
function type(properties) {
    var keys = Object.keys(properties);
    if (keys.length === 0) {
        return make(fc.constant([]), fc.constant({}));
    }
    var mutations = {};
    var arbitraries = {};
    for (var k in properties) {
        mutations[k] = properties[k].mutation;
        arbitraries[k] = properties[k].arbitrary;
    }
    var key = fc.oneof.apply(fc, keys.map(function (key) { return fc.constant(key); }));
    var arbitrary = A.type(arbitraries);
    return make(arbitrary.chain(function (a) { return key.chain(function (key) { return mutations[key].map(function (m) {
        var _a;
        return (__assign(__assign({}, a), (_a = {}, _a[key] = m, _a)));
    }); }); }), arbitrary);
}
exports.type = type;
function nonEmpty(o) {
    return Object.keys(o).length > 0;
}
/**
 * @since 3.0.0
 */
function partial(properties) {
    var keys = Object.keys(properties);
    if (keys.length === 0) {
        return make(fc.constant([]), fc.constant({}));
    }
    var mutations = {};
    var arbitraries = {};
    for (var k in properties) {
        mutations[k] = properties[k].mutation;
        arbitraries[k] = properties[k].arbitrary;
    }
    var key = fc.oneof.apply(fc, keys.map(function (key) { return fc.constant(key); }));
    var arbitrary = A.partial(arbitraries);
    return make(arbitrary.filter(nonEmpty).chain(function (a) { return key.chain(function (key) { return mutations[key].map(function (m) {
        var _a;
        return (__assign(__assign({}, a), (_a = {}, _a[key] = m, _a)));
    }); }); }), arbitrary);
}
exports.partial = partial;
/**
 * @since 3.0.0
 */
function record(codomain) {
    return make(A.record(codomain.mutation).filter(nonEmpty), A.record(codomain.arbitrary));
}
exports.record = record;
/**
 * @since 3.0.0
 */
function array(items) {
    return make(A.array(items.mutation).filter(Array_1.isNonEmpty), A.array(items.arbitrary));
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
    var arbitrary = A.tuple.apply(A, components.map(function (c) { return c.arbitrary; }));
    if (components.length === 0) {
        return make(fc.constant({}), arbitrary);
    }
    var mutations = components.map(function (c) { return c.mutation; });
    var index = fc.oneof.apply(fc, components.map(function (_, i) { return fc.constant(i); }));
    return make(arbitrary.chain(function (t) { return index.chain(function (i) { return mutations[i].map(function (m) { return Array_1.unsafeUpdateAt(i, m, t); }); }); }), arbitrary);
}
exports.tuple = tuple;
/**
 * @since 3.0.0
 */
function intersection(left, right) {
    return make(A.intersection(left.mutation, right.mutation), A.intersection(left.arbitrary, right.arbitrary));
}
exports.intersection = intersection;
/**
 * @since 3.0.0
 */
function sum(tag) {
    var f = A.sum(tag);
    return function (members) {
        var mutations = {};
        var arbitraries = {};
        for (var k in members) {
            mutations[k] = members[k].mutation;
            arbitraries[k] = members[k].arbitrary;
        }
        return make(f(mutations), f(arbitraries));
    };
}
exports.sum = sum;
/**
 * @since 3.0.0
 */
function lazy(f) {
    return make(A.lazy(function () { return f().mutation; }), A.lazy(function () { return f().arbitrary; }));
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
    var mutations = members.map(function (member) { return member.mutation; });
    var arbitraries = members.map(function (member) { return member.arbitrary; });
    return make(A.union.apply(A, mutations), A.union.apply(A, arbitraries));
}
exports.union = union;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
exports.URI = 'ArbitraryMutation';
/**
 * @since 3.0.0
 */
exports.arbitraryMutation = {
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
