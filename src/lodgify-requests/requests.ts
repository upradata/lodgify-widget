import { map } from './map';
import { Availibity, DailyRates, LodgifyDate, PropertyInfo } from './types';
import { Range } from '../types';

const corsProxy = `http://localhost:8080`;
const lodgiftV2 = `https://api.lodgify.com/v2`;

const lodgifyOptions: RequestInit = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        'X-ApiKey': '+BvSxGGZ/ay5H3lVshlgJvyDwSqRXAnhU4/kjvRdECoPHGTbKZ3pngf3MgEVv2K/',
        // mode: 'same-origin'
    }
};

export type RequestSuccess<T = unknown> = {
    type: 'success';
    json: T;
};

export type RequestError = {
    type: 'error';
    error: Error;
};

type LodgifyError = {
    message: string;
    code: number;
    correlation_id: string;
    event_id: string;
};

type Primitive = boolean | string | number;
type Options = Record<string, Primitive> & { propertyId?: number; };

const join = (...paths: Primitive[]) => paths.filter(s => !!s).join('/');
const sep = (char: string) => (s1: string, s2: string) => {
    if (s1 === '' && s2 !== '')
        return s2;

    if (s1 !== '' && s2 === '')
        return s1;

    return `${s1}${char}${s2}`;
};

const seps = {
    '&': sep('&'),
    '?': sep('?')
};

const lodgifyREST = (verb: string, options: Record<string, Primitive> = {}) => {
    const { propertyId, ...opts } = options;

    const opt = Object.entries(opts).reduce((s, [ k, v ]) => seps[ '&' ](s, `${k}=${v}`), '');
    return seps[ '?' ](join(verb, propertyId), opt);
};

const createRequest = <T = unknown>(verb: string, options: Options): Promise<RequestSuccess<T> | RequestError> => {
    console.log(`${corsProxy}/${lodgiftV2}/${lodgifyREST(verb, options)}`);
    return fetch(
        `${corsProxy}/${lodgiftV2}/${lodgifyREST(verb, options)}`,
        lodgifyOptions
    ).then(response => response.json()).then(json => {
        if (json.code) {
            const { code, message } = json as LodgifyError;
            return { type: 'error' as const, error: new Error(`Lodgify request error "${message}" with code (${code})`) };
        }

        return { type: 'success' as const, json };
    })
        // .then(response => console.log(response))
        .catch(e => ({ type: 'error' as const, error: e instanceof Error ? e : new Error(JSON.stringify(e)) }));
};


export type DateRange = Range<LodgifyDate>;


/* export const getAllAvailabilities = (range: { start: string; end: string; }) => normalizeLodgifyRequest(fetch(
    `${corsProxy}/${lodgiftV2}/availability?start=${range.start}&end=${range.start}&includeDetails=false`,
    lodgifyOptions
)); */


// 'https://api.lodgify.com/v2/availability?start=2023-02-01&end=2023-02-15&includeDetails=false'
export const getAllAvailabilities = (options: DateRange & { includeDetails?: boolean; }) => createRequest('availability', options);


export const getAvailability = (options: DateRange & { includeDetails?: boolean; } & Required<Pick<Options, 'propertyId'>>) => createRequest<Availibity[]>(`availability`, options);

// 'https://api.lodgify.com/v2/rates/calendar?RoomTypeId=498935&HouseId=432806&StartDate=2023-05-02&EndDate=2023-05-12'
export const getDailyRates = (options: DateRange & { HouseId: number; RoomTypeId: number; }) => createRequest<DailyRates>(
    `rates/calendar`,
    map(options, (k, v) => ({ key: k === 'start' ? 'StartDate' : k === 'end' ? 'EndDate' : k, value: v }))
);

// 'https://api.lodgify.com/v2/properties/432806?includeInOut=false'
export const getPropertyInfo = (options: { includeInOut?: boolean; } & Required<Pick<Options, 'propertyId'>>) => createRequest<PropertyInfo>(`properties`, options);
