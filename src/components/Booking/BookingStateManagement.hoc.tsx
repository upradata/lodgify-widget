import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BookingContext, BookingContextType } from './BookingContext';
import { BookingData, BookingBillingInfo, BookingProps } from './BookingComponent';
import { useReservation } from './BookingReservation.state';
import { useRoomState } from '../../rooms.state';

import type { RoomData } from '../../rooms.data';


export const addBookingReservationStateManagement = (BookingComponent: React.ComponentType<BookingProps>) => {

    const BookingReservationStateManagement: React.FunctionComponent<{ rooms: RoomData[]; }> = ({ rooms: roomsList }) => {

        const { rooms, setRoom, getRoom } = useRoomState(roomsList);
        const { reservation, setReservation } = useReservation(roomsList[ 0 ], rooms);
        const [ billingInfo, setBillingInfo ] = useState(new BookingBillingInfo());

        useEffect(() => {
            roomsList.forEach(({ value }) => {
                setRoom({ type: 'request-property-availability', roomValue: value, start: '2023-01-01', end: '2024-01-01' });
                setRoom({ type: 'request-property-info', roomValue: value });
            });
        }, []);


        const contextFns: Pick<BookingContextType, 'setReservation' | 'setBillingInfo'> = {
            setReservation,
            setBillingInfo: useCallback(data => setBillingInfo(state => {
                if (Object.entries(data).some(([ k, v ]) => state[ k ] !== v))
                    return { ...state, ...data };

                return state;
            }), [])
        };

        const context = useMemo<BookingContextType>(() => ({
            getRoom,
            rooms,
            reservation,
            billingInfo,
            ...contextFns
        }), [ getRoom, rooms, reservation, billingInfo, setReservation, setBillingInfo ]);


        // const onReservationChange: BookingProps[ 'onReservationChange' ] = context.setReservation;
        /*  useCallback(data => {
            Object.entries(data).forEach(([ name, value ]) => setReservation(name as keyof BookingData, value, rooms[ reservation.roomValue ]));
        }, [ setReservation ]); */

        // const onBillingInfoChange: BookingProps[ 'onBillingInfoChange' ] = context.setBillingInfo;
        /* useCallback(data => {
            setDetails(state => ({ ...state, ...data }));
        }, [ setDetails ]); */


        const onSubmit: BookingProps[ 'onSubmit' ] = useCallback(() => {
            console.log(reservation, billingInfo);
        }, [ reservation, billingInfo ]);
        /*  useCallback(() => {
            console.log(reservation, details);
        }, []); */


        return (
            <BookingContext.Provider value={context}>
                <BookingComponent {...reservation}
                    /* onReservationChange={onReservationChange}
                    onBillingInfoChange={onBillingInfoChange} */
                    onSubmit={onSubmit} />
            </BookingContext.Provider>
        );

    };

    return BookingReservationStateManagement;
};
