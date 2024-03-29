import type { CountryCode } from '@root/types';
import type { DateRange } from '@lodgify/ui';
import type { Reservation } from './reservation.type';


export type BookingData = {
    dates: DateRange;
    guests: number;
    location: string;
    promotionCode?: string;
};

export class BookingBillingInfo {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    country: CountryCode;
    comment?: string;
};


export type BookingProps = Reservation & {
    // onReservationChange?: (data: Partial<BookingData>) => void;
    // onBillingInfoChange?: (data: Partial<BookingBillingInfo>) => void;
    onSubmit?: () => void; // (bookingData: BookingData, details: BookingDetails) => void;
};


export type BookingDataValueOf<Name extends keyof BookingData> = BookingData[ Name ];
