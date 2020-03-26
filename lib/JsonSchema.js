"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @since 3.0.0
 */
var C = require("fp-ts/lib/Const");
var R = require("fp-ts/lib/Record");
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
        compile: function () { return C.make({ enum: __spreadArrays(values) }); }
    };
}
exports.literal = literal;
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
exports.string = {
    compile: function () { return C.make({ type: 'string' }); }
};
/**
 * @since 3.0.0
 */
exports.number = {
    compile: function () { return C.make({ type: 'number' }); }
};
/**
 * @since 3.0.0
 */
exports.boolean = {
    compile: function () { return C.make({ type: 'boolean' }); }
};
/**
 * @since 3.0.0
 */
exports.UnknownArray = {
    compile: function () { return C.make({ type: 'array' }); }
};
/**
 * @since 3.0.0
 */
exports.UnknownRecord = {
    compile: function () { return C.make({ type: 'object' }); }
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
var nullJsonSchema = {
    compile: function () { return C.make({ enum: [null] }); }
};
/**
 * @since 3.0.0
 */
function nullable(or) {
    return union(nullJsonSchema, or);
}
exports.nullable = nullable;
/**
 * @since 3.0.0
 */
function type(properties) {
    return {
        compile: function (lazy) {
            return C.make({
                type: 'object',
                properties: R.record.map(properties, function (p) { return p.compile(lazy); }),
                required: Object.keys(properties)
            });
        }
    };
}
exports.type = type;
/**
 * @since 3.0.0
 */
function partial(properties) {
    return {
        compile: function (lazy) {
            return C.make({
                type: 'object',
                properties: R.record.map(properties, function (p) { return p.compile(lazy); })
            });
        }
    };
}
exports.partial = partial;
/**
 * @since 3.0.0
 */
function record(codomain) {
    return {
        compile: function (lazy) {
            return C.make({
                type: 'object',
                additionalProperties: codomain.compile(lazy)
            });
        }
    };
}
exports.record = record;
/**
 * @since 3.0.0
 */
function array(items) {
    return {
        compile: function (lazy) {
            return C.make({
                type: 'array',
                items: items.compile(lazy)
            });
        }
    };
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
    var len = components.length;
    return {
        compile: function (lazy) {
            return C.make({
                type: 'array',
                items: len > 0 ? components.map(function (c) { return c.compile(lazy); }) : undefined,
                minItems: len,
                maxItems: len
            });
        }
    };
}
exports.tuple = tuple;
/**
 * @since 3.0.0
 */
function intersection(left, right) {
    return {
        compile: function (lazy) { return C.make({ allOf: [left.compile(lazy), right.compile(lazy)] }); }
    };
}
exports.intersection = intersection;
/**
 * @since 3.0.0
 */
function sum(_tag) {
    return function (members) {
        return {
            compile: function (lazy) { return C.make({ anyOf: Object.keys(members).map(function (k) { return members[k].compile(lazy); }) }); }
        };
    };
}
exports.sum = sum;
/**
 * @since 3.0.0
 */
function lazy(id, f) {
    var $ref = "#/definitions/" + id;
    return {
        compile: function (definitions) {
            var _a;
            if (definitions) {
                if (definitions.hasOwnProperty(id)) {
                    return C.make({ $ref: $ref });
                }
                definitions[id] = undefined;
                return (definitions[id] = f().compile(definitions));
            }
            else {
                definitions = (_a = {}, _a[id] = undefined, _a);
                definitions[id] = f().compile(definitions);
                return C.make({
                    definitions: definitions,
                    $ref: $ref
                });
            }
        }
    };
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
    return {
        compile: function (lazy) { return C.make({ anyOf: members.map(function (m) { return m.compile(lazy); }) }); }
    };
}
exports.union = union;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
exports.URI = 'JsonSchema';
/**
 * @since 3.0.0
 */
exports.jsonSchema = {
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
    lazy: lazy,
    union: union
};
