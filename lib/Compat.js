"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Missing
 *   - `pipe` method
 *   - `null` primitive
 *   - `undefined` primitive
 *   - `void` primitive
 *   - `unknown` primitive
 * @since 3.0.0
 */
var C = require("./Codec");
var D = require("./Decoder");
var G = require("./Guard");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
function make(codec, guard) {
    return {
        is: guard.is,
        decode: codec.decode,
        encode: codec.encode
    };
}
exports.make = make;
/**
 * @since 3.0.0
 */
function literal() {
    var _a, _b;
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return make((_a = C.codec).literal.apply(_a, values), (_b = G.guard).literal.apply(_b, values));
}
exports.literal = literal;
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
exports.string = make(C.codec.string, G.guard.string);
/**
 * @since 3.0.0
 */
exports.number = make(C.codec.number, G.guard.number);
/**
 * @since 3.0.0
 */
exports.boolean = make(C.codec.boolean, G.guard.boolean);
/**
 * @since 3.0.0
 */
exports.UnknownArray = make(C.codec.UnknownArray, G.guard.UnknownArray);
/**
 * @since 3.0.0
 */
exports.UnknownRecord = make(C.codec.UnknownRecord, G.guard.UnknownRecord);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
function refinement(from, refinement, expected) {
    return make(C.refinement(from, refinement, expected), G.refinement(from, refinement));
}
exports.refinement = refinement;
/**
 * @since 3.0.0
 */
function nullable(or) {
    return make(C.codec.nullable(or), G.guard.nullable(or));
}
exports.nullable = nullable;
/**
 * @since 3.0.0
 */
function type(properties) {
    return make(C.codec.type(properties), G.guard.type(properties));
}
exports.type = type;
/**
 * @since 3.0.0
 */
function partial(properties) {
    return make(C.codec.partial(properties), G.guard.partial(properties));
}
exports.partial = partial;
/**
 * @since 3.0.0
 */
function record(codomain) {
    return make(C.codec.record(codomain), G.guard.record(codomain));
}
exports.record = record;
/**
 * @since 3.0.0
 */
function array(items) {
    return make(C.codec.array(items), G.guard.array(items));
}
exports.array = array;
/**
 * @since 3.0.0
 */
function tuple() {
    var _a, _b;
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return make((_a = C.codec).tuple.apply(_a, components), (_b = G.guard).tuple.apply(_b, components));
}
exports.tuple = tuple;
/**
 * @since 3.0.0
 */
function intersection(left, right) {
    return make(C.codec.intersection(left, right), G.guard.intersection(left, right));
}
exports.intersection = intersection;
/**
 * @since 3.0.0
 */
function union() {
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
exports.union = union;
/**
 * @since 3.0.0
 */
function sum(tag) {
    var sumC = C.codec.sum(tag);
    var sumG = G.guard.sum(tag);
    return function (members) { return make(sumC(members), sumG(members)); };
}
exports.sum = sum;
/**
 * @since 3.0.0
 */
function lazy(id, f) {
    return make(C.codec.lazy(id, f), G.guard.lazy(id, f));
}
exports.lazy = lazy;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
exports.URI = 'Compat';
/**
 * @since 3.0.0
 */
exports.compat = {
    URI: exports.URI,
    literal: literal,
    string: exports.string,
    number: exports.number,
    boolean: exports.boolean,
    UnknownArray: exports.UnknownArray,
    UnknownRecord: exports.UnknownRecord,
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
