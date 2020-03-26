"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @since 3.0.0
 */
var C = require("fp-ts/lib/Const");
var ts = require("typescript");
var Literal_1 = require("./Literal");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
function $ref(id) {
    return {
        expression: function () { return C.make(ts.createCall(ts.createIdentifier(id), undefined, [schemable])); }
    };
}
exports.$ref = $ref;
var toLiteralExpression = Literal_1.fold(function (s) { return ts.createStringLiteral(s); }, function (n) { return ts.createNumericLiteral(String(n)); }, function (b) { return ts.createLiteral(b); }, function () { return ts.createNull(); });
var schemable = ts.createIdentifier('S');
/**
 * @since 3.0.0
 */
function literal() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return {
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'literal'), undefined, values.map(toLiteralExpression)));
        }
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
    expression: function () { return C.make(ts.createPropertyAccess(schemable, 'string')); }
};
/**
 * @since 3.0.0
 */
exports.number = {
    expression: function () { return C.make(ts.createPropertyAccess(schemable, 'number')); }
};
/**
 * @since 3.0.0
 */
exports.boolean = {
    expression: function () { return C.make(ts.createPropertyAccess(schemable, 'boolean')); }
};
/**
 * @since 3.0.0
 */
exports.UnknownArray = {
    expression: function () { return C.make(ts.createPropertyAccess(schemable, 'UnknownArray')); }
};
/**
 * @since 3.0.0
 */
exports.UnknownRecord = {
    expression: function () { return C.make(ts.createPropertyAccess(schemable, 'UnknownRecord')); }
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
function nullable(or) {
    return {
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'nullable'), undefined, [or.expression()]));
        }
    };
}
exports.nullable = nullable;
/**
 * @since 3.0.0
 */
function type(properties) {
    var expressions = properties;
    return {
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'type'), undefined, [
                ts.createObjectLiteral(Object.keys(expressions).map(function (k) { return ts.createPropertyAssignment(k, expressions[k].expression()); }))
            ]));
        }
    };
}
exports.type = type;
/**
 * @since 3.0.0
 */
function partial(properties) {
    var expressions = properties;
    return {
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'partial'), undefined, [
                ts.createObjectLiteral(Object.keys(expressions).map(function (k) { return ts.createPropertyAssignment(k, expressions[k].expression()); }))
            ]));
        }
    };
}
exports.partial = partial;
/**
 * @since 3.0.0
 */
function record(codomain) {
    return {
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'record'), undefined, [codomain.expression()]));
        }
    };
}
exports.record = record;
/**
 * @since 3.0.0
 */
function array(items) {
    return {
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'array'), undefined, [items.expression()]));
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
    return {
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'tuple'), undefined, components.map(function (c) { return c.expression(); })));
        }
    };
}
exports.tuple = tuple;
/**
 * @since 3.0.0
 */
function intersection(left, right) {
    return {
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'intersection'), undefined, [
                left.expression(),
                right.expression()
            ]));
        }
    };
}
exports.intersection = intersection;
/**
 * @since 3.0.0
 */
function sum(tag) {
    return function (members) {
        return {
            expression: function () {
                return C.make(ts.createCall(ts.createCall(ts.createPropertyAccess(schemable, 'sum'), undefined, [ts.createStringLiteral(tag)]), undefined, [
                    ts.createObjectLiteral(Object.keys(members).map(function (k) { return ts.createPropertyAssignment(k, members[k].expression()); }))
                ]));
            }
        };
    };
}
exports.sum = sum;
/**
 * @since 3.0.0
 */
function lazy(id, f) {
    var $ref;
    return {
        expression: function () {
            if (!$ref) {
                $ref = id;
                return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'lazy'), undefined, [
                    ts.createArrowFunction(undefined, undefined, [], undefined, undefined, f().expression())
                ]));
            }
            return C.make(ts.createCall(ts.createIdentifier(id), undefined, [schemable]));
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
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'union'), undefined, members.map(function (m) { return m.expression(); })));
        }
    };
}
exports.union = union;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
exports.URI = 'Expression';
/**
 * @since 3.0.0
 */
exports.expression = {
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
// -------------------------------------------------------------------------------------
// helpers
// -------------------------------------------------------------------------------------
var printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed
});
var source = ts.createSourceFile('', '', ts.ScriptTarget.Latest);
/**
 * @since 3.0.0
 */
function print(node) {
    return printer.printNode(ts.EmitHint.Unspecified, node, source);
}
exports.print = print;
