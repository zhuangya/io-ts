import * as t from '../src';
export declare const T5: t.InterfaceType<{
    e: t.InterfaceType<{
        d: t.InterfaceType<{
            c: t.InterfaceType<{
                b: t.InterfaceType<{
                    a: t.StringType;
                }>;
            }>;
        }>;
    }>;
}>;
export declare const P5: t.PartialType<{
    e: t.PartialType<{
        d: t.PartialType<{
            c: t.PartialType<{
                b: t.PartialType<{
                    a: t.StringType;
                }>;
            }>;
        }>;
    }>;
}>;
export declare const D5: t.DictionaryType<t.StringType, t.DictionaryType<t.StringType, t.DictionaryType<t.StringType, t.DictionaryType<t.StringType, t.DictionaryType<t.StringType, t.NumberType>>>>>;
declare const _Person: t.InterfaceType<{
    name: t.StringType;
    age: t.NumberType;
}>;
export interface Person extends t.TypeOf<typeof _Person> {
}
export declare const Person: t.Type<Person, Person, unknown>;
export declare const TestPerson: t.InterfaceType<{
    person: t.Type<Person, Person, unknown>;
}>;
export {};
