import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RoomData, roomsData } from '../../rooms.data';
import { useRoomState } from '../../rooms.state';
import { BookingData, BookingDetails, BookingProps } from './BookingComponent';
import { BookingContext } from './BookingContext';
import { useReservation } from './BookingReservation.state';


export const addBookingReservationStateManagement = (BookingComponent: React.ComponentType<BookingProps>) => {

    const BookingReservationStateManagement: React.FunctionComponent<{ rooms: RoomData[]; }> = ({ rooms: roomsList }) => {

        const { rooms, setRoom, getRoom } = useRoomState(roomsList);
        const { reservation, setReservation } = useReservation(roomsList[ 0 ]);
        const [ details, setDetails ] = useState(new BookingDetails());

        useEffect(() => {
            Object.values(roomsData).forEach(({ value }) => {
                setRoom({ type: 'request-property-availability', payload: { roomValue: value, start: '2023-01-01', end: '2024-01-01' } });
                setRoom({ type: 'request-property-info', payload: { roomValue: value } });
            });
        }, []);


        const context = useMemo(() => ({
            getRoom,
            rooms
        }), [ rooms, getRoom ]);

        const onReservationChange: BookingProps[ 'onReservationChange' ] = useCallback(data => {
            Object.entries(data).forEach(([ name, value ]) => setReservation(name as keyof BookingData, value));
        }, [ setReservation ]);

        const onReservationDetailsChange: BookingProps[ 'onReservationDetailsChange' ] = useCallback(data => {
            setDetails(state => ({ ...state, ...data }));
        }, [ setDetails ]);


        const onSubmit: BookingProps[ 'onSubmit' ] = useCallback((a, b) => {
            console.log(a, b);
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
