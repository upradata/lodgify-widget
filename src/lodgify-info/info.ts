import moment, { Moment } from 'moment';
import { DailyRates, LodgifyDate } from '../lodgify-requests';
import * as requests from '../lodgify-requests';
import { localizedDate, round } from '../util';

import type { Range } from '../types';
import type { RoomData } from '../rooms.data';


type _Requests = typeof requests;

export type RequestNames = { [ K in keyof _Requests ]: _Requests[ K ] extends Function ? K : never }[ keyof _Requests ];
export type Requests = {
    [ K in RequestNames ]: _Requests[ K ];
};


export type LodgifyInfoOption<T extends {}> = T | ((roomData: RoomData) => T);
export type RequestOption<R extends RequestNames> = Parameters<Requests[ R ]>[ 0 ];
export type RequestReturn<R extends RequestNames> = ReturnType<Requests[ R ]>;


export const getLodgifyInfo = <R extends RequestNames>(/* roomValue: string,  */request: R, options: LodgifyInfoOption<RequestOption<R>>): RequestReturn<R> => {
    // const roomData = getRoomDataByValue(roomValue);

    /*  if (!roomData)
         return Promise.resolve({ type: 'error', error: new Error(`There is no room with value "${roomValue}"`) } as requests.RequestError) as any; */
    return requests[ request ](options as any) as any;
    //  return requests[ request ]((typeof options === 'function' ? options(roomData) : options) as any) as any;
};


// const r = getLodgifyInfo('room-1', 'getAvailability', { propertyId: 1, start: '2023-01-01', end: '2023-01-01' });


export const lodgifyDateToMoment = (date: Moment | string): Moment => date ? (typeof date === 'string' ? moment(date, 'YYYY-MM-DD') : date) : null;
export const momentToLodgifyDate = (date: Moment | string): LodgifyDate => {
    if (!!date)
        return typeof date === 'string' ? date as LodgifyDate : date.format('YYYY-MM-DD') as LodgifyDate;

    return null;
};

export const getPeriodsNonAvailable = (availibities: requests.Availibity) => availibities.periods.filter(p => !p.available).map(p => ({
    start: lodgifyDateToMoment(p.start),
    end: lodgifyDateToMoment(p.end)
}));


export const dateAsString = (date: LodgifyDate) => localizedDate(lodgifyDateToMoment(date));


export const getReservationPrice = (rates: DailyRates, dateRange: Range<Moment>) => {
    const { start, end } = dateRange;
    const nbOfNights = moment.duration(end.startOf('day').diff(start.startOf('day'))).asDays();

    const totalPrice = rates.calendarItems.reduce((price, item) => {
        if (item.isDefault)
            return price;

        const dayPrice = item.prices.find(p => p.minStay <= nbOfNights && (p.maxStay === 0 || nbOfNights <= p.maxStay));
        return price + dayPrice.pricePerDay;
    }, 0);

    return round(totalPrice, 2);
};
