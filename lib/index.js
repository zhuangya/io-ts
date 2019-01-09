"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("fp-ts/lib/Either");
var function_1 = require("fp-ts/lib/function");
exports.identity = function_1.identity;
var getNameFromProps = function (props) {
    return "{ " + Object.keys(props)
        .map(function (k) { return k + ": " + props[k].name; })
        .join(', ') + " }";
};
var hasOwnProperty = Object.prototype.hasOwnProperty;
var isEmpty = function (o) {
    for (var _k in o) {
        return false;
    }
    return true;
};
exports.leaf = function (actual, expected) { return ({
    type: 'Leaf',
    actual: actual,
    expected: expected
}); };
exports.labeledProduct = function (actual, expected, errors) { return ({
    type: 'LabeledProduct',
    actual: actual,
    expected: expected,
    errors: errors
}); };
exports.indexedProduct = function (actual, expected, errors) { return ({
    type: 'IndexedProduct',
    actual: actual,
    expected: expected,
    errors: errors
}); };
exports.and = function (expected, errors) { return ({
    type: 'And',
    expected: expected,
    errors: errors
}); };
exports.or = function (expected, errors) { return ({
    type: 'Or',
    expected: expected,
    errors: errors
}); };
exports.success = Either_1.right;
exports.failure = function (u, expected) { return Either_1.left(exports.leaf(u, expected)); };
var Type = /** @class */ (function () {
    function Type(
    /** a unique name for this runtime type */
    name, 
    /** a custom type guard */
    is, 
    /** succeeds if a value of type `I` can be decoded to a value of type `A` */
    validate, 
    /** converts a value of type `A` to a value of type `O` */
    encode) {
        var _this = this;
        this.name = name;
        this.is = is;
        this.validate = validate;
        this.encode = encode;
        this.decode = function (u) { return validate(u, _this.name); };
    }
    return Type;
}());
exports.Type = Type;
var isNull = function (u) { return u === null; };
var NullType = /** @class */ (function (_super) {
    __extends(NullType, _super);
    function NullType() {
        var _this = _super.call(this, 'null', isNull, function (u, c) { return (isNull(u) ? Either_1.right(u) : exports.failure(u, c)); }, function_1.identity) || this;
        _this._tag = 'NullType';
        return _this;
    }
    return NullType;
}(Type));
exports.NullType = NullType;
var nullType = new NullType();
exports.null = nullType;
var isUndefined = function (u) { return u === void 0; };
var UndefinedType = /** @class */ (function (_super) {
    __extends(UndefinedType, _super);
    function UndefinedType() {
        var _this = _super.call(this, 'undefined', isUndefined, function (u, c) { return (isUndefined(u) ? Either_1.right(u) : exports.failure(u, c)); }, function_1.identity) || this;
        _this._tag = 'UndefinedType';
        return _this;
    }
    return UndefinedType;
}(Type));
exports.UndefinedType = UndefinedType;
var undefinedType = new UndefinedType();
exports.undefined = undefinedType;
var isString = function (u) { return typeof u === 'string'; };
var StringType = /** @class */ (function (_super) {
    __extends(StringType, _super);
    function StringType() {
        var _this = _super.call(this, 'string', isString, function (u, c) { return (isString(u) ? Either_1.right(u) : exports.failure(u, c)); }, function_1.identity) || this;
        _this._tag = 'StringType';
        return _this;
    }
    return StringType;
}(Type));
exports.StringType = StringType;
exports.string = new StringType();
var isNumber = function (u) { return typeof u === 'number'; };
var NumberType = /** @class */ (function (_super) {
    __extends(NumberType, _super);
    function NumberType() {
        var _this = _super.call(this, 'number', isNumber, function (u, c) { return (isNumber(u) ? Either_1.right(u) : exports.failure(u, c)); }, function_1.identity) || this;
        _this._tag = 'NumberType';
        return _this;
    }
    return NumberType;
}(Type));
exports.NumberType = NumberType;
exports.number = new NumberType();
var isBoolean = function (u) { return typeof u === 'boolean'; };
var BooleanType = /** @class */ (function (_super) {
    __extends(BooleanType, _super);
    function BooleanType() {
        var _this = _super.call(this, 'boolean', isBoolean, function (u, c) { return (isBoolean(u) ? Either_1.right(u) : exports.failure(u, c)); }, function_1.identity) || this;
        _this._tag = 'BooleanType';
        return _this;
    }
    return BooleanType;
}(Type));
exports.BooleanType = BooleanType;
exports.boolean = new BooleanType();
var UnknownType = /** @class */ (function (_super) {
    __extends(UnknownType, _super);
    function UnknownType() {
        var _this = _super.call(this, 'unknown', function (_) { return true; }, Either_1.right, function_1.identity) || this;
        _this._tag = 'UnknownType';
        return _this;
    }
    return UnknownType;
}(Type));
exports.UnknownType = UnknownType;
exports.unknown = new UnknownType();
var AnyArrayType = /** @class */ (function (_super) {
    __extends(AnyArrayType, _super);
    function AnyArrayType() {
        var _this = _super.call(this, 'Array', Array.isArray, function (u, c) { return (Array.isArray(u) ? Either_1.right(u) : exports.failure(u, c)); }, function_1.identity) || this;
        _this._tag = 'AnyArrayType';
        return _this;
    }
    return AnyArrayType;
}(Type));
exports.AnyArrayType = AnyArrayType;
var arrayType = new AnyArrayType();
exports.Array = arrayType;
var isAnyDictionary = function (u) { return u !== null && typeof u === 'object'; };
var AnyDictionaryType = /** @class */ (function (_super) {
    __extends(AnyDictionaryType, _super);
    function AnyDictionaryType() {
        var _this = _super.call(this, 'Dictionary', isAnyDictionary, function (i, c) { return (isAnyDictionary(i) ? Either_1.right(i) : exports.failure(i, c)); }, function_1.identity) || this;
        _this._tag = 'AnyDictionaryType';
        return _this;
    }
    return AnyDictionaryType;
}(Type));
exports.AnyDictionaryType = AnyDictionaryType;
exports.Dictionary = new AnyDictionaryType();
var LiteralType = /** @class */ (function (_super) {
    __extends(LiteralType, _super);
    function LiteralType(name, is, decode, encode, value) {
        var _this = _super.call(this, name, is, decode, encode) || this;
        _this.value = value;
        _this._tag = 'LiteralType';
        return _this;
    }
    return LiteralType;
}(Type));
exports.LiteralType = LiteralType;
exports.literal = function (value, name) {
    if (name === void 0) { name = JSON.stringify(value); }
    var is = function (u) { return u === value; };
    return new LiteralType(name, is, function (u, c) { return (is(u) ? Either_1.right(value) : exports.failure(u, c)); }, function_1.identity, value);
};
var KeyofType = /** @class */ (function (_super) {
    __extends(KeyofType, _super);
    function KeyofType(name, is, decode, encode, keys) {
        var _this = _super.call(this, name, is, decode, encode) || this;
        _this.keys = keys;
        _this._tag = 'KeyofType';
        return _this;
    }
    return KeyofType;
}(Type));
exports.KeyofType = KeyofType;
exports.keyof = function (keys, name) {
    if (name === void 0) { name = Object.keys(keys)
        .map(function (k) { return JSON.stringify(k); })
        .join(' | '); }
    var is = function (u) { return exports.string.is(u) && hasOwnProperty.call(keys, u); };
    return new KeyofType(name, is, function (u, c) { return (is(u) ? Either_1.right(u) : exports.failure(u, c)); }, function_1.identity, keys);
};
var InterfaceType = /** @class */ (function (_super) {
    __extends(InterfaceType, _super);
    function InterfaceType(name, is, decode, encode, props) {
        var _this = _super.call(this, name, is, decode, encode) || this;
        _this.props = props;
        _this._tag = 'InterfaceType';
        return _this;
    }
    return InterfaceType;
}(Type));
exports.InterfaceType = InterfaceType;
exports.type = function (props, name) {
    if (name === void 0) { name = getNameFromProps(props); }
    var keys = Object.keys(props);
    var types = keys.map(function (key) { return props[key]; });
    var len = keys.length;
    return new InterfaceType(name, function (u) {
        if (!exports.Dictionary.is(u)) {
            return false;
        }
        for (var i = 0; i < len; i++) {
            var k = keys[i];
            if (!hasOwnProperty.call(u, k) || !types[i].is(u[k])) {
                return false;
            }
        }
        return true;
    }, function (u, c) {
        var dictionaryResult = exports.Dictionary.validate(u, c);
        if (dictionaryResult.isLeft()) {
            return dictionaryResult;
        }
        else {
            var o = dictionaryResult.value;
            var a = {};
            var errors = {};
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var result = types[i].decode(o[k]);
                if (result.isLeft()) {
                    errors[k] = result.value;
                }
                else {
                    a[k] = result.value;
                }
            }
            return isEmpty(errors) ? Either_1.right(a) : Either_1.left(exports.labeledProduct(u, c, errors));
        }
    }, function (a) {
        var s = {};
        for (var i = 0; i < len; i++) {
            var k = keys[i];
            s[k] = types[i].encode(a[k]);
        }
        return s;
    }, props);
};
exports.interface = exports.type;
var PartialType = /** @class */ (function (_super) {
    __extends(PartialType, _super);
    function PartialType(name, is, decode, encode, props) {
        var _this = _super.call(this, name, is, decode, encode) || this;
        _this.props = props;
        _this._tag = 'PartialType';
        return _this;
    }
    return PartialType;
}(Type));
exports.PartialType = PartialType;
exports.partial = function (props, name) {
    if (name === void 0) { name = "Partial<" + getNameFromProps(props) + ">"; }
    var keys = Object.keys(props);
    var types = keys.map(function (key) { return props[key]; });
    var len = keys.length;
    var partials = {};
    for (var i = 0; i < len; i++) {
        partials[keys[i]] = exports.union([undefinedType, types[i]]);
    }
    return new PartialType(name, function (u) {
        if (!exports.Dictionary.is(u)) {
            return false;
        }
        for (var i = 0; i < len; i++) {
            var k = keys[i];
            if (!partials[k].is(u[k])) {
                return false;
            }
        }
        return true;
    }, function (u, c) {
        var dictionaryResult = exports.Dictionary.validate(u, c);
        if (dictionaryResult.isLeft()) {
            return dictionaryResult;
        }
        else {
            var o = dictionaryResult.value;
            var a = {};
            var errors = {};
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var result = partials[k].decode(o[k]);
                if (result.isLeft()) {
                    errors[k] = result.value;
                }
                else {
                    var v = result.value;
                    if (v !== undefined || hasOwnProperty.call(o, k)) {
                        a[k] = v;
                    }
                }
            }
            return isEmpty(errors) ? Either_1.right(a) : Either_1.left(exports.labeledProduct(u, c, errors));
        }
    }, function (a) {
        var s = {};
        for (var i = 0; i < len; i++) {
            var k = keys[i];
            var ak = a[k];
            if (ak !== undefined) {
                s[k] = types[i].encode(ak);
            }
            else if (hasOwnProperty.call(a, k)) {
                s[k] = undefined;
            }
        }
        return s;
    }, props);
};
var UnionType = /** @class */ (function (_super) {
    __extends(UnionType, _super);
    function UnionType(name, is, decode, encode, types) {
        var _this = _super.call(this, name, is, decode, encode) || this;
        _this.types = types;
        _this._tag = 'UnionType';
        return _this;
    }
    return UnionType;
}(Type));
exports.UnionType = UnionType;
var isLiteralType = function (type) {
    return type._tag === 'LiteralType';
};
var isInterfaceType = function (type) { return type._tag === 'InterfaceType'; };
var isIntersectionType = function (type) {
    return type._tag === 'IntersectionType';
};
var isUnionType = function (type) {
    return type._tag === 'UnionType';
};
/** @internal */
exports.getTypeIndex = function (type, override) {
    if (override === void 0) { override = type; }
    var _a;
    var r = {};
    if (isInterfaceType(type)) {
        for (var k in type.props) {
            var prop = type.props[k];
            if (isLiteralType(prop)) {
                var value = prop.value;
                r[k] = [[value, override]];
            }
        }
    }
    else if (isIntersectionType(type)) {
        var types = type.types;
        r = exports.getTypeIndex(types[0], type);
        for (var i = 1; i < types.length; i++) {
            var ti = exports.getTypeIndex(types[i], type);
            for (var k in ti) {
                if (r.hasOwnProperty(k)) {
                    (_a = r[k]).push.apply(_a, ti[k]);
                }
                else {
                    r[k] = ti[k];
                }
            }
        }
    }
    else if (isUnionType(type)) {
        return exports.getIndex(type.types);
    }
    return r;
};
/** @internal */
exports.getIndex = function (types) {
    var r = exports.getTypeIndex(types[0]);
    for (var i = 1; i < types.length; i++) {
        var ti = exports.getTypeIndex(types[i]);
        for (var k in r) {
            if (ti.hasOwnProperty(k)) {
                var ips = r[k];
                var tips = ti[k];
                var _loop_1 = function (j) {
                    var tip = tips[j];
                    var ii = ips.findIndex(function (_a) {
                        var v = _a[0];
                        return v === tip[0];
                    });
                    if (ii === -1) {
                        ips.push(tip);
                    }
                    else if (tips[ii][1] !== ips[ii][1]) {
                        delete r[k];
                        return "break-loop";
                    }
                };
                loop: for (var j = 0; j < tips.length; j++) {
                    var state_1 = _loop_1(j);
                    switch (state_1) {
                        case "break-loop": break loop;
                    }
                }
            }
            else {
                delete r[k];
            }
        }
    }
    return r;
};
var first = function (index) {
    for (var k in index) {
        return [k, index[k]];
    }
    return undefined;
};
exports.union = function (types, name) {
    if (name === void 0) { name = "(" + types.map(function (type) { return type.name; }).join(' | ') + ")"; }
    var len = types.length;
    var index = first(exports.getIndex(types));
    if (index) {
        var tag_1 = index[0];
        var pairs_1 = index[1];
        var tagName_1 = pairs_1.map(function (_a) {
            var v = _a[0];
            return JSON.stringify(v);
        }).join(' | ');
        var find_1 = function (tagValue) { return pairs_1.find(function (_a) {
            var v = _a[0];
            return v === tagValue;
        }); };
        return new UnionType(name, function (u) {
            if (!exports.Dictionary.is(u)) {
                return false;
            }
            var pair = find_1(u[tag_1]);
            return pair ? pair[1].is(u) : false;
        }, function (u, c) {
            var _a;
            var dictionaryResult = exports.Dictionary.validate(u, c);
            if (dictionaryResult.isLeft()) {
                return dictionaryResult;
            }
            else {
                var d = dictionaryResult.value;
                var tagValue = d[tag_1];
                var pair = find_1(tagValue);
                if (!pair) {
                    return Either_1.left(exports.labeledProduct(u, c, (_a = {}, _a[tag_1] = exports.leaf(tagValue, tagName_1), _a)));
                }
                else {
                    var typeResult = pair[1].decode(d);
                    if (typeResult.isLeft()) {
                        return Either_1.left(exports.and(c, [typeResult.value]));
                    }
                    else {
                        return exports.success(typeResult.value);
                    }
                }
            }
        }, function (a) { return find_1(a[tag_1])[1].encode(a); }, types);
    }
    else {
        return new UnionType(name, function (u) { return types.some(function (type) { return type.is(u); }); }, function (u, c) {
            var errors = [];
            for (var i = 0; i < len; i++) {
                var type_1 = types[i];
                var result = type_1.decode(u);
                if (result.isRight()) {
                    return result;
                }
                else {
                    errors.push(result.value);
                }
            }
            return Either_1.left(exports.or(c, errors));
        }, function (a) {
            var i = 0;
            for (; i < len - 1; i++) {
                var type_2 = types[i];
                if (type_2.is(a)) {
                    return type_2.encode(a);
                }
            }
            return types[i].encode(a);
        }, types);
    }
};
var ArrayType = /** @class */ (function (_super) {
    __extends(ArrayType, _super);
    function ArrayType(name, is, decode, encode, type) {
        var _this = _super.call(this, name, is, decode, encode) || this;
        _this.type = type;
        _this._tag = 'ArrayType';
        return _this;
    }
    return ArrayType;
}(Type));
exports.ArrayType = ArrayType;
exports.array = function (type, name) {
    if (name === void 0) { name = "Array<" + type.name + ">"; }
    return new ArrayType(name, function (u) { return arrayType.is(u) && u.every(type.is); }, function (u, c) {
        var arrayResult = arrayType.validate(u, c);
        if (arrayResult.isLeft()) {
            return arrayResult;
        }
        else {
            var us = arrayResult.value;
            var len = us.length;
            var a = us;
            var errors = [];
            for (var i = 0; i < len; i++) {
                var x = us[i];
                var result = type.decode(x);
                if (result.isLeft()) {
                    errors.push([i, result.value]);
                }
                else {
                    var vx = result.value;
                    if (vx !== x) {
                        if (a === us) {
                            a = us.slice();
                        }
                        a[i] = vx;
                    }
                }
            }
            return errors.length === 0 ? Either_1.right(a) : Either_1.left(exports.indexedProduct(u, c, errors));
        }
    }, type.encode === function_1.identity ? function_1.identity : function (a) { return a.map(type.encode); }, type);
};
var IntersectionType = /** @class */ (function (_super) {
    __extends(IntersectionType, _super);
    function IntersectionType(name, is, decode, encode, types) {
        var _this = _super.call(this, name, is, decode, encode) || this;
        _this.types = types;
        _this._tag = 'IntersectionType';
        return _this;
    }
    return IntersectionType;
}(Type));
exports.IntersectionType = IntersectionType;
var mergeAll = function (us) {
    var r = us[0];
    for (var i = 1; i < us.length; i++) {
        var u = us[i];
        if (u !== r) {
            r = Object.assign(r, u);
        }
    }
    return r;
};
function intersection(types, name) {
    if (name === void 0) { name = "(" + types.map(function (type) { return type.name; }).join(' & ') + ")"; }
    var len = types.length;
    return new IntersectionType(name, function (u) { return types.every(function (type) { return type.is(u); }); }, function (u, c) {
        var us = [];
        var errors = [];
        for (var i = 0; i < len; i++) {
            var type_3 = types[i];
            var result = type_3.decode(u);
            if (result.isLeft()) {
                errors.push(result.value);
            }
            else {
                us.push(result.value);
            }
        }
        return errors.length === 0 ? Either_1.right(mergeAll(us)) : Either_1.left(exports.and(c, errors));
    }, function (a) { return mergeAll(types.map(function (type) { return type.encode(a); })); }, types);
}
exports.intersection = intersection;
var TupleType = /** @class */ (function (_super) {
    __extends(TupleType, _super);
    function TupleType(name, is, decode, encode, types) {
        var _this = _super.call(this, name, is, decode, encode) || this;
        _this.types = types;
        _this._tag = 'TupleType';
        return _this;
    }
    return TupleType;
}(Type));
exports.TupleType = TupleType;
function tuple(types, name) {
    if (name === void 0) { name = "[" + types.map(function (type) { return type.name; }).join(', ') + "]"; }
    var len = types.length;
    return new TupleType(name, function (u) { return arrayType.is(u) && u.length === len && types.every(function (type, i) { return type.is(u[i]); }); }, function (u, c) {
        var arrayResult = arrayType.validate(u, c);
        if (arrayResult.isLeft()) {
            return arrayResult;
        }
        else {
            var us = arrayResult.value;
            var t = [];
            var errors = [];
            for (var i = 0; i < len; i++) {
                var a = us[i];
                var type_4 = types[i];
                var result = type_4.decode(a);
                if (result.isLeft()) {
                    errors.push([i, result.value]);
                }
                else {
                    t[i] = result.value;
                }
            }
            return errors.length === 0 ? Either_1.right(t) : Either_1.left(exports.indexedProduct(u, c, errors));
        }
    }, function (a) { return types.map(function (type, i) { return type.encode(a[i]); }); }, types);
}
exports.tuple = tuple;
var DictionaryType = /** @class */ (function (_super) {
    __extends(DictionaryType, _super);
    function DictionaryType(name, is, decode, encode, domain, codomain) {
        var _this = _super.call(this, name, is, decode, encode) || this;
        _this.domain = domain;
        _this.codomain = codomain;
        _this._tag = 'DictionaryType';
        return _this;
    }
    return DictionaryType;
}(Type));
exports.DictionaryType = DictionaryType;
var isUnknownType = function (type) { return type._tag === 'UnknownType'; };
var isObject = function (r) { return Object.prototype.toString.call(r) !== '[object Object]'; };
exports.dictionary = function (domain, codomain, name) {
    if (name === void 0) { name = "{ [K in " + domain.name + "]: " + codomain.name + " }"; }
    return new DictionaryType(name, function (u) {
        if (!exports.Dictionary.is(u)) {
            return false;
        }
        if (!isUnknownType(codomain) && isObject(u)) {
            return false;
        }
        return Object.keys(u).every(function (k) { return domain.is(k) && codomain.is(u[k]); });
    }, function (u, c) {
        var dictionaryResult = exports.Dictionary.validate(u, c);
        if (dictionaryResult.isLeft()) {
            return dictionaryResult;
        }
        else {
            var o = dictionaryResult.value;
            if (!isUnknownType(codomain) && isObject(o)) {
                return exports.failure(u, c);
            }
            var a = {};
            var errors = {};
            var keys = Object.keys(o);
            var len = keys.length;
            var changed = false;
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var ok = o[k];
                var domainResult = domain.decode(k);
                if (domainResult.isLeft()) {
                    errors[k] = domainResult.value;
                }
                else {
                    var vk = domainResult.value;
                    changed = changed || vk !== k;
                    k = vk;
                    var codomainResult = codomain.decode(ok);
                    if (codomainResult.isLeft()) {
                        errors[k] = codomainResult.value;
                    }
                    else {
                        var vok = codomainResult.value;
                        changed = changed || vok !== ok;
                        a[k] = vok;
                    }
                }
            }
            return isEmpty(errors) ? Either_1.right((changed ? a : o)) : Either_1.left(exports.labeledProduct(u, c, errors));
        }
    }, domain.encode === function_1.identity && codomain.encode === function_1.identity
        ? function_1.identity
        : function (a) {
            var s = {};
            var keys = Object.keys(a);
            var len = keys.length;
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                s[domain.encode(k)] = codomain.encode(a[k]);
            }
            return s;
        }, domain, codomain);
};
var LazyType = /** @class */ (function (_super) {
    __extends(LazyType, _super);
    function LazyType(name, is, decode, encode, definition) {
        var _this = _super.call(this, name, is, decode, encode) || this;
        _this.definition = definition;
        _this._tag = 'LazyType';
        return _this;
    }
    return LazyType;
}(Type));
exports.LazyType = LazyType;
exports.lazy = function (name, definition) {
    var cache;
    var run = function () {
        if (!cache) {
            cache = definition();
            cache.name = name;
        }
        return cache;
    };
    return new LazyType(name, function (u) { return run().is(u); }, function (u) { return run().decode(u); }, function (a) { return run().encode(a); }, run);
};
