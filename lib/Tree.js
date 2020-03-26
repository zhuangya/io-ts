"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @since 3.0.0
 */
var Tree_1 = require("fp-ts/lib/Tree");
/**
 * @since 3.0.0
 */
function toString(e) {
    return e.map(Tree_1.drawTree).join('\n');
}
exports.toString = toString;
