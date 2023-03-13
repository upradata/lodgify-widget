import { createContext } from 'react';

import type { BookingBillingInfo, BookingData } from './BookingComponent';
import type { Reservation } from './reservation.type';
import { RoomsState, RoomState } from '../../rooms.state';


export type BookingContextType = {
    getRoom: (roomValue: string) => RoomState;
    rooms: RoomsState;
    reservation: Reservation;
    setReservation: (data: Partial<BookingData>) => void;
    setBillingInfo: (data: Partial<BookingBillingInfo>) => void;
    billingInfo: BookingBillingInfo;
};

export const BookingContext = createContext<BookingContextType>(null);
