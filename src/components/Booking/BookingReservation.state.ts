import React, { useCallback, useState } from 'react';
import { BookingData, BookingDataValueOf } from './BookingComponent';
import { getNbOfNights } from '../../util';
import { getQuote, GetQuoteOptions } from '../../lodgify-requests';
import { lodgifyDateToMoment, momentToLodgifyDate } from '../../lodgify-info/info';
import { PriceType, QuotePrice, QuotePriceType } from '../../lodgify-requests/quote.type';
import { Reservation, ReservationQuote, ReservationQuotePriceDetails, ReservationQuoteSubPricesWithCategory } from './reservation.type';

import type { Omit } from '../../util.types';
import type { RoomData } from '../../rooms.data';


type SetReservation = React.Dispatch<React.SetStateAction<Reservation>>;


export type ReservationReducerPayload = |
{
    type: 'change-input'; name: keyof BookingData; value: BookingData[ keyof BookingData ];
} |
    // { type: 'request-info'; room: RoomData; previousReservation: Reservation; setReservation: SetReservation; } |
    {
        type: 'request-accomodation-price'; previousReservation: Reservation; setReservation: SetReservation; room: RoomData;
    } & Omit<GetQuoteOptions, 'propertyId' | 'roomTypes' | 'start' | 'end'>;


type Payload<Type extends ReservationReducerPayload[ 'type' ]> = ReservationReducerPayload extends infer P ?
    P extends ReservationReducerPayload ? Type extends P[ 'type' ] ? Omit<P, 'type'> : never : never :
    never;



const reservationReducer: React.Reducer<Reservation, ReservationReducerPayload> = (
    reservation, { type, ...payload }
) => {

    const setState = (newState: Partial<Reservation>) => ({ ...reservation, ...newState });

    switch (type) {
        case 'change-input': {

            const { name, value } = payload as Payload<'change-input'>;

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

            throw new Error(`Reducer action "${type}" with payload name "${name}" doest not exist.`);
        }

        // case 'request-info': {

        //     const { room, previousReservation, setReservation } = payload as Payload<'request-info'>;

        //     const isNew = (prop: keyof Reservation) => reservation[ prop ] !== previousReservation[ prop ];

        //     if (reservation.startDate && reservation.endDate && (
        //         reservation.nbOfNights > 0 && isNew('nbOfNights') ||
        //         isNew('startDate') ||
        //         isNew('endDate') ||
        //         isNew('roomValue')
        //     )) {
        //         //setReservation(prev => ({ ...prev, price: undefined }));
        //         /* reservation.price = undefined;
        //         reservation.isLoading = true; */

        //         const { roomValue, startDate, endDate } = reservation;

        //         // Promise => will be executed on a next tick
        //         getLodgifyInfo(roomValue, 'getDailyRates', {
        //             start: startDate,
        //             end: momentToLodgifyDate(endDate),
        //             propertyId: room.propertyId,
        //             roomTypeId: room.roomId
        //         }).then(data => {
        //             if (data.type === 'success') {
        //                 return getReservationPrice(data.json, { start: lodgifyDateToMoment(startDate), end: lodgifyDateToMoment(endDate) });
        //             }
        //         }).then(price => {
        //             setReservation(prev => ({ ...prev, price, isLoading: false }));
        //         });

        //         return setState({ price: undefined, isLoading: true });
        //     }

        //     return reservation;
        // }


        case 'request-accomodation-price': {
            const { previousReservation, setReservation, room, ...options } = payload as Payload<'request-accomodation-price'>;

            const isSomeNewAndAllDefined = (...props: (keyof Reservation)[]) => {
                const hasSomeNewProps = props.some(prop => {
                    return reservation[ prop ] !== previousReservation[ prop ];
                });

                return hasSomeNewProps && props.every(prop => !!reservation[ prop ]);
            };

            if (isSomeNewAndAllDefined('nbOfNights', 'startDate', 'endDate', 'nbGuests', 'roomValue')) {

                getQuote({
                    propertyId: room.propertyId,
                    roomTypes: [ { roomTypeId: room.roomId, nbGuests: reservation.nbGuests } ],
                    start: reservation.startDate,
                    end: reservation.endDate,
                    ...options
                }).then(res => {
                    if (res.type === 'success')
                        return res.json[ 0 ];
                }).then(quote => {

                    const getSubprices = (prices: QuotePrice[]): ReservationQuoteSubPricesWithCategory[ 'subPrices' ] => {
                        return prices.map(({ amount, description }) => ({ price: amount, description }));
                    };

                    const getSubPricesPerCategory = (priceTypes: PriceType[]): ReservationQuoteSubPricesWithCategory[] => {
                        return priceTypes.map(({ prices, type, subtotal, description: category }) => ({
                            category,
                            type,
                            isRoomRate: type === QuotePriceType.RoomRate,
                            subTotal: subtotal,
                            subPrices: getSubprices(prices)
                        }));
                    };

                    const priceDetails: ReservationQuotePriceDetails[] = quote.room_types.map(({ people: nbGuests, price_types }) => ({
                        nbGuests,
                        roomValue: reservation.roomValue,
                        subPricesPerCategory: getSubPricesPerCategory(price_types)
                    }));

                    const hasVat = !!quote.total_including_vat;
                    const totalGross = quote.amount_gross;

                    const reservationQuote: ReservationQuote = {
                        totalGross,
                        totalNet: quote.total_excluding_vat,
                        vat: quote.total_vat,
                        hasVat,
                        priceDetails
                    };

                    return reservationQuote;
                }).then(quote => {
                    setReservation(prev => ({ ...prev, quote, isLoading: false }));
                });

                return setState({ quote: undefined, isLoading: true });
            }

            return reservation;
        }

        default:
            throw new Error(`Reducer action type "${type as string}" is not handled!`);
    }
};


export const useReservation = (initRoom: RoomData) => {
    const [ reservation, setReservation ] = useState<Reservation>({ ...new Reservation(), nbGuests: 1, roomValue: initRoom.value, isLoading: false });

    const updateReservation = useCallback((name: keyof BookingData, value: BookingData[ keyof BookingData ], room: RoomData) => {
        setReservation(reservation => {
            const newReservation = reservationReducer(reservation, { type: 'change-input', name, value });
            return reservationReducer(newReservation, { type: 'request-accomodation-price', room, previousReservation: reservation, setReservation });
        });
    }, [ setReservation ]);

    return { setReservation: updateReservation, reservation };
};