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
