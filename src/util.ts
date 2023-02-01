import moment, { Moment } from 'moment';
import { useEffect, useRef } from 'react';

export const isInRange = (min: number, max: number) => (v: number) => min <= v && v <= max;

export const isDateInRange = (min: Moment, max: Moment) => (date: Moment) => {
    return true &&
        isInRange(min.date(), max.date())(date.date()) &&
        isInRange(min.month(), max.month())(date.month()) &&
        isInRange(min.year(), max.year())(date.year());
};


export const getNbOfNights = (start: Moment, end: Moment) => moment.duration(end.startOf('day').diff(start.startOf('day'))).asDays();


export function usePrevious<T>(value: T): T {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    }, [ value ]);

    return ref.current;
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
    const keys = (part: any): (string | number | symbol)[] => {
        if (Array.isArray(part))
            return part as string[];

        if (isClass(part))
            return Reflect.ownKeys(new part());

        return Reflect.ownKeys(part);
    };

    const fragments = parts.reduce<unknown[]>((arr, part) => {
        const fragment = Object.fromEntries(keys(part).map(key => [ key, obj[ key ] ]));
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
