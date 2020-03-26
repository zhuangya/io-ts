"use strict";
/**
 * @since 3.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @internal
 */
function hasOwnProperty(o, k) {
    return Object.prototype.hasOwnProperty.call(o, k);
}
exports.hasOwnProperty = hasOwnProperty;
function typeOf(x) {
    return x === null ? 'null' : typeof x;
}
/**
 * @internal
 */
function intersect(a, b) {
    if (a !== undefined && b !== undefined) {
        var tx = typeOf(a);
        var ty = typeOf(b);
        if (tx === 'object' || ty === 'object') {
            return Object.assign({}, a, b);
        }
    }
    return b;
}
exports.intersect = intersect;
