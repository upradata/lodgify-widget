import { Range } from '../types';

export interface Availibity {
    user_id: number;
    property_id: number;
    room_type_id: number;
    periods: Period[];
}

export type Period = Range<string> & {
    available: number;
    closed_period?: any;
    bookings: Booking[];
    channel_calendars: any[];
};

export interface Booking {
    id: number;
    status?: any;
}



export interface DailyRates {
    calendar_items: CalendarItem[];
    rate_settings: RateSettings;
}

export interface RateSettings {
    bookability: number;
    check_in_hour: number;
    check_out_hour: number;
    booking_window_days: number;
    advance_notice_days: number;
    advance_notice_hours: number;
    preparation_time_days: number;
    currency_code: string;
    vat: number;
    is_vat_exclusive: boolean;
}

export interface CalendarItem {
    date?: string;
    is_default: boolean;
    prices: Price[];
}

export interface Price {
    min_stay: number;
    max_stay: number;
    price_per_day: number;
}




export type PropertyInfo = PropertyInfoPrice & {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    zip: string;
    city: string;
    country: string;
    image_url: string;
    has_addons: boolean;
    has_agreement: boolean;
    agreement_text?: any;
    agreement_url?: any;
    contact: Contact;
    rating: number;
    rooms: Room[];
    in_out_max_date: string;
    in_out?: any;
    currency_code: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
};

export interface PropertyInfoPrice {
    price_unit_in_days: number;
    min_price: number;
    original_min_price: number;
    max_price: number;
    original_max_price: number;
}

export interface Room {
    id: number;
    name: string;
}

export interface Contact {
    spoken_languages: string[];
}


type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type Year = `20${Digit}${Digit}`;
type Month = `${'0' | '1'}${Digit}`;
type Day = `${'0' | '1' | '2' | '3'}${Digit}`;

export type LodgifyDate = `${Year}-${Month}-${Day}`;
