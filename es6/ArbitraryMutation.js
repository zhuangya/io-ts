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
import { isNonEmpty, unsafeUpdateAt } from 'fp-ts/es6/Array';
import { not } from 'fp-ts/es6/function';
import * as A from './Arbitrary';
import * as G from './Guard';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export function make(mutation, arbitrary) {
    return { mutation: mutation, arbitrary: arbitrary };
}
var literalsArbitrary = A.union(A.string, A.number, A.boolean, fc.constant(null));
/**
 * @since 3.0.0
 */
export function literal() {
    var _a, _b;
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return make(literalsArbitrary.filter(not((_a = G.guard).literal.apply(_a, values).is)), (_b = A.arbitrary).literal.apply(_b, values));
}
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var string = make(fc.oneof(A.number, A.boolean), A.string);
/**
 * @since 3.0.0
 */
export var number = make(fc.oneof(A.string, A.boolean), A.number);
/**
 * @since 3.0.0
 */
export var boolean = make(fc.oneof(A.string, A.number, fc.oneof(fc.constant('true'), fc.constant('false'), fc.constant('0'), fc.constant('1'))), A.boolean);
/**
 * @since 3.0.0
 */
export var UnknownArray = make(A.UnknownRecord, A.UnknownArray);
/**
 * @since 3.0.0
 */
export var UnknownRecord = make(A.UnknownArray, A.UnknownRecord);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
var nullMutation = make(fc.constant({}), fc.constant(null));
/**
 * @since 3.0.0
 */
export function nullable(or) {
    return union(nullMutation, or);
}
/**
 * @since 3.0.0
 */
export function type(properties) {
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
function nonEmpty(o) {
    return Object.keys(o).length > 0;
}
/**
 * @since 3.0.0
 */
export function partial(properties) {
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
/**
 * @since 3.0.0
 */
export function record(codomain) {
    return make(A.record(codomain.mutation).filter(nonEmpty), A.record(codomain.arbitrary));
}
/**
 * @since 3.0.0
 */
export function array(items) {
    return make(A.array(items.mutation).filter(isNonEmpty), A.array(items.arbitrary));
}
/**
 * @since 3.0.0
 */
export function tuple() {
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
    return make(arbitrary.chain(function (t) { return index.chain(function (i) { return mutations[i].map(function (m) { return unsafeUpdateAt(i, m, t); }); }); }), arbitrary);
}
/**
 * @since 3.0.0
 */
export function intersection(left, right) {
    return make(A.intersection(left.mutation, right.mutation), A.intersection(left.arbitrary, right.arbitrary));
}
/**
 * @since 3.0.0
 */
export function sum(tag) {
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
/**
 * @since 3.0.0
 */
export function lazy(f) {
    return make(A.lazy(function () { return f().mutation; }), A.lazy(function () { return f().arbitrary; }));
}
/**
 * @since 3.0.0
 */
export function union() {
    var members = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        members[_i] = arguments[_i];
    }
    var mutations = members.map(function (member) { return member.mutation; });
    var arbitraries = members.map(function (member) { return member.arbitrary; });
    return make(A.union.apply(A, mutations), A.union.apply(A, arbitraries));
}
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var URI = 'ArbitraryMutation';
/**
 * @since 3.0.0
 */
export var arbitraryMutation = {
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
