import type { DateRange } from '@lodgify/ui';
import type { CountryCode } from 'libphonenumber-js';
import type { Reservation } from './reservation.type';


export type BookingData = {
    dates: DateRange;
    guests: number;
    location: string;
};

export class BookingDetails {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    country: CountryCode;
    comment?: string;
};


export type BookingProps = Reservation & {
    onReservationChange?: (data: Partial<BookingData>) => void;
    onReservationDetailsChange?: (data: Partial<BookingDetails>) => void;
    onSubmit?: () => void; // (bookingData: BookingData, details: BookingDetails) => void;
};


export type BookingDataValueOf<Name extends keyof BookingData> = BookingData[ Name ];
