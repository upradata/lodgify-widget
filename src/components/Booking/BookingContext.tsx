import { createContext } from 'react';

import type { RoomData, RoomsData } from '../../rooms.data';
import type { Reservation } from './reservation.type';


export const BookingContext = createContext<{
    getRoom: (roomValue: string) => RoomData;
    rooms: RoomsData;
    reservation: Reservation;
}>(null);
