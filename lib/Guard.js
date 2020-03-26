"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    return {
        is: function (u) { return values.findIndex(function (a) { return a === u; }) !== -1; }
    };
}
exports.literal = literal;
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
exports.never = {
    is: function (_u) { return false; }
};
/**
 * @since 3.0.0
 */
exports.string = {
    is: function (u) { return typeof u === 'string'; }
};
/**
 * @since 3.0.0
 */
exports.number = {
    is: function (u) { return typeof u === 'number'; }
};
/**
 * @since 3.0.0
 */
exports.boolean = {
    is: function (u) { return typeof u === 'boolean'; }
};
/**
 * @since 3.0.0
 */
exports.UnknownArray = {
    is: Array.isArray
};
/**
 * @since 3.0.0
 */
exports.UnknownRecord = {
    is: function (u) { return Object.prototype.toString.call(u) === '[object Object]'; }
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
function refinement(from, refinement) {
    return {
        is: function (u) { return from.is(u) && refinement(u); }
    };
}
exports.refinement = refinement;
/**
 * @since 3.0.0
 */
function nullable(or) {
    return {
        is: function (u) { return u === null || or.is(u); }
    };
}
exports.nullable = nullable;
/**
 * @since 3.0.0
 */
function type(properties) {
    return refinement(exports.UnknownRecord, function (r) {
        for (var k in properties) {
            if (!properties[k].is(r[k])) {
                return false;
            }
        }
        return true;
    });
}
exports.type = type;
/**
 * @since 3.0.0
 */
function partial(properties) {
    return refinement(exports.UnknownRecord, function (r) {
        for (var k in properties) {
            var v = r[k];
            if (v !== undefined && !properties[k].is(v)) {
                return false;
            }
        }
        return true;
    });
}
exports.partial = partial;
/**
 * @since 3.0.0
 */
function record(codomain) {
    return refinement(exports.UnknownRecord, function (r) {
        for (var k in r) {
            if (!codomain.is(r[k])) {
                return false;
            }
        }
        return true;
    });
}
exports.record = record;
/**
 * @since 3.0.0
 */
function array(items) {
    return refinement(exports.UnknownArray, function (us) { return us.every(items.is); });
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
    return {
        is: function (u) { return Array.isArray(u) && u.length === components.length && components.every(function (c, i) { return c.is(u[i]); }); }
    };
}
exports.tuple = tuple;
/**
 * @since 3.0.0
 */
function intersection(left, right) {
    return {
        is: function (u) { return left.is(u) && right.is(u); }
    };
}
exports.intersection = intersection;
/**
 * @since 3.0.0
 */
function union() {
    var members = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        members[_i] = arguments[_i];
    }
    return {
        is: function (u) { return members.some(function (m) { return m.is(u); }); }
    };
}
exports.union = union;
/**
 * @since 3.0.0
 */
function sum(tag) {
    return function (members) {
        return refinement(exports.UnknownRecord, function (r) {
            var v = r[tag];
            if (typeof v === 'string' && util_1.hasOwnProperty(members, v)) {
                return members[v].is(r);
            }
            return false;
        });
    };
}
exports.sum = sum;
/**
 * @since 3.0.0
 */
function lazy(f) {
    var get = S.memoize(f);
    return {
        is: function (u) { return get().is(u); }
    };
}
exports.lazy = lazy;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
exports.URI = 'Guard';
/**
 * @since 3.0.0
 */
exports.guard = {
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
