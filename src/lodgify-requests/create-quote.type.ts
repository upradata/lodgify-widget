import type { BookingId } from './create-booking.type';
import type { CamelObject } from '../util.types';


export type LodgifyCreateQuoteOptions = {
    bookingId: BookingId;
    is_policy_active?: boolean;
    room_types?: { room_type_id: number; custom_fee_amount?: {}; }[];
    payment_method?: { number: string; cvv?: string; full_name: string; month?: number; year?: number; };
};

export type QuoteId = number;


export type CreateQuoteOptions = CamelObject<LodgifyCreateQuoteOptions>;
