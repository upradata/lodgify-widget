import { createContext } from 'react';
import { RoomsState, RoomState } from '@root/rooms.state';
import { ReservationAction } from './BookingReservation.action';

import type { BookingBillingInfo } from './BookingComponent';
import type { Reservation } from './reservation.type';


export type BookingContextType = {
    getRoom: (roomValue: string) => RoomState;
    rooms: RoomsState;
    reservation: Reservation;
    setReservation: (action: ReservationAction) => void;
    setBillingInfo: (data: Partial<BookingBillingInfo>) => void;
    billingInfo: BookingBillingInfo;
};

export const BookingContext = createContext<BookingContextType>(null);
