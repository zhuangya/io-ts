/**
 * @since 3.0.0
 */
import * as C from 'fp-ts/es6/Const';
import * as ts from 'typescript';
import { fold } from './Literal';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export function $ref(id) {
    return {
        expression: function () { return C.make(ts.createCall(ts.createIdentifier(id), undefined, [schemable])); }
    };
}
var toLiteralExpression = fold(function (s) { return ts.createStringLiteral(s); }, function (n) { return ts.createNumericLiteral(String(n)); }, function (b) { return ts.createLiteral(b); }, function () { return ts.createNull(); });
var schemable = ts.createIdentifier('S');
/**
 * @since 3.0.0
 */
export function literal() {
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
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var string = {
    expression: function () { return C.make(ts.createPropertyAccess(schemable, 'string')); }
};
/**
 * @since 3.0.0
 */
export var number = {
    expression: function () { return C.make(ts.createPropertyAccess(schemable, 'number')); }
};
/**
 * @since 3.0.0
 */
export var boolean = {
    expression: function () { return C.make(ts.createPropertyAccess(schemable, 'boolean')); }
};
/**
 * @since 3.0.0
 */
export var UnknownArray = {
    expression: function () { return C.make(ts.createPropertyAccess(schemable, 'UnknownArray')); }
};
/**
 * @since 3.0.0
 */
export var UnknownRecord = {
    expression: function () { return C.make(ts.createPropertyAccess(schemable, 'UnknownRecord')); }
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export function nullable(or) {
    return {
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'nullable'), undefined, [or.expression()]));
        }
    };
}
/**
 * @since 3.0.0
 */
export function type(properties) {
    var expressions = properties;
    return {
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'type'), undefined, [
                ts.createObjectLiteral(Object.keys(expressions).map(function (k) { return ts.createPropertyAssignment(k, expressions[k].expression()); }))
            ]));
        }
    };
}
/**
 * @since 3.0.0
 */
export function partial(properties) {
    var expressions = properties;
    return {
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'partial'), undefined, [
                ts.createObjectLiteral(Object.keys(expressions).map(function (k) { return ts.createPropertyAssignment(k, expressions[k].expression()); }))
            ]));
        }
    };
}
/**
 * @since 3.0.0
 */
export function record(codomain) {
    return {
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'record'), undefined, [codomain.expression()]));
        }
    };
}
/**
 * @since 3.0.0
 */
export function array(items) {
    return {
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'array'), undefined, [items.expression()]));
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
    return {
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'tuple'), undefined, components.map(function (c) { return c.expression(); })));
        }
    };
}
/**
 * @since 3.0.0
 */
export function intersection(left, right) {
    return {
        expression: function () {
            return C.make(ts.createCall(ts.createPropertyAccess(schemable, 'intersection'), undefined, [
                left.expression(),
                right.expression()
            ]));
        }
    };
}
/**
 * @since 3.0.0
 */
export function sum(tag) {
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
/**
 * @since 3.0.0
 */
export function lazy(id, f) {
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
/**
 * @since 3.0.0
 */
export function union() {
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
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var URI = 'Expression';
/**
 * @since 3.0.0
 */
export var expression = {
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
export function print(node) {
    return printer.printNode(ts.EmitHint.Unspecified, node, source);
}
