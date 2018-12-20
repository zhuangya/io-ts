"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tree = /** @class */ (function () {
    function Tree(value, forest) {
        this.value = value;
        this.forest = forest;
    }
    return Tree;
}());
var draw = function (indentation, forest) {
    var r = '';
    var len = forest.length;
    var tree;
    for (var i = 0; i < len; i++) {
        tree = forest[i];
        var isLast = i === len - 1;
        r += indentation + (isLast ? '└' : '├') + '─ ' + tree.value;
        r += draw(indentation + (len > 1 && !isLast ? '│  ' : '   '), tree.forest);
    }
    return r;
};
var drawTree = function (tree) {
    return tree.value + draw('\n', tree.forest);
};
var toArray = function (error) {
    switch (error.type) {
        case 'LabeledProduct':
            var r = [];
            for (var key in error.errors) {
                r.push([key, error.errors[key]]);
            }
            return r;
        case 'IndexedProduct':
            return error.errors;
    }
};
var toTree = function (error) {
    var toTree = function (error, withValue) {
        switch (error.type) {
            case 'Leaf':
                return new Tree("Expected " + error.expected + ", but was " + JSON.stringify(error.actual), []);
            case 'LabeledProduct':
            case 'IndexedProduct':
                return new Tree(withValue
                    ? "Expected " + error.expected + ", but was " + JSON.stringify(error.actual, null, 2)
                    : "Invalid " + error.expected, toArray(error).reduce(function (acc, _a) {
                    var key = _a[0], e = _a[1];
                    acc.push(new Tree("Invalid key " + JSON.stringify(key), [toTree(e, false)]));
                    return acc;
                }, []));
            case 'And':
            case 'Or':
                return new Tree("Invalid " + error.expected, error.errors.map(function (error) { return toTree(error, false); }));
        }
    };
    return toTree(error, true);
};
exports.failure = function (error) {
    return drawTree(toTree(error));
};
exports.success = function () { return 'No errors!'; };
exports.TreeReporter = {
    report: function (result) { return result.fold(exports.failure, exports.success); }
};
