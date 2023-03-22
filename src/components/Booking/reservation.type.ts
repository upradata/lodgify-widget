import { LodgifyDate, QuotePriceType } from '../../lodgify-requests';


export class Reservation {
    roomValue?: string;
    nbOfNights?: number;
    startDate?: LodgifyDate;
    endDate?: LodgifyDate;
    // price?: number;
    nbGuests?: number;
    isLoading?: boolean;
    promotionCode?: string;
    quote?: ReservationQuote;
    bookings?: BookingReservation[];
};


export type BookingReservation = {
    isBooked: boolean;
    startDate: LodgifyDate;
    endDate: LodgifyDate;
    isPayed: boolean;
};


export class ReservationDebug {
    roomValue?: string = 'mini-hotel';
    nbOfNights?: number = 3;
    startDate?: LodgifyDate = '2023-07-14';
    endDate?: LodgifyDate = '2023-07-21';
    // price?: number;
    nbGuests: number = 3;
    isLoading?: boolean;
    quote?: ReservationQuote = {
        totalGross: 1000,
        totalNet: null,
        vat: 20,
        isPricesIncludesVat: true,
        roomsPriceDetails: [
            {
                nbGuests: 3,
                roomValue: 'mini-hotel',
                categoriesPrices: [
                    {
                        category: 'RoomRate',
                        type: QuotePriceType.RoomRate,
                        isRoomRate: true,
                        subTotal: 700,
                        items: [
                            { price: 700, description: 'Rate' }
                        ]
                    },
                    {
                        category: 'Promotion',
                        type: QuotePriceType.Promotion,
                        isRoomRate: false,
                        subTotal: -210,
                        items: [
                            { price: -210, description: 'Doggy Promo' }
                        ]
                    },
                    {
                        category: 'Taxes',
                        type: QuotePriceType.Tax,
                        isRoomRate: false,
                        subTotal: 66.5,
                        items: [
                            { price: 59.5, description: 'Local Tax' },
                            { price: 7.0, description: 'Online Service Tax' }
                        ]
                    }
                ],
                subTotal: 1000
            }
        ]
    };
};


export type ReservationQuoteRoomCategoryPrices = {
    category: string;
    type: QuotePriceType;
    isRoomRate: boolean;
    subTotal: number;
    items: { price: number; description: string; }[];
};


export type ReservationQuoteRoomPriceDetails = {
    nbGuests: number;
    roomValue: string;
    categoriesPrices: ReservationQuoteRoomCategoryPrices[];
    subTotal: number;
};

export type ReservationQuote = {
    totalGross: number;
    totalNet: number;
    vat: number;
    isPricesIncludesVat: boolean;
    roomsPriceDetails: ReservationQuoteRoomPriceDetails[];
};
