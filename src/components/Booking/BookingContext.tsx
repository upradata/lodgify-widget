import { createContext } from 'react';

import type { RoomData, RoomsData } from '../../rooms.data';


export const BookingContext = createContext<{
    getRoom: (roomValue: string) => RoomData;
    rooms: RoomsData;
}>(null);
