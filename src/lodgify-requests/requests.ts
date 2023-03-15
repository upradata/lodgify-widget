import { arrayToOption, createRequestV1, createRequestV2, makeRequest, Options } from './create-request';
import { toCasedObject, map } from '../util';

import type {
    Addon,
    Availibity,
    BookingId,
    CreateBookingOptions,
    CreateQuoteOptions,
    DailyRates,
    LodgifyDate,
    PropertyInfo,
    Quote,
    QuoteId,
    RatesSettings,
    RoomInfo,
    UpdateBookingOptions
} from './types';
import type { CamelObject, SelectType } from '../util.types';
import type { Range } from '../types';


export type DateRange = Range<LodgifyDate>;


/* export const getAllAvailabilities = (range: { start: string; end: string; }) => normalizeLodgifyRequest(fetch(
    `${corsProxy}/${lodgiftV2}/availability?start=${range.start}&end=${range.start}&includeDetails=false`,
    lodgifyOptions
)); */


export type GetAllAvailibitiesOptions = DateRange & { includeDetails?: boolean; };

// 'https://api.lodgify.com/v2/availability?start=2023-02-01&end=2023-02-15&includeDetails=false'
export const getAllAvailabilities = makeRequest((options: GetAllAvailibitiesOptions) => createRequestV2('availability', { ...options, type: 'url-parameters' }));


export type GetAvailibityOptions = DateRange & { includeDetails?: boolean; } & Required<Pick<Options, 'propertyId'>> & Pick<Options, 'roomTypeId'>;
export const getAvailability = makeRequest((options: GetAvailibityOptions) => createRequestV2<Availibity[]>(`availability`, { ...options, type: 'url-parameters' }));


export type getDailyRatesOptions = DateRange & Required<Pick<Options, 'propertyId' | 'roomTypeId'>>;

// 'https://api.lodgify.com/v2/rates/calendar?RoomTypeId=498935&HouseId=432806&StartDate=2023-05-02&EndDate=2023-05-12'
export const getDailyRates = makeRequest(({ propertyId, roomTypeId, start, end, ...options }: getDailyRatesOptions) => createRequestV2<DailyRates>(
    `rates/calendar`,
    { ...options, HouseId: propertyId, RoomTypeId: roomTypeId, StartDate: start, EndDate: end, type: 'url-parameters' }
));


export type GetPropertyInfoOptions = { includeInOut?: boolean; } & Required<Pick<Options, 'propertyId'>>;

// 'https://api.lodgify.com/v2/properties/432806?includeInOut=false'
export const getPropertyInfo = makeRequest((options: GetPropertyInfoOptions) => createRequestV2<PropertyInfo>(`properties`, { ...options, type: 'url-parameters' }));


export type GetRoomInfoProps = Required<Pick<Options, 'propertyId' | 'roomTypeId'>>;

// 'https://api.lodgify.com/v2/properties/432806?includeInOut=false'
export const getRoomInfo = makeRequest(({ propertyId, roomTypeId }: GetRoomInfoProps) => createRequestV1<RoomInfo>(`properties/${propertyId}/rooms/${roomTypeId}`));


export type GetQuoteOptions = DateRange & Required<Pick<Options, 'propertyId'>> & {
    roomTypes: { roomTypeId: number; nbGuests: number; }[];
    addOns?: { id: number; unit: number; }[];
    promotionCode?: string;
};

// 'https://api.lodgify.com/v2/quote/{propertyId}?arrival={arrival}&departure={departure}&roomTypes[0].id={roomTypeId}&roomTypes[0].people={people}&addOns[0].id={addOnId}&addOns[0].units={addOnUnits}&promotionCode={promotionCode}'
export const getQuote = makeRequest(({ start, end, roomTypes, addOns, ...opts }: GetQuoteOptions) => {
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
        ...opts,
        type: 'url-parameters' as const
    };

    return createRequestV2<Quote[]>(`quote`, options);
});


// 'https://api.lodgify.com/v1/properties/436901/rates/addons?start=2023-03-01&end=2023-03-08'

export type GetAddonsOptions = DateRange & Required<Pick<Options, 'propertyId'>>;
export const getAddons = makeRequest((options: GetAddonsOptions) => createRequestV1<Addon[]>(`properties`, { ...options, type: 'url-parameters' }));


export type GetRatesSettingsOptions = Required<Pick<Options, 'propertyId'>>;

// fetch('https://api.lodgify.com/v2/rates/settings?houseId=436901', options)
export const getRatesSettings = makeRequest((options: GetRatesSettingsOptions) => {
    return createRequestV2<RatesSettings>(`rates/settings`, { houseId: options.propertyId, type: 'url-parameters' });
});



// fetch('https://api.lodgify.com/v1/reservation/booking', options)
export const createBooking = makeRequest((options: CreateBookingOptions) => createRequestV1<BookingId>(`reservation/booking`, { ...options, type: 'body-parameters' }));


// fetch('https://api.lodgify.com/v1/reservation/booking/1234/quote', options)
export const createQuote = makeRequest(({ bookingId, ...options }: CreateQuoteOptions) => {
    return createRequestV1<QuoteId>(`reservation/booking/${bookingId}/quote`, { ...options, type: 'body-parameters' });
});


export type AnyUpdateBookingOptions =
    | { type: 'status-booked', bookingId: BookingId; requestPayment?: boolean; }
    | { type: 'status-tentative', bookingId: BookingId; requestPayment?: boolean; }
    | { type: 'status-declined', bookingId: BookingId; }
    | { type: 'any-field', bookingId: BookingId; } & CamelObject<UpdateBookingOptions>;




// fetch('https://api.lodgify.com/v1/reservation/booking/1111', options)
// fetch('https://api.lodgify.com/v1/reservation/booking/111/tentative?requestPayment=false', options)
// fetch('https://api.lodgify.com/v1/reservation/booking/111/book?requestPayment=false', options)
// fetch('https://api.lodgify.com/v1/reservation/booking/111/decline', options)
export const updateBooking = makeRequest(({ type, bookingId, ...options }: AnyUpdateBookingOptions) => {
    const url = `reservation/booking/id`;
    type AnyFieldOptions = SelectType<AnyUpdateBookingOptions, 'any-field'>;

    const opts = toCasedObject(options, 'kebab');

    if (type === 'any-field')
        return createRequestV1<void>(url, { ...(opts as AnyFieldOptions), type: 'body-parameters' });

    const getVerb = () => {
        switch (type) {
            case 'status-booked': return 'book';
            case 'status-tentative': return 'tentative';
            case 'status-declined': return 'declined';
        }
    };

    return createRequestV1<void>(`${url}/${getVerb()}`, { ...(opts as Exclude<AnyUpdateBookingOptions, AnyFieldOptions>), type: 'url-parameters' });
});
