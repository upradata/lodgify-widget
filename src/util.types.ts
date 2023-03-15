import type React from 'react';


export type Key = string | number | symbol;

type TrimStart<S, Sep extends string = ' '> = S extends `${infer Char}${infer Rest}`
    ? Char extends Sep ? TrimStart<Rest, Sep> : S :
    S;

// type TestTrimStart = TrimStart<'      ABC'>;

// Better version handling more input in camel case and white spaces
export type KebabCase<S, Sep extends '-' | '_' | ' ' = '_', R extends string = ''> = S extends `${infer Char}${infer Rest}` ?
    Char extends ' ' ?
    (TrimStart<S, ' '> extends infer TrimmedS ? TrimmedS extends '' ? R : KebabCase<TrimmedS, Sep, R extends '' ? R : `${R}${Sep}`> : never) :
    // 2 cases: 1) rest=ab... 2) we have rest=Ab....
    (Rest extends Uncapitalize<Rest> ? KebabCase<Rest, Sep, `${R}${Uncapitalize<Char>}`> : KebabCase<Rest, Sep, `${R}${Uncapitalize<Char>}${Sep}`>)
    : R;

// type TestKebabCase = KebabCase<'      A  B  C     '>;


export type CamelCase<S, Sep extends '-' | '_' | ' ' = '_', R extends string = ''> = S extends `${infer Char}${infer Rest}` ?
    Char extends Sep | ' ' ?
    (
        TrimStart<S, Sep | ' '> extends infer TrimmedS ? TrimmedS extends '' ? R :
        TrimmedS extends `${infer C}${infer Rest2}` ? CamelCase<Rest2, Sep, `${R}${Capitalize<C>}`> : never :
        never
    ) :
    CamelCase<Rest, Sep, `${R}${Char}`>
    : R;

/* type AA = TrimStart<'   _ef  ', ' ' | '_'>;
type TestCamelCase = CamelCase<'   ab_   __  cdefg   _ijkl  '>;
type TestCamelCase2 = CamelCase<'   name_  __name  _jj '>; */


/* type FromEntries<E extends [ Key, unknown ], O = {}> = E extends [ infer K, infer V ] ? { [ _Key in K & Key ]: V } : never;
type A = FromEntries<[ 'name', 1 ] | [ 'id', 'value' ]>; */
type KeyCaseMap<T, Type extends 'kebab' | 'camel'> = keyof T extends infer K ? K extends keyof T ?
    Type extends 'kebab' ?
    KebabCase<K> extends infer CasedKey ? { [ _K in CasedKey & Key ]: K } : never :
    CamelCase<K> extends infer CasedKey ? { [ _K in CasedKey & Key ]: K } : never :
    never : never;

type Evaluate<O, Key> = O extends infer U ? U extends O ? U[ Key & keyof U ] : never : never;
/* type AA = KeyMap<{ nameName: 1; idIdId: 'value'; }>;
type BB = GetMappedKey<{ name: 1; } | { id: 'value'; }, 'name'>;
type CC = GetMappedKey<KeyMap<{ nameName: 1; idIdId: 'value'; }>, 'name'>; */

type NextIndex = [ 1, 2, 3, 4, 5, 6, 7, 8 ];
type IsObject<T> = T extends object ? T extends any[] ? false : true : false;
type InferArrayType<T> = T extends readonly (infer U)[] ? U : never;
type IsOptional<T, K extends keyof T> = T extends { [ Key in K ]-?: T[ Key ]; } ? false : true;

type OptionalProps<T> = keyof T extends infer K ? K extends keyof T ? IsOptional<T, K> extends true ? K : never : never : never;
type ExtractOptional<T> = { [ K in OptionalProps<T> ]?: T[ K ] };
type RequiredProps<T> = keyof T extends infer K ? K extends keyof T ? IsOptional<T, K> extends false ? K : never : never : never;
type ExtractRequired<T> = { [ K in RequiredProps<T> ]: T[ K ] };

// type AA = IsOptional<{ a?: 1; b: 2; }, 'a'>;
// type AA = RequiredProps<{ a?: 1; b: 2; }>;
type CasedKey<T, Type extends 'kebab' | 'camel'> = Type extends 'kebab' ? KebabCase<keyof T> : CamelCase<keyof T>;
export type _CasedObject<T, Type extends 'kebab' | 'camel', Index extends number> = T extends object ? Index extends 8 ? T : {
    [ K in CasedKey<T, Type> ]:
    T[ Evaluate<KeyCaseMap<T, Type>, K> ] extends infer V ?
    IsObject<V> extends true ? CasedObject<V, Type, NextIndex[ Index ]> :
    V extends any[] ? CasedObject<InferArrayType<V>, Type, NextIndex[ Index ]>[] : V :
    never
} : T;


export type CasedObject<T, Type extends 'kebab' | 'camel', Index extends number = 0> = T extends object ?
    Partial<_CasedObject<ExtractOptional<T>, Type, Index>> & _CasedObject<ExtractRequired<T>, Type, Index> :
    T;


export type CamelObject<T extends object> = CasedObject<T, 'camel'>;
export type KebabObject<T extends object> = CasedObject<T, 'kebab'>;


/* type Test = CasedObject<{ nameName: 1; idIdId: 'value'; }, 'kebab'>;
type Test2 = CasedObject<{ name___name: 1; id_Id_id: 'value'; }, 'camel'>; */
// type PP = ExtractRequired<{ nameName: 1; idIdId?: 'value'; nested: { aaaBBB?: 1, nestedNested?: { keyKeyKey: 2; }[]; }; }>;
// type Test = CasedObject<{ nameName: 1; idIdId?: 'value'; nested: { aaaBBB?: 1, nestedNested?: { keyKeyKey: 2; }[]; }; }, 'kebab'>;

export type PropsWithStyle<P = {}> = P & {
    style?: React.CSSProperties;
    className?: string;
};

export class PropsWithStyleBase {
    style?: React.CSSProperties;
    className?: string;
};


export class DateRange<T = string>{
    startDate: T;
    endDate: T;
}

export type Typify<T> = {
    [ K in keyof T ]: T[ K ]
};


export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type AddValueToObject<T, O> = {
    [ K in keyof T ]: T[ K ] & O
};

export type GetPropsFromReactElement<E> = E extends React.ElementType<infer P> ? E extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[ E ] : never : never;


export type Select<
    KeyName extends string | number | symbol,
    Union extends { [ K in KeyName ]: string },
    Name extends Union[ KeyName ]
> = Union extends infer U ? U extends Union ? U[ KeyName ] extends Name ? U : never : never : never;

export type SelectType<Union extends { type: string; }, Name extends Union[ 'type' ]> = Select<'type', Union, Name>;

/* type O = { type: 'a', value: 1; } | { type: 'b', value: 2; };
type S = Select<'type', O, 'a'>;
type S2 = SelectType<O, 'a'>; */


export type KeyOf<T> = T extends T ? keyof T : never;

export type ValueOf<T> = T extends T ? T[ keyof T ] : never;