import type { BookingGuest, BookingMessage, BookingRoom, CreateBookingOptions } from './create-booking.type';
import type { Currency, LodgifyDate } from './common.type';
import type { Omit, CamelObject } from '../util.types';


export type LodgifyUpdateBookingOptions = Omit<Partial<CreateBookingOptions>, 'guest' | 'rooms' | 'messages'> & {
    id?: string;
    type?: string;
    booking_type?: string;
    rooms: (BookingRoom & { name?: string; })[];
    guest: Partial<Omit<BookingGuest, 'country_code'> & { id?: string; country_name?: string; }>;
    messages?: (BookingMessage & { is_replied?: boolean; created_at?: LodgifyDate; })[];
    created_at?: LodgifyDate;
    is_replied?: boolean;
    updated_at?: LodgifyDate;
    is_deleted?: boolean;
    date_deleted?: LodgifyDate;
    total_amount?: number;
    total_paid?: number;
    amount_to_pay?: string;
    currency?: Partial<Currency>;
    note?: string;
};


export type UpdateBookingOptions = CamelObject<LodgifyUpdateBookingOptions>;