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
        typeNode: function () { return C.make(ts.createTypeReferenceNode(id, undefined)); }
    };
}
exports.$ref = $ref;
var toLiteralTypeNode = Literal_1.fold(function (s) { return ts.createLiteralTypeNode(ts.createStringLiteral(s)); }, function (n) { return ts.createLiteralTypeNode(ts.createNumericLiteral(String(n))); }, function (b) { return ts.createLiteralTypeNode(ts.createLiteral(b)); }, function () { return ts.createKeywordTypeNode(ts.SyntaxKind.NullKeyword); });
var never = {
    typeNode: function () { return C.make(ts.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword)); }
};
/**
 * @since 3.0.0
 */
function literal() {
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
exports.literal = literal;
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
exports.string = {
    typeNode: function () { return C.make(ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)); }
};
/**
 * @since 3.0.0
 */
exports.number = {
    typeNode: function () { return C.make(ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)); }
};
/**
 * @since 3.0.0
 */
exports.boolean = {
    typeNode: function () { return C.make(ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)); }
};
/**
 * @since 3.0.0
 */
exports.UnknownArray = {
    typeNode: function () { return C.make(ts.createTypeReferenceNode('Array', [ts.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)])); }
};
/**
 * @since 3.0.0
 */
exports.UnknownRecord = {
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
function nullable(or) {
    return union(nullTypeNode, or);
}
exports.nullable = nullable;
/**
 * @since 3.0.0
 */
function type(properties) {
    var typeNodes = properties;
    return {
        typeNode: function () {
            return C.make(ts.createTypeLiteralNode(Object.keys(typeNodes).map(function (k) {
                return ts.createPropertySignature(undefined, k, undefined, typeNodes[k].typeNode(), undefined);
            })));
        }
    };
}
exports.type = type;
/**
 * @since 3.0.0
 */
function partial(properties) {
    return {
        typeNode: function () { return C.make(ts.createTypeReferenceNode('Partial', [type(properties).typeNode()])); }
    };
}
exports.partial = partial;
/**
 * @since 3.0.0
 */
function record(codomain) {
    return {
        typeNode: function () {
            return C.make(ts.createTypeReferenceNode('Record', [
                ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                codomain.typeNode()
            ]));
        }
    };
}
exports.record = record;
/**
 * @since 3.0.0
 */
function array(items) {
    return {
        typeNode: function () { return C.make(ts.createTypeReferenceNode('Array', [items.typeNode()])); }
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
        typeNode: function () { return C.make(ts.createTupleTypeNode(components.map(function (c) { return c.typeNode(); }))); }
    };
}
exports.tuple = tuple;
/**
 * @since 3.0.0
 */
function intersection(left, right) {
    return {
        typeNode: function () { return C.make(ts.createIntersectionTypeNode([left.typeNode(), right.typeNode()])); }
    };
}
exports.intersection = intersection;
/**
 * @since 3.0.0
 */
function sum(_tag) {
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
exports.sum = sum;
/**
 * @since 3.0.0
 */
function lazy(id, f) {
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
exports.lazy = lazy;
/**
 * @since 3.0.0
 */
function union() {
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
exports.union = union;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
exports.URI = 'TypeNode';
/**
 * @since 3.0.0
 */
exports.typeNode = {
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
