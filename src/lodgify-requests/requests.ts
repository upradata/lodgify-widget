import { Addon, Availibity, DailyRates, LodgifyDate, PropertyInfo, Quote } from './types';
import { Range } from '../types';


// API at https://docs.lodgify.com/reference/

const arrayToOption = <T extends {}>(options: T[], baseKey: string, map?: (key: keyof T) => string) => {
    if (!options)
        return {};

    const mapping = map || ((k: string) => k);

    return options.reduce((o, item, i) => {
        const option = Object.fromEntries(Object.entries(item).map(([ k, v ]) => [ `${baseKey}[${i}].${mapping(k as keyof T & string)}`, v ]));

        return {
            ...o,
            ...option
        };
    }, {});
};


type LodgifyVersion = 'v1' | 'v2';

const corsProxy = `http://localhost:8080`;
const lodgifyApi = (version: LodgifyVersion) => `https://api.lodgify.com/${version}`;

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
type Options = Record<string, Primitive> & { propertyId?: number; roomTypeId?: number; };


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
    const { propertyId, roomTypeId, ...opts } = options;

    const opt = Object.entries(opts).reduce((s, [ k, v ]) => seps[ '&' ](s, `${k}=${v}`), '');
    return seps[ '?' ](join(verb, propertyId, roomTypeId), opt);
};


const createRequest = <T = unknown>(verb: string, options: Options, version: LodgifyVersion): Promise<RequestSuccess<T> | RequestError> => {
    console.log(`${corsProxy}/${lodgifyApi(version)}/${lodgifyREST(verb, options)}`);

    return fetch(
        `${corsProxy}/${lodgifyApi(version)}/${lodgifyREST(verb, options)}`,
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


const createRequestV1 = <T = unknown>(verb: string, options: Options) => createRequest<T>(verb, options, 'v1');
const createRequestV2 = <T = unknown>(verb: string, options: Options) => createRequest<T>(verb, options, 'v2');


export type DateRange = Range<LodgifyDate>;


/* export const getAllAvailabilities = (range: { start: string; end: string; }) => normalizeLodgifyRequest(fetch(
    `${corsProxy}/${lodgiftV2}/availability?start=${range.start}&end=${range.start}&includeDetails=false`,
    lodgifyOptions
)); */


// 'https://api.lodgify.com/v2/availability?start=2023-02-01&end=2023-02-15&includeDetails=false'
export const getAllAvailabilities = (options: DateRange & { includeDetails?: boolean; }) => createRequestV2('availability', options);


export const getAvailability = (options: DateRange & { includeDetails?: boolean; } & Required<Pick<Options, 'propertyId'>> & Pick<Options, 'roomTypeId'>) => {
    return createRequestV2<Availibity[]>(`availability`, options);
};


export type getDailyRatesOptions = DateRange & Required<Pick<Options, 'propertyId' | 'roomTypeId'>>;

// 'https://api.lodgify.com/v2/rates/calendar?RoomTypeId=498935&HouseId=432806&StartDate=2023-05-02&EndDate=2023-05-12'
export const getDailyRates = ({ propertyId, roomTypeId, start, end, ...options }: getDailyRatesOptions) => createRequestV2<DailyRates>(
    `rates/calendar`,
    { ...options, HouseId: propertyId, RoomTypeId: roomTypeId, StartDate: start, EndDate: end }
);


export type GetPropertyInfoProps = { includeInOut?: boolean; } & Required<Pick<Options, 'propertyId'>>;

// 'https://api.lodgify.com/v2/properties/432806?includeInOut=false'
export const getPropertyInfo = (options: GetPropertyInfoProps) => createRequestV2<PropertyInfo>(`properties`, options);


export type GetRoomInfoProps = Required<Pick<Options, 'propertyId' | 'roomTypeId'>>;

// 'https://api.lodgify.com/v2/properties/432806?includeInOut=false'
export const getRoomInfo = (options: GetRoomInfoProps) => createRequestV2<PropertyInfo>(`properties`, options);


export type GetQuoteOptions = DateRange & Required<Pick<Options, 'propertyId'>> & {
    roomTypes: { roomTypeId: number; nbGuests: number; }[];
    addOns?: { id: number; unit: number; }[];
    promotionCode?: string;
};

// 'https://api.lodgify.com/v2/quote/{propertyId}?arrival={arrival}&departure={departure}&roomTypes[0].id={roomTypeId}&roomTypes[0].people={people}&addOns[0].id={addOnId}&addOns[0].units={addOnUnits}&promotionCode={promotionCode}'
export const getQuote = ({ start, end, roomTypes, addOns, ...opts }: GetQuoteOptions) => {
    const options = {
        arrival: start,
        departure: end,
        ...arrayToOption(roomTypes, 'roomTypes', k => {
            if (k === 'nbGuests')
                return 'people';
            if (k === 'roomTypeId')
                return 'id';

            throw new Error(`Bad roomTypes typing => key="${k}" not recognized.`);
        }),
        ...arrayToOption(addOns, 'addOns'),
        ...opts
    };

    return createRequestV2<Quote[]>(`quote`, options);
};


// 'https://api.lodgify.com/v1/properties/436901/rates/addons?start=2023-03-01&end=2023-03-08'

export type GetAddons = DateRange & Required<Pick<Options, 'propertyId'>>;
export const getAddons = (options: GetAddons) => createRequestV1<Addon[]>(`properties`, options);
