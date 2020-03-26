/**
 * @since 3.0.0
 */
/**
 * @internal
 */
export function hasOwnProperty(o, k) {
    return Object.prototype.hasOwnProperty.call(o, k);
}
function typeOf(x) {
    return x === null ? 'null' : typeof x;
}
/**
 * @internal
 */
export function intersect(a, b) {
    if (a !== undefined && b !== undefined) {
        var tx = typeOf(a);
        var ty = typeOf(b);
        if (tx === 'object' || ty === 'object') {
            return Object.assign({}, a, b);
        }
    }
    return b;
}
