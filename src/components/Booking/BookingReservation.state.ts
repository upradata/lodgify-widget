import React, { useCallback, useState } from 'react';
import { BookingData, BookingDataValueOf } from './BookingComponent';
import { getNbOfNights } from '../../util';
import { getQuote, GetQuoteOptions } from '../../lodgify-requests';
import { lodgifyDateToMoment, momentToLodgifyDate } from '../../lodgify-info/info';
import { PriceType, QuotePrice, QuotePriceType } from '../../lodgify-requests/quote.type';
import { Reservation, ReservationQuote, ReservationQuoteRoomPriceDetails, ReservationQuoteRoomCategoryPrices, ReservationDebug } from './reservation.type';

import type { Omit } from '../../util.types';
import type { RoomData } from '../../rooms.data';
import { cp } from 'fs';


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

                case 'promotionCode':
                    return value ? setState({ promotionCode: value as BookingDataValueOf<'promotionCode'> }) : reservation;
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

            const isSomeNewAndAllDefined = (...props: (keyof Reservation | { optional?: boolean; prop: keyof Reservation; })[]) => {
                const keys = props.map(p => typeof p === 'object' ? p : { optional: false, prop: p });

                const hasSomeNewProps = keys.some(({ prop }) => {
                    return reservation[ prop ] !== previousReservation[ prop ];
                });

                return hasSomeNewProps && keys.every(k => k.optional || !!reservation[ k.prop ]);
            };

            if (
                isSomeNewAndAllDefined('nbOfNights', 'startDate', 'endDate', 'nbGuests', 'roomValue', { optional: true, prop: 'promotionCode' }) &&
                lodgifyDateToMoment(reservation.startDate).isBefore(lodgifyDateToMoment(reservation.endDate))
            ) {

                getQuote({
                    propertyId: room.propertyId,
                    roomTypes: [ { roomTypeId: room.roomId, nbGuests: reservation.nbGuests } ],
                    start: reservation.startDate,
                    end: reservation.endDate,
                    promotionCode: reservation.promotionCode,
                    ...options
                }).then(res => {
                    if (res.type === 'success')
                        return res.json[ 0 ];
                }).then(quote => {

                    const getSubprices = (prices: QuotePrice[]): ReservationQuoteRoomCategoryPrices[ 'items' ] => {
                        return prices.map(({ amount, description }) => ({ price: amount, description }));
                    };

                    const getCategoriesPrices = (priceTypes: PriceType[]): ReservationQuoteRoomCategoryPrices[] => {
                        return priceTypes.map(({ prices, type, subtotal, description: category }) => ({
                            category,
                            type,
                            isRoomRate: type === QuotePriceType.RoomRate,
                            subTotal: subtotal,
                            items: getSubprices(prices)
                        }));
                    };

                    const roomsPriceDetails: ReservationQuoteRoomPriceDetails[] = quote.room_types.map(({ people: nbGuests, price_types, subtotal }) => ({
                        nbGuests,
                        roomValue: reservation.roomValue,
                        categoriesPrices: getCategoriesPrices(price_types),
                        subTotal: subtotal
                    }));

                    const isPricesIncludesVat = !!quote.total_including_vat;
                    const totalGross = quote.amount_gross;

                    const reservationQuote: ReservationQuote = {
                        totalGross,
                        totalNet: quote.total_excluding_vat,
                        vat: quote.total_vat,
                        isPricesIncludesVat,
                        roomsPriceDetails
                    };

                    return reservationQuote;
                }).then(quote => {
                    setReservation(prev => ({ ...prev, quote, isLoading: false }));
                }).catch(err => {
                    console.error(err);
                    setReservation(prev => ({ ...prev, isLoading: false }));
                });

                return setState({/*  quote: undefined, */ isLoading: true });
            }

            return reservation;
        }

        default:
            throw new Error(`Reducer action type "${type as string}" is not handled!`);
    }
};


export const useReservation = (initRoom: RoomData) => {
    const [ reservation, setReservation ] = useState<Reservation>({ ...new ReservationDebug(), /* nbGuests: 1, roomValue: initRoom.value, */ isLoading: false });

    const updateReservation = useCallback((name: keyof BookingData, value: BookingData[ keyof BookingData ], room: RoomData) => {
        setReservation(reservation => {
            const newReservation = reservationReducer(reservation, { type: 'change-input', name, value });
            return reservationReducer(newReservation, { type: 'request-accomodation-price', room, previousReservation: reservation, setReservation });
        });
    }, [ setReservation ]);

    return { setReservation: updateReservation, reservation };
};
