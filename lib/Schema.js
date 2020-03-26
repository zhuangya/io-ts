"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var S = require("./Schemable");
/**
 * @since 3.0.0
 */
function make(f) {
    return S.memoize(f);
}
exports.make = make;
