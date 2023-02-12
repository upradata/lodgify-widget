import moment, { Moment } from 'moment';
import { useEffect, useRef, useState } from 'react';

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

export function usePreviousListener<T>(value: T) {
    const [ prevValue, setPrevValue ] = useState(value);
    // const [ listeners, setListeners ] = useState<NewValueListener<T>[]>([]);
    let listeners = useRef<NewValueListener<T>[]>([]);

    if (prevValue !== value) {
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

// apparently the fastest and correct for rounding with 0.5
export const round = (num = 0, precision = 2) => +(Math.round(+`${num}e${precision}`) + `e-${precision}`);


export const localizedPrice = (price: number) => new Intl.NumberFormat('fr', {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
}).format(price);



type Fragments<O extends {}, P> = P extends [] ? [] : P extends [ infer T, ...infer Rest ] ?
    T extends ReadonlyArray<keyof O> ? [ Pick<O, T[ number ] & keyof O>, ...Fragments<O, Rest> ] :
    T extends new (...args: any) => any ? [ Pick<O, keyof InstanceType<T> & keyof O>, ...Fragments<O, Rest> ] :
    T extends {} ? [ Pick<O, keyof T & keyof O>, ...Fragments<O, Rest> ] :
    Fragments<O, Rest> :
    [];
/* type Test<P> = P extends [ infer T, ...infer Rest ] ? [ T, Rest ] : 2;
type A = Test<[]>;
type B = Fragments<{ a: 1; b: 2; c: 3; }, [ [ 'a', 'c' ], [ 'b' ] ]>;
 */




const isClass = (v: any): v is new (...args: any) => any => {
    const names = Object.getOwnPropertyNames(v);
    return names.includes('prototype') && !names.includes('arguments');
};

export const fragments = <O extends {}, P extends unknown[]>(obj: O, ...parts: P): Fragments<O, P> => {
    type Part = (string | number | symbol)[];

    const keys = (part: any): Part => {
        if (Array.isArray(part))
            return part as string[];

        if (isClass(part))
            return Reflect.ownKeys(new part());

        return Reflect.ownKeys(part);
    };

    const filter = (part: Part) => part.reduce((o, k) => k in obj ? { ...o, [ k ]: obj[ k ] } : o, {});

    const fragments = parts.reduce<unknown[]>((arr, part) => {
        const fragment = filter(keys(part));
        return [ ...arr, fragment ];
    }, []);

    return fragments as any;
};

// console.log(fragments({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 } as const, [ 'a', 'c' ] as const, [ 'b' ] as const, { d: undefined } as const, class { e; f; }));
/* const o = fragments({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 } as const, [ 'a', 'c' ] as const, [ 'b' ] as const, { d: undefined } as const, class { e; f; });

o[ 0 ].a === 1;
// o[ 0 ].b === 1;
o[ 0 ].c === 3;

o[ 1 ].b === 2;

o[ 2 ].d === 4;

o[ 3 ].e === 5;
o[ 3 ].f === 6; */


// const o2 = fragments({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 } as const, [ 'a', 'c' ], [ 'b' ], { d: undefined }, class { e; f; });

type ComplementaryKeys<O extends {}, P> =
    P extends ReadonlyArray<keyof O> ? Omit<O, P[ number ]> :
    P extends new (...args: any) => any ? Omit<O, keyof InstanceType<P> & keyof O> :
    P extends {} ? Omit<O, keyof P & keyof O> :
    [];

export const partition = <O, P>(o: O, p: P): Fragments<O, [ P, ComplementaryKeys<O, P> ]> => {
    const [ oP ] = fragments(o, p);
    const opKeys = Reflect.ownKeys(oP);

    const rest = Object.keys(o).reduce((rest, k) => opKeys.includes(k) ? rest : { ...rest, [ k ]: o[ k ] }, {});

    return [ oP, rest ] as any;
};


// const [ a, b ] = partition({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 } as const, [ 'a', 'c' ] as const);
// const [ a, b ] = partition({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 } as const, class { a; c; });

export const debounce = <Fn extends Function>(fn: Fn, wait: number = 0, immediate: boolean = false): Fn & { cancel: () => void; } => {
    let timeout: number;

    function debouncedFn(...args: unknown[]) {
        const context = null; // this;

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
