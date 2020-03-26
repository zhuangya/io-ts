var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/es6/Const';
import * as R from 'fp-ts/es6/Record';
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
    return {
        compile: function () { return C.make({ enum: __spreadArrays(values) }); }
    };
}
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var string = {
    compile: function () { return C.make({ type: 'string' }); }
};
/**
 * @since 3.0.0
 */
export var number = {
    compile: function () { return C.make({ type: 'number' }); }
};
/**
 * @since 3.0.0
 */
export var boolean = {
    compile: function () { return C.make({ type: 'boolean' }); }
};
/**
 * @since 3.0.0
 */
export var UnknownArray = {
    compile: function () { return C.make({ type: 'array' }); }
};
/**
 * @since 3.0.0
 */
export var UnknownRecord = {
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
export function nullable(or) {
    return union(nullJsonSchema, or);
}
/**
 * @since 3.0.0
 */
export function type(properties) {
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
/**
 * @since 3.0.0
 */
export function partial(properties) {
    return {
        compile: function (lazy) {
            return C.make({
                type: 'object',
                properties: R.record.map(properties, function (p) { return p.compile(lazy); })
            });
        }
    };
}
/**
 * @since 3.0.0
 */
export function record(codomain) {
    return {
        compile: function (lazy) {
            return C.make({
                type: 'object',
                additionalProperties: codomain.compile(lazy)
            });
        }
    };
}
/**
 * @since 3.0.0
 */
export function array(items) {
    return {
        compile: function (lazy) {
            return C.make({
                type: 'array',
                items: items.compile(lazy)
            });
        }
    };
}
/**
 * @since 3.0.0
 */
export function tuple() {
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
/**
 * @since 3.0.0
 */
export function intersection(left, right) {
    return {
        compile: function (lazy) { return C.make({ allOf: [left.compile(lazy), right.compile(lazy)] }); }
    };
}
/**
 * @since 3.0.0
 */
export function sum(_tag) {
    return function (members) {
        return {
            compile: function (lazy) { return C.make({ anyOf: Object.keys(members).map(function (k) { return members[k].compile(lazy); }) }); }
        };
    };
}
/**
 * @since 3.0.0
 */
export function lazy(id, f) {
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
/**
 * @since 3.0.0
 */
export function union() {
    var members = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        members[_i] = arguments[_i];
    }
    return {
        compile: function (lazy) { return C.make({ anyOf: members.map(function (m) { return m.compile(lazy); }) }); }
    };
}
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var URI = 'JsonSchema';
/**
 * @since 3.0.0
 */
export var jsonSchema = {
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
    lazy: lazy,
    union: union
};
