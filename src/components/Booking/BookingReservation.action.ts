import React from 'react';
import { GetQuoteOptions } from '../../lodgify-requests';
import { lodgifyDateToMoment } from '../../lodgify-info/info';
import { Reservation } from './reservation.type';

import type { BookingBillingInfo, BookingData } from './BookingComponent';
import type { Omit, SelectType, ValueOf } from '../../util.types';
import type { RoomData } from '../../rooms.data';




type SetReservation = React.Dispatch<React.SetStateAction<Reservation>>;

export type ReservationReducerAction =
    | {
        type: 'change-input'; name: keyof BookingData, value: ValueOf<BookingData>;
    }
    | {
        type: 'request-accomodation-price'; previousReservation: Reservation; setReservation: SetReservation; room: RoomData;
    } & Omit<GetQuoteOptions, 'propertyId' | 'roomTypes' | 'start' | 'end'>
    | {
        type: 'create-booking'; room: RoomData; billingInfo: BookingBillingInfo; setReservation: SetReservation;
    };


export type Payload<Type extends ReservationReducerAction[ 'type' ]> = SelectType<ReservationReducerAction, Type>;


export type ReservationAction =
    | Pick<Payload<'change-input'>, 'type'> & Partial<BookingData>
    | Pick<Payload<'create-booking'>, 'type' | 'billingInfo'>;



type OptionalProp<T> = { optional?: boolean; prop: keyof T; };
type OptionalPropOptions<T> = keyof T | OptionalProp<T>;


const toOptionalProps = <T>(props: OptionalPropOptions<T>[]) => {
    return props.map(p => typeof p === 'object' ? p : { optional: false, prop: p });
};

const isAllDefined = <T>(keys: OptionalProp<T>[], o: T) => keys.every(k => k.optional || !!o[ k.prop ]);

const reservationProps = toOptionalProps<Reservation>([
    'nbOfNights', 'startDate', 'endDate', 'nbGuests', 'roomValue', { optional: true, prop: 'promotionCode' }
]);

const billingInfoProps = toOptionalProps<BookingBillingInfo>([
    'email', 'firstName', 'lastName', 'phoneNumber', 'country'
]);

export const helpers = {
    hasReservationNewProps: (previousReservation: Reservation, reservation: Reservation) => {
        return reservationProps.some(({ prop }) => {
            return reservation[ prop ] !== previousReservation[ prop ];
        });
    },
    isReservationValid: (reservation: Reservation) => {
        return isAllDefined(reservationProps, reservation) && lodgifyDateToMoment(reservation.startDate).isBefore(lodgifyDateToMoment(reservation.endDate));
    },
    isBillingInfoValid: (billingInfo: BookingBillingInfo) => {
        return isAllDefined(billingInfoProps, billingInfo);
    }
};
