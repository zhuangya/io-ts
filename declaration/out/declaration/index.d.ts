import * as t from '../src';
export declare const T5: t.InterfaceType<{
    e: t.InterfaceType<{
        d: t.InterfaceType<{
            c: t.InterfaceType<{
                b: t.InterfaceType<{
                    a: t.StringType;
                }, {
                    a: string;
                }, {
                    a: string;
                }, unknown>;
            }, {
                b: {
                    a: string;
                };
            }, {
                b: {
                    a: string;
                };
            }, unknown>;
        }, {
            c: {
                b: {
                    a: string;
                };
            };
        }, {
            c: {
                b: {
                    a: string;
                };
            };
        }, unknown>;
    }, {
        d: {
            c: {
                b: {
                    a: string;
                };
            };
        };
    }, {
        d: {
            c: {
                b: {
                    a: string;
                };
            };
        };
    }, unknown>;
}, {
    e: {
        d: {
            c: {
                b: {
                    a: string;
                };
            };
        };
    };
}, {
    e: {
        d: {
            c: {
                b: {
                    a: string;
                };
            };
        };
    };
}, unknown>;
export declare const P5: t.PartialType<{
    e: t.PartialType<{
        d: t.PartialType<{
            c: t.PartialType<{
                b: t.PartialType<{
                    a: t.StringType;
                }, {
                    a?: string | undefined;
                }, {
                    a?: string | undefined;
                }, unknown>;
            }, {
                b?: {
                    a?: string | undefined;
                } | undefined;
            }, {
                b?: {
                    a?: string | undefined;
                } | undefined;
            }, unknown>;
        }, {
            c?: {
                b?: {
                    a?: string | undefined;
                } | undefined;
            } | undefined;
        }, {
            c?: {
                b?: {
                    a?: string | undefined;
                } | undefined;
            } | undefined;
        }, unknown>;
    }, {
        d?: {
            c?: {
                b?: {
                    a?: string | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    }, {
        d?: {
            c?: {
                b?: {
                    a?: string | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    }, unknown>;
}, {
    e?: {
        d?: {
            c?: {
                b?: {
                    a?: string | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
}, {
    e?: {
        d?: {
            c?: {
                b?: {
                    a?: string | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
}, unknown>;
export declare const D5: t.DictionaryType<t.StringType, t.DictionaryType<t.StringType, t.DictionaryType<t.StringType, t.DictionaryType<t.StringType, t.DictionaryType<t.StringType, t.NumberType, {
    [x: string]: number;
}, {
    [x: string]: number;
}, unknown>, {
    [x: string]: {
        [x: string]: number;
    };
}, {
    [x: string]: {
        [x: string]: number;
    };
}, unknown>, {
    [x: string]: {
        [x: string]: {
            [x: string]: number;
        };
    };
}, {
    [x: string]: {
        [x: string]: {
            [x: string]: number;
        };
    };
}, unknown>, {
    [x: string]: {
        [x: string]: {
            [x: string]: {
                [x: string]: number;
            };
        };
    };
}, {
    [x: string]: {
        [x: string]: {
            [x: string]: {
                [x: string]: number;
            };
        };
    };
}, unknown>, {
    [x: string]: {
        [x: string]: {
            [x: string]: {
                [x: string]: {
                    [x: string]: number;
                };
            };
        };
    };
}, {
    [x: string]: {
        [x: string]: {
            [x: string]: {
                [x: string]: {
                    [x: string]: number;
                };
            };
        };
    };
}, unknown>;
declare const _Person: t.InterfaceType<{
    name: t.StringType;
    age: t.NumberType;
}, {
    name: string;
    age: number;
}, {
    name: string;
    age: number;
}, unknown>;
export interface Person extends t.TypeOf<typeof _Person> {
}
interface PersonType extends t.InterfaceTypeOf<typeof _Person, Person, Person> {
}
export declare const Person: PersonType;
export declare const TestPerson: t.InterfaceType<{
    person: PersonType;
}, {
    person: Person;
}, {
    person: Person;
}, unknown>;
export {};
