import * as S from './Schemable';
import { hasOwnProperty } from './util';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export function literal() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return {
        is: function (u) { return values.findIndex(function (a) { return a === u; }) !== -1; }
    };
}
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var never = {
    is: function (_u) { return false; }
};
/**
 * @since 3.0.0
 */
export var string = {
    is: function (u) { return typeof u === 'string'; }
};
/**
 * @since 3.0.0
 */
export var number = {
    is: function (u) { return typeof u === 'number'; }
};
/**
 * @since 3.0.0
 */
export var boolean = {
    is: function (u) { return typeof u === 'boolean'; }
};
/**
 * @since 3.0.0
 */
export var UnknownArray = {
    is: Array.isArray
};
/**
 * @since 3.0.0
 */
export var UnknownRecord = {
    is: function (u) { return Object.prototype.toString.call(u) === '[object Object]'; }
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export function refinement(from, refinement) {
    return {
        is: function (u) { return from.is(u) && refinement(u); }
    };
}
/**
 * @since 3.0.0
 */
export function nullable(or) {
    return {
        is: function (u) { return u === null || or.is(u); }
    };
}
/**
 * @since 3.0.0
 */
export function type(properties) {
    return refinement(UnknownRecord, function (r) {
        for (var k in properties) {
            if (!hasOwnProperty(r, k) || !properties[k].is(r[k])) {
                return false;
            }
        }
        return true;
    });
}
/**
 * @since 3.0.0
 */
export function partial(properties) {
    return refinement(UnknownRecord, function (r) {
        for (var k in properties) {
            var v = r[k];
            if (v !== undefined && !properties[k].is(v)) {
                return false;
            }
        }
        return true;
    });
}
/**
 * @since 3.0.0
 */
export function record(codomain) {
    return refinement(UnknownRecord, function (r) {
        for (var k in r) {
            if (!codomain.is(r[k])) {
                return false;
            }
        }
        return true;
    });
}
/**
 * @since 3.0.0
 */
export function array(items) {
    return refinement(UnknownArray, function (us) { return us.every(items.is); });
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
        is: function (u) { return Array.isArray(u) && u.length === components.length && components.every(function (c, i) { return c.is(u[i]); }); }
    };
}
/**
 * @since 3.0.0
 */
export function intersection(left, right) {
    return {
        is: function (u) { return left.is(u) && right.is(u); }
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
        is: function (u) { return members.some(function (m) { return m.is(u); }); }
    };
}
/**
 * @since 3.0.0
 */
export function sum(tag) {
    return function (members) {
        return refinement(UnknownRecord, function (r) {
            var v = r[tag];
            if (typeof v === 'string' && hasOwnProperty(members, v)) {
                return members[v].is(r);
            }
            return false;
        });
    };
}
/**
 * @since 3.0.0
 */
export function lazy(f) {
    var get = S.memoize(f);
    return {
        is: function (u) { return get().is(u); }
    };
}
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var URI = 'Guard';
/**
 * @since 3.0.0
 */
export var guard = {
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
    lazy: function (_, f) { return lazy(f); },
    union: union
};
