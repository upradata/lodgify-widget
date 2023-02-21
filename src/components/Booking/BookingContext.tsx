import { createContext } from 'react';
import { RoomsData, RoomData } from '../../rooms.data';

export const BookingContext = createContext<{
    getRoom: (roomValue: string) => RoomData;
    rooms: RoomsData;
}>(null);
