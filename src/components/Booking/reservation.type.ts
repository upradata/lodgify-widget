import { LodgifyDate, QuotePriceType } from '../../lodgify-requests';


export class Reservation {
    roomValue?: string;
    nbOfNights?: number;
    startDate?: LodgifyDate;
    endDate?: LodgifyDate;
    // price?: number;
    nbGuests: number;
    isLoading?: boolean;
    quote?: ReservationQuote;
};


export type ReservationQuoteSubPricesWithCategory = {
    category: string;
    type: QuotePriceType;
    isRoomRate: boolean;
    subTotal: number;
    subPrices: { price: number; description: string; }[];
};


export type ReservationQuotePriceDetails = {
    nbGuests: number;
    roomValue: string;
    subPricesPerCategory: ReservationQuoteSubPricesWithCategory[];
};

export type ReservationQuote = {
    totalGross: number;
    totalNet: number;
    vat: number;
    hasVat: boolean;
    priceDetails: ReservationQuotePriceDetails[];
};
