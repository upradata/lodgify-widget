import React, { useState } from 'react';
import { getLodgifyInfo, getReservationPrice, lodgifyDateToMoment, momentToLodgifyDate } from '../../lodgify-info/info';
import { RoomData } from '../../rooms.data';
import { getNbOfNights } from '../../util';
import { BookingData, BookingDataValueOf } from './BookingComponent';
import { Reservation } from './reservation.type';


type ReservationReducerType = 'change-input' | 'request-info';
type ReservationReducerPayload<Type extends ReservationReducerType = ReservationReducerType> =
    Type extends 'change-input' ? { name: keyof BookingData; value: BookingData[ keyof BookingData ]; } :
    Type extends 'request-info' ? { room: RoomData; previousReservation: Reservation; setReservation: SetReservation; } : never;

type SetReservation = React.Dispatch<React.SetStateAction<Reservation>>;


const reservationReducer: React.Reducer<Reservation, { type: ReservationReducerType; } & ReservationReducerPayload> = (
    reservation, { type, ...payload }
) => {

    const setState = (newState: Partial<Reservation>) => ({ ...reservation, ...newState });

    switch (type) {
        case 'change-input': {

            const { name, value } = payload as ReservationReducerPayload<'change-input'>;

            switch (name) {
                case 'guests':
                    return setState({ nbGuests: value as BookingDataValueOf<'guests'> });

                case 'dates':
                    const { startDate, endDate } = value as BookingDataValueOf<'dates'>;

                    const dates = {
                        startDate: startDate ? momentToLodgifyDate(startDate) : reservation.startDate,
                        endDate: endDate ? momentToLodgifyDate(endDate) : reservation.endDate
                    };

                    const nbOfNights = () => {
                        if (dates.startDate && dates.endDate)
                            return getNbOfNights(lodgifyDateToMoment(dates.startDate), lodgifyDateToMoment(dates.endDate));

                        return reservation.nbOfNights;
                    };

                    return setState({
                        ...dates,
                        nbOfNights: nbOfNights()
                    });


                case 'location':
                    return value ? setState({ roomValue: value as BookingDataValueOf<'location'> }) : reservation;
            }

            break; // to be sure
        }

        case 'request-info': {

            const { room, previousReservation, setReservation } = payload as ReservationReducerPayload<'request-info'>;

            const isNew = (prop: keyof Reservation) => reservation[ prop ] !== previousReservation[ prop ];

            if (reservation.startDate && reservation.endDate && (
                reservation.nbOfNights > 0 && isNew('nbOfNights') ||
                isNew('startDate') ||
                isNew('endDate') ||
                isNew('roomValue')
            )) {
                //setReservation(prev => ({ ...prev, price: undefined }));
                /* reservation.price = undefined;
                reservation.isLoading = true; */

                const { roomValue, startDate, endDate } = reservation;

                // Promise => will be executed on a next tick
                getLodgifyInfo(roomValue, 'getDailyRates', {
                    start: startDate,
                    end: momentToLodgifyDate(endDate),
                    HouseId: room.propertyId,
                    RoomTypeId: room.roomId
                }).then(data => {
                    if (data.type === 'success') {
                        return getReservationPrice(data.json, { start: lodgifyDateToMoment(startDate), end: lodgifyDateToMoment(endDate) });
                    }
                }).then(price => {
                    setReservation(prev => ({ ...prev, price, isLoading: false }));
                });

                return setState({ price: undefined, isLoading: true });
            }

            return reservation;

            break;
        }
    }
};


export const useReservation = (room: RoomData) => {
    const [ reservation, setReservation ] = useState<Reservation>({ ...new Reservation(), nbGuests: 1, roomValue: room.value, isLoading: false });

    const updateReservation = (name: keyof BookingData, value: BookingData[ keyof BookingData ]) => {
        setReservation(reservation => {
            const newReservation = reservationReducer(reservation, { type: 'change-input', name, value });
            return reservationReducer(newReservation, { type: 'request-info', room, previousReservation: reservation, setReservation });
        });
    };

    return { setReservation: updateReservation, reservation };
};
