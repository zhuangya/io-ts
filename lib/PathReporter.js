"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failure = function (error) {
    var go = function (error, path) {
        switch (error.type) {
            case 'Leaf':
                return ["Invalid value " + JSON.stringify(error.actual) + " supplied to " + (path + error.expected)];
            case 'LabeledProduct':
                var r = [];
                for (var key in error.errors) {
                    var e = error.errors[key];
                    r.push.apply(r, go(e, path + error.expected + '/' + key + ': '));
                }
                return r;
            case 'IndexedProduct':
                return error.errors.reduce(function (acc, _a) {
                    var key = _a[0], e = _a[1];
                    acc.push.apply(acc, go(e, path + error.expected + '/' + key + ': '));
                    return acc;
                }, []);
            case 'And':
            case 'Or':
                return error.errors.reduce(function (acc, e) {
                    acc.push.apply(acc, go(e, path + error.expected + '/_: '));
                    return acc;
                }, []);
        }
    };
    return go(error, '');
};
var empty = [];
exports.success = function () { return empty; };
exports.PathReporter = {
    report: function (result) { return result.fold(exports.failure, exports.success); }
};
