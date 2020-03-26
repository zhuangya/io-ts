"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @since 3.0.0
 */
function fold(onString, onNumber, onBoolean, onNull) {
    return function (literal) {
        if (typeof literal === 'string') {
            return onString(literal);
        }
        else if (typeof literal === 'number') {
            return onNumber(literal);
        }
        else if (typeof literal === 'boolean') {
            return onBoolean(literal);
        }
        else {
            return onNull();
        }
    };
}
exports.fold = fold;
