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
        typeNode: function () { return C.make(ts.createTypeReferenceNode(id, undefined)); }
    };
}
var toLiteralTypeNode = fold(function (s) { return ts.createLiteralTypeNode(ts.createStringLiteral(s)); }, function (n) { return ts.createLiteralTypeNode(ts.createNumericLiteral(String(n))); }, function (b) { return ts.createLiteralTypeNode(ts.createLiteral(b)); }, function () { return ts.createKeywordTypeNode(ts.SyntaxKind.NullKeyword); });
var never = {
    typeNode: function () { return C.make(ts.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword)); }
};
/**
 * @since 3.0.0
 */
export function literal() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    if (values.length === 0) {
        return never;
    }
    return {
        typeNode: function () { return C.make(ts.createUnionTypeNode(values.map(toLiteralTypeNode))); }
    };
}
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var string = {
    typeNode: function () { return C.make(ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)); }
};
/**
 * @since 3.0.0
 */
export var number = {
    typeNode: function () { return C.make(ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)); }
};
/**
 * @since 3.0.0
 */
export var boolean = {
    typeNode: function () { return C.make(ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)); }
};
/**
 * @since 3.0.0
 */
export var UnknownArray = {
    typeNode: function () { return C.make(ts.createTypeReferenceNode('Array', [ts.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)])); }
};
/**
 * @since 3.0.0
 */
export var UnknownRecord = {
    typeNode: function () {
        return C.make(ts.createTypeReferenceNode('Record', [
            ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ts.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
        ]));
    }
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
var nullTypeNode = {
    typeNode: function () { return C.make(ts.createKeywordTypeNode(ts.SyntaxKind.NullKeyword)); }
};
/**
 * @since 3.0.0
 */
export function nullable(or) {
    return union(nullTypeNode, or);
}
/**
 * @since 3.0.0
 */
export function type(properties) {
    var typeNodes = properties;
    return {
        typeNode: function () {
            return C.make(ts.createTypeLiteralNode(Object.keys(typeNodes).map(function (k) {
                return ts.createPropertySignature(undefined, k, undefined, typeNodes[k].typeNode(), undefined);
            })));
        }
    };
}
/**
 * @since 3.0.0
 */
export function partial(properties) {
    return {
        typeNode: function () { return C.make(ts.createTypeReferenceNode('Partial', [type(properties).typeNode()])); }
    };
}
/**
 * @since 3.0.0
 */
export function record(codomain) {
    return {
        typeNode: function () {
            return C.make(ts.createTypeReferenceNode('Record', [
                ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                codomain.typeNode()
            ]));
        }
    };
}
/**
 * @since 3.0.0
 */
export function array(items) {
    return {
        typeNode: function () { return C.make(ts.createTypeReferenceNode('Array', [items.typeNode()])); }
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
        typeNode: function () { return C.make(ts.createTupleTypeNode(components.map(function (c) { return c.typeNode(); }))); }
    };
}
/**
 * @since 3.0.0
 */
export function intersection(left, right) {
    return {
        typeNode: function () { return C.make(ts.createIntersectionTypeNode([left.typeNode(), right.typeNode()])); }
    };
}
/**
 * @since 3.0.0
 */
export function sum(_tag) {
    return function (members) {
        var keys = Object.keys(members);
        if (keys.length === 0) {
            return never;
        }
        return {
            typeNode: function () { return C.make(ts.createUnionTypeNode(keys.map(function (k) { return members[k].typeNode(); }))); }
        };
    };
}
/**
 * @since 3.0.0
 */
export function lazy(id, f) {
    var $ref;
    return {
        typeNode: function () {
            if (!$ref) {
                $ref = id;
                return C.make(f().typeNode());
            }
            return C.make(ts.createTypeReferenceNode($ref, undefined));
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
    if (members.length === 0) {
        return never;
    }
    return {
        typeNode: function () { return C.make(ts.createUnionTypeNode(members.map(function (m) { return m.typeNode(); }))); }
    };
}
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var URI = 'TypeNode';
/**
 * @since 3.0.0
 */
export var typeNode = {
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
