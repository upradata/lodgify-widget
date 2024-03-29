import { useEffect, useMemo, useRef, useState } from 'react';
import moment, { Moment } from 'moment';

import type { CasedObject, CasedType, Key, KeyOf, ValueOf, TypeOf } from './util.types';


export const isInRange = (min: number, max: number) => (v: number) => min <= v && v <= max;

export const isDateInRange = (min: Moment, max: Moment) => (date: Moment) => {
    return true &&
        isInRange(min.date(), max.date())(date.date()) &&
        isInRange(min.month(), max.month())(date.month()) &&
        isInRange(min.year(), max.year())(date.year());
};


export const getNbOfNights = (start: Moment, end: Moment) => moment.duration(end.startOf('day').diff(start.startOf('day'))).asDays();


export function usePrevious<T>(value: T, init: T = null): T | null {
    const ref = useRef<T>(init);

    useEffect(() => {
        ref.current = value;
    }, [ value ]);

    return ref.current;
}

export type NewValueListener<T> = (prevValue: T, newValue: T) => void;

export function usePreviousListener<T>(value: T, options: { init?: T | undefined | null; isSame?: (v1: T, v2: T) => boolean; } = {}) {
    const { init = null, isSame = Object.is } = options;

    const [ prevValue, setPrevValue ] = useState(init);
    // const [ listeners, setListeners ] = useState<NewValueListener<T>[]>([]);
    let listeners = useRef<NewValueListener<T>[]>([]);

    if (isSame(prevValue, value)) {
        setPrevValue(value);
        listeners.current.forEach(listener => listener(prevValue, value));
    }

    // useEffect(() => { listeners = []; }, []);

    return {
        addListener: (listener: NewValueListener<T>) => { listeners.current = [ ...listeners.current, listener ]; },
        removeListener: (listener: NewValueListener<T>) => { listeners.current = listeners.current.filter(l => l !== listener); },
        removeAll: () => { listeners.current = []; }
    };
}

export const useActionsAfterRender = () => {
    const actionsRunner = useMemo(() => {
        type Action = () => void;
        let actions = [] as Action[];

        return {
            add: (action: Action) => { actions = [ ...actions, action ]; },
            reset: () => { actions = []; },
            run: () => {
                actions.forEach(action => action());
                actions = [];
            }
        };
    }, []);

    useEffect(() => { actionsRunner.run(); });

    return useRef(actionsRunner).current;
};



// apparently the fastest and correct for rounding with 0.5
export const round = (num = 0, precision = 2) => +(Math.round(+`${num}e${precision}`) + `e-${precision}`);


export const localizedPrice = (price: number, currency: string = 'EUR') => new Intl.NumberFormat('fr', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
}).format(price);


const localeData = moment.localeData();

export const localizedDate = (date: Moment, options: { longDateFormat?: moment.LongDateFormatKey; defaultFormat?: string; } = {}) => {
    const format = localeData.longDateFormat(options.longDateFormat || 'L');
    /* 
    For 'fr', we have
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    } */
    // + ' ' + localeData.longDateFormat('LT');

    return moment(date, format).format(options.defaultFormat || 'YYYY/MM/DD');
};




type Fragments<O extends {}, P, ConsumedKeys extends Key = ''> = P extends [] ? [] : P extends [ infer T, ...infer Rest ] ?
    T extends ReadonlyArray<keyof O> ? [ Pick<O, Exclude<T[ number ] & keyof O, ConsumedKeys>>, ...Fragments<O, Rest, ConsumedKeys | T[ number ] & keyof O> ] :
    T extends new (...args: any) => any ? [ Pick<O, Exclude<keyof InstanceType<T> & keyof O, ConsumedKeys>>, ...Fragments<O, Rest, ConsumedKeys | keyof InstanceType<T> & keyof O> ] :
    T extends {} ? [ Pick<O, Exclude<keyof T & keyof O, ConsumedKeys>>, ...Fragments<O, Rest, ConsumedKeys | keyof T & keyof O> ] :
    Fragments<O, Rest> :
    [];
/* type Test<P> = P extends [ infer T, ...infer Rest ] ? [ T, Rest ] : 2;
type A = Test<[]>;
type B = Fragments<{ a: 1; b: 2; c: 3; }, [ [ 'a', 'c' ], [ 'b' ] ]>;
 */

type MergeFragmentsKeys<P> = P extends [] ? [] : P extends [ infer T, ...infer Rest ] ?
    T extends ReadonlyArray<Key> ? [ ...T, ...MergeFragmentsKeys<Rest> ] :
    T extends new (...args: any) => any ? [ keyof InstanceType<T>, ...MergeFragmentsKeys<Rest> ] :
    T extends {} ? [ keyof T, ...MergeFragmentsKeys<Rest> ] :
    MergeFragmentsKeys<Rest> :
    [];

type ComplementaryKeys<O extends {}, P extends Key[]> = Omit<O, P[ number ]>;



const isClass = (v: any): v is new (...args: any) => any => {
    const names = Object.getOwnPropertyNames(v);
    return names.includes('prototype') && !names.includes('arguments');
};

type FragmentPart<T> = ReadonlyArray<keyof T> | (new () => unknown) | Partial<T>;

export const fragments = <O extends {}, P extends FragmentPart<O>[]>(obj: O, ...parts: P): Fragments<O, [ ...P, ComplementaryKeys<O, MergeFragmentsKeys<P>> ]> => {
    type Part = (string | number | symbol)[];

    const keys = (part: any): Part => {
        if (Array.isArray(part))
            return part as string[];

        if (isClass(part))
            return Reflect.ownKeys(new part());

        return Reflect.ownKeys(part);
    };

    const filter = (part: Part) => part.reduce((o, k) => k in obj ? { ...o, [ k ]: obj[ k ] } : o, {});

    const { fragments, keys: fragmentsKeys } = parts.reduce(({ fragments, keys: fragmentKeys }, part) => {
        const partKeys = keys(part);
        const fragment = filter(partKeys);

        return {
            fragments: [ ...fragments, fragment ],
            keys: [ ...fragmentKeys, ...partKeys ]
        };
    }, { fragments: [] as object[], keys: [] as string[] });

    const rest = Reflect.ownKeys(obj).reduce((o, k) => !fragmentsKeys.includes(k) ? { ...o, [ k ]: obj[ k ] } : o, {});

    return [ ...fragments, rest ] as any;
};

// const [ a, b, c ] = fragments({ a: 1, b: 2, c: 3, d: 4 } as const, [ 'a', 'c' ] as const, [ 'b' ] as const);

/* console.log(fragments(
    { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 } as const,
    [ 'a', 'c' ] as const,
    [ 'b' ] as const,
    { d: undefined } as const,
    class { e = 1; f = undefined; }
)); */

/* const o = fragments({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 } as const, [ 'a', 'c' ] as const, [ 'b' ] as const, { d: undefined } as const, class { e; f; });

o[ 0 ].a === 1;
// o[ 0 ].b === 1;
o[ 0 ].c === 3;

o[ 1 ].b === 2;

o[ 2 ].d === 4;

o[ 3 ].e === 5;
o[ 3 ].f === 6; */


// const o2 = fragments({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 } as const, [ 'a', 'c' ], [ 'b' ], { d: undefined }, class { e; f; });



/* export const partition = <O, P extends FragmentPart<O>>(o: O, p: P): Fragments<O, [ P, ComplementaryKeys<O, P> ]> => {
    const [ oP ] = fragments(o, p);
    const opKeys = Reflect.ownKeys(oP);

    const rest = Object.keys(o).reduce((rest, k) => opKeys.includes(k) ? rest : { ...rest, [ k ]: o[ k ] }, {});

    return [ oP, rest ] as any;
};
 */

// const [ a, b ] = partition({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 } as const, [ 'a', 'c' ] as const);
// const [ a, b ] = partition({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 } as const, class { a; c; });

export const debounce = <Fn extends Function>(fn: Fn, wait: number = 0, immediate: boolean = false): Fn & { cancel: () => void; } => {
    let timeout: number;

    function debouncedFn(...args: unknown[]) {
        const context = this;

        const later = () => {
            timeout = null;
            if (!immediate)
                fn.apply(context, args);
        };

        const callNow = immediate && !timeout;

        clearTimeout(timeout);
        timeout = window.setTimeout(later, wait);

        if (callNow) {
            return fn.apply(context, args);
        }
    };

    debouncedFn.cancel = () => {
        clearTimeout(timeout);
    };

    return debouncedFn as any;
};


export const getElementList = <T>(list: T[], select: (item: T) => boolean): T | undefined => list.find(select);


const isObjectOrArray = (v: unknown) => v !== null && typeof v === 'object';

export const isSame = <T, U>(value1: T, value2: U): boolean => {
    if (isObjectOrArray(value1) || isObjectOrArray(value2)) {
        return Object.is(value1, value2);
    }

    return Object.entries(value1).every(([ k, v ]) => k in (value2 as {}) && v === value2[ k ]);
};


export const plural = (n: number, s: string) => `${s}${n > 1 ? 's' : ''}`;


export const map = <T extends object, M extends (key: KeyOf<T>, value: ValueOf<T>) => [ Key, (unknown | typeof map_KEEP_VALUE)?]>(
    o: T, mapping: M, options: { mode?: 'recursive'; } = {}
): { [ K in ReturnType<M>[ 0 ] ]: ReturnType<M>[ 1 ]; } => {

    const { mode } = options;

    const next = (oldValue: unknown, newValue: unknown) => {

        if (mode === 'recursive') {

            if (newValue === map.KEEP_VALUE) {

                if (typeof oldValue === 'object') {
                    if (Array.isArray(oldValue))
                        return oldValue.map(v => _map(v));

                    return _map(oldValue);
                }

                return oldValue;
            }

            return newValue;
        }


        if (newValue === map.KEEP_VALUE)
            return oldValue;

        return newValue;
    };

    const _map = (o: {}) => {
        if (typeof o !== 'object' || Array.isArray(o) || o === null)
            return o;

        return Object.entries(o).reduce((mappedO, [ k, v ]) => {
            const m = mapping(k as KeyOf<T>, v);
            const [ mappedK, mappedV ] = m.length === 2 ? m : [ m[ 0 ], map.KEEP_VALUE ];

            if (typeof mappedK === 'undefined' || mappedK === null)
                return mappedO;

            return { ...mappedO, [ mappedK ]: next(v, mappedV) };
        }, {});
    };

    return _map(o);
};


const map_KEEP_VALUE: unique symbol = Symbol('map keep value');
map.KEEP_VALUE = map_KEEP_VALUE;


type FilterParameters<T extends object | any[]> = T extends any[] ? [ number, T[ number ] ] : [ keyof T, T[ keyof T ] ];
export const filter = <T extends object | any[]>(v: T, filter: (k: FilterParameters<T>[ 0 ], v: FilterParameters<T>[ 1 ]) => boolean): T => {
    const isArray = Array.isArray(v);

    const merge = (v: T, [ key, value ]: [ Key, unknown ]): T => {
        if (isArray)
            return [ ...(v as any[]), value ] as any;

        return { ...v, [ key ]: value };
    };

    return Object.entries(v).reduce((filteredV, [ k, v ]) => {
        const keep = filter(k as any, v);
        return keep ? merge(filteredV, [ k, v ]) : filteredV;
    }, (isArray ? [] : {}) as T);
};


export const removeType = <T extends object | any[]>(v: T, type: TypeOf): T => {
    return filter(v, (_, v) => typeof v !== type);
};

export const kebabCase = (s: string, sep: '-' | '_' = '_') => s.trim()
    .replaceAll(/(\s+)/g, sep)
    .replaceAll(/[A-Z]/g, (s, index) => `${index === 0 ? '' : sep}${s.toLowerCase()}`)
    .replaceAll(new RegExp(`${sep}+`, 'g'), sep);

export const camelCase = (s: string, sep: '-' | '_' = '_') => s.trim().replaceAll(new RegExp(`${sep}.`, 'g'), s => s[ 1 ].toUpperCase());

export const toCasedObject = <O extends object, T extends CasedType>(o: O, type: T): CasedObject<O, T> => {
    const casing = type === 'camel' ? camelCase : kebabCase;
    return map(o, k => [ casing(k as string) ], { mode: 'recursive' }) as any;
};

/* console.log(kebabCase('theFullName'));
console.log(camelCase('theFullName'));

console.log(kebabCase('the_full_name'));
console.log(camelCase('the_Full_Name'));

console.log(toCasedObject({
    theFullName: 'Thomas Milotti',
    anotherProp: {
        aSmallProp: 1,
        anotherProp: {
            x_y: 1
        }
    }
}, 'kebab'));

console.log(toCasedObject({
    the_full_name: 'Thomas Milotti',
    another_prop: { a_small_prop: 1, another_prop: { xY: 1 } }
}, 'camel')); */

/* type MergeIstances<C extends (new () => any)[], Merge = {}> = C extends [ infer Ctor, ...infer Rest ] ?
    Rest extends (new () => any)[] ? Ctor extends (new () => any) ?
    MergeIstances<Rest, Merge & Ctor> : never : never :
    Merge;

export const mixin = <C extends (new () => any)[]>(...classes: C): new () => MergeIstances<C> => {
    const { prototype, constructors } = classes.reduce((acc, Class) => ({
        prototype: [ ...acc.prototype, ...Class.prototype ],
        constructors: [ ...acc.constructors, Class ]
    }), { prototype: [], constructors: [] as (new () => any)[] });


    function SuperClass() {
        constructors.forEach(C => C.apply(this));
    }

    Object.setPrototypeOf(SuperClass.prototype, prototype);
    SuperClass.name = constructors.map(c => c.name).join(', ');

    return SuperClass as any;
};

class A { a = 1; }
class B { b = 2; }

const C = mixin(A, B);
 */


export const errorToString = (e: unknown) => e instanceof Error ? e.message : typeof e === 'string' ? e : JSON.stringify(e);


export const getCityFromLocale = () => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneParts = userTimeZone.split("/");
    // const userRegion = tzArr[ 0 ];
    const userCity = timezoneParts.at(-1);

    return userCity;
};


export const hasProp = <T extends {}>(o: T, prop: keyof T): boolean => prop in o;


export const isNil = (v: unknown): v is undefined | null => typeof v === 'undefined' || v === null;


export const joinToString = (options: { tostring?: (v: unknown) => string; filter?: (v: unknown) => boolean; } = {}) => {
    const { tostring: valueToString = v => `${v}`, filter = _v => true } = options;

    return (sep: string, ...parts: unknown[]) => {
        const strings = parts.reduce<string[]>((strings, part) => {
            if (!filter(part))
                return strings;

            return [ ...strings, valueToString(part) ];
        }, []);

        return strings.join(sep);
    };
};

// console.log(joinToString({ filter: v => !!v })('/', '', false, 'caca', '', 'pipi', true, 11));
