import * as E from 'fp-ts/es6/Either';
import { pipe, pipeable } from 'fp-ts/es6/pipeable';
import * as T from 'fp-ts/es6/Tree';
import * as G from './Guard';
import * as S from './Schemable';
import * as U from './util';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export function fromGuard(guard, expected) {
    return {
        decode: function (u) {
            return guard.is(u) ? E.right(u) : E.left([T.make("cannot decode " + JSON.stringify(u) + ", should be " + expected)]);
        }
    };
}
/**
 * @since 3.0.0
 */
export function literal() {
    var _a;
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    if (values.length === 0) {
        return never;
    }
    var expected = values.map(function (value) { return JSON.stringify(value); }).join(' | ');
    return fromGuard((_a = G.guard).literal.apply(_a, values), expected);
}
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var never = fromGuard(G.never, 'never');
/**
 * @since 3.0.0
 */
export var string = fromGuard(G.string, 'string');
/**
 * @since 3.0.0
 */
export var number = fromGuard(G.number, 'number');
/**
 * @since 3.0.0
 */
export var boolean = fromGuard(G.boolean, 'boolean');
/**
 * @since 3.0.0
 */
export var UnknownArray = fromGuard(G.UnknownArray, 'Array<unknown>');
/**
 * @since 3.0.0
 */
export var UnknownRecord = fromGuard(G.UnknownRecord, 'Record<string, unknown>');
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export function withExpected(decoder, expected) {
    return {
        decode: function (u) {
            return pipe(decoder.decode(u), E.mapLeft(function (nea) { return expected(u, nea); }));
        }
    };
}
/**
 * @since 3.0.0
 */
export function refinement(from, refinement, expected) {
    return {
        decode: function (u) {
            var e = from.decode(u);
            if (E.isLeft(e)) {
                return e;
            }
            var a = e.right;
            return refinement(a) ? E.right(a) : E.left([T.make("cannot refine " + JSON.stringify(u) + ", should be " + expected)]);
        }
    };
}
/**
 * @since 3.0.0
 */
export function parse(from, parser) {
    return {
        decode: function (u) {
            var e = from.decode(u);
            if (E.isLeft(e)) {
                return e;
            }
            var pe = parser(e.right);
            if (E.isLeft(pe)) {
                return E.left([T.make(pe.left)]);
            }
            return pe;
        }
    };
}
/**
 * @since 3.0.0
 */
export function nullable(or) {
    return union(literal(null), or);
}
/**
 * @since 3.0.0
 */
export function type(properties) {
    return {
        decode: function (u) {
            var e = UnknownRecord.decode(u);
            if (E.isLeft(e)) {
                return e;
            }
            else {
                var r = e.right;
                var a = {};
                for (var k in properties) {
                    var e_1 = properties[k].decode(r[k]);
                    if (E.isLeft(e_1)) {
                        return E.left([T.make("required property " + JSON.stringify(k), e_1.left)]);
                    }
                    else {
                        a[k] = e_1.right;
                    }
                }
                return E.right(a);
            }
        }
    };
}
/**
 * @since 3.0.0
 */
export function partial(properties) {
    return {
        decode: function (u) {
            var e = UnknownRecord.decode(u);
            if (E.isLeft(e)) {
                return e;
            }
            else {
                var r = e.right;
                var a = {};
                for (var k in properties) {
                    // don't add missing properties
                    if (U.hasOwnProperty(r, k)) {
                        var rk = r[k];
                        // don't strip undefined properties
                        if (rk === undefined) {
                            a[k] = undefined;
                        }
                        else {
                            var e_2 = properties[k].decode(rk);
                            if (E.isLeft(e_2)) {
                                return E.left([T.make("optional property " + JSON.stringify(k), e_2.left)]);
                            }
                            else {
                                a[k] = e_2.right;
                            }
                        }
                    }
                }
                return E.right(a);
            }
        }
    };
}
/**
 * @since 3.0.0
 */
export function record(codomain) {
    return {
        decode: function (u) {
            var e = UnknownRecord.decode(u);
            if (E.isLeft(e)) {
                return e;
            }
            else {
                var r = e.right;
                var a = {};
                for (var k in r) {
                    var e_3 = codomain.decode(r[k]);
                    if (E.isLeft(e_3)) {
                        return E.left([T.make("key " + JSON.stringify(k), e_3.left)]);
                    }
                    else {
                        a[k] = e_3.right;
                    }
                }
                return E.right(a);
            }
        }
    };
}
/**
 * @since 3.0.0
 */
export function array(items) {
    return {
        decode: function (u) {
            var e = UnknownArray.decode(u);
            if (E.isLeft(e)) {
                return e;
            }
            else {
                var us = e.right;
                var len = us.length;
                var a = new Array(len);
                for (var i = 0; i < len; i++) {
                    var e_4 = items.decode(us[i]);
                    if (E.isLeft(e_4)) {
                        return E.left([T.make("item " + i, e_4.left)]);
                    }
                    else {
                        a[i] = e_4.right;
                    }
                }
                return E.right(a);
            }
        }
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
        decode: function (u) {
            var e = UnknownArray.decode(u);
            if (E.isLeft(e)) {
                return e;
            }
            var us = e.right;
            var a = [];
            for (var i = 0; i < components.length; i++) {
                var e_5 = components[i].decode(us[i]);
                if (E.isLeft(e_5)) {
                    return E.left([T.make("component " + i, e_5.left)]);
                }
                else {
                    a.push(e_5.right);
                }
            }
            return E.right(a);
        }
    };
}
/**
 * @since 3.0.0
 */
export function intersection(left, right) {
    return {
        decode: function (u) {
            var ea = left.decode(u);
            if (E.isLeft(ea)) {
                return ea;
            }
            var eb = right.decode(u);
            if (E.isLeft(eb)) {
                return eb;
            }
            return E.right(U.intersect(ea.right, eb.right));
        }
    };
}
/**
 * @since 3.0.0
 */
export function lazy(id, f) {
    var get = S.memoize(f);
    return {
        decode: function (u) {
            return pipe(get().decode(u), E.mapLeft(function (nea) { return [T.make(id, nea)]; }));
        }
    };
}
/**
 * @since 3.0.0
 */
export function sum(tag) {
    return function (members) {
        var keys = Object.keys(members);
        if (keys.length === 0) {
            return never;
        }
        var expected = keys.map(function (k) { return JSON.stringify(k); }).join(' | ');
        return {
            decode: function (u) {
                var e = UnknownRecord.decode(u);
                if (E.isLeft(e)) {
                    return e;
                }
                var v = e.right[tag];
                if (typeof v === 'string' && U.hasOwnProperty(members, v)) {
                    return members[v].decode(u);
                }
                return E.left([
                    T.make("required property " + JSON.stringify(tag), [
                        T.make("cannot decode " + JSON.stringify(v) + ", should be " + expected)
                    ])
                ]);
            }
        };
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
    var len = members.length;
    if (len === 0) {
        return never;
    }
    return {
        decode: function (u) {
            var e = members[0].decode(u);
            if (E.isRight(e)) {
                return e;
            }
            else {
                var forest = [T.make("member 0", e.left)];
                for (var i = 1; i < len; i++) {
                    var e_6 = members[i].decode(u);
                    if (E.isRight(e_6)) {
                        return e_6;
                    }
                    else {
                        forest.push(T.make("member " + i, e_6.left));
                    }
                }
                return E.left(forest);
            }
        }
    };
}
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var URI = 'Decoder';
/**
 * @since 3.0.0
 */
export var decoder = {
    URI: URI,
    map: function (fa, f) { return ({
        decode: function (u) { return E.either.map(fa.decode(u), f); }
    }); },
    of: function (a) { return ({
        decode: function () { return E.right(a); }
    }); },
    ap: function (fab, fa) { return ({
        decode: function (u) { return E.either.ap(fab.decode(u), fa.decode(u)); }
    }); },
    alt: function (fx, fy) { return ({
        decode: function (u) { return E.either.alt(fx.decode(u), function () { return fy().decode(u); }); }
    }); },
    zero: function () { return never; },
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
var _a = pipeable(decoder), alt = _a.alt, ap = _a.ap, apFirst = _a.apFirst, apSecond = _a.apSecond, map = _a.map;
export { 
/**
 * @since 3.0.0
 */
alt, 
/**
 * @since 3.0.0
 */
ap, 
/**
 * @since 3.0.0
 */
apFirst, 
/**
 * @since 3.0.0
 */
apSecond, 
/**
 * @since 3.0.0
 */
map };
