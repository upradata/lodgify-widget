import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BookingContext } from './BookingContext';
import { BookingData, BookingDetails, BookingProps } from './BookingComponent';
import { useReservation } from './BookingReservation.state';
import { useRoomState } from '../../rooms.state';

import type { RoomData } from '../../rooms.data';


export const addBookingReservationStateManagement = (BookingComponent: React.ComponentType<BookingProps>) => {

    const BookingReservationStateManagement: React.FunctionComponent<{ rooms: RoomData[]; }> = ({ rooms: roomsList }) => {

        const { rooms, setRoom, getRoom } = useRoomState(roomsList);
        const { reservation, setReservation } = useReservation(roomsList[ 0 ]);
        const [ details, setDetails ] = useState(new BookingDetails());

        useEffect(() => {
            roomsList.forEach(({ value }) => {
                setRoom({ type: 'request-property-availability', roomValue: value, start: '2023-01-01', end: '2024-01-01' });
                setRoom({ type: 'request-property-info', roomValue: value });
            });
        }, []);


        const context = useMemo(() => ({
            getRoom,
            rooms
        }), [ rooms, getRoom ]);


        const onReservationChange: BookingProps[ 'onReservationChange' ] = useCallback(data => {
            Object.entries(data).forEach(([ name, value ]) => setReservation(name as keyof BookingData, value, rooms[ reservation.roomValue ]));
        }, [ setReservation ]);

        const onReservationDetailsChange: BookingProps[ 'onReservationDetailsChange' ] = useCallback(data => {
            setDetails(state => ({ ...state, ...data }));
        }, [ setDetails ]);


        const onSubmit: BookingProps[ 'onSubmit' ] = useCallback(() => {
            console.log(reservation, details);
        }, [ reservation, details ]);
        /*  useCallback(() => {
            console.log(reservation, details);
        }, []); */


        return (
            <BookingContext.Provider value={context}>
                <BookingComponent {...reservation}
                    onReservationChange={onReservationChange}
                    onReservationDetailsChange={onReservationDetailsChange}
                    onSubmit={onSubmit} />
            </BookingContext.Provider>
        );

    };

    return BookingReservationStateManagement;
};
