import React, { useCallback, useContext, useState } from 'react';
import { AppContext, AppContextType } from '../../App/AppContext';
import { getNbOfNights } from '../../util';
import { GetQuoteOptions, requests } from '../../lodgify-requests';
import { lodgifyDateToMoment, momentToLodgifyDate } from '../../lodgify-info/info';
import { BookingReservation, Reservation, ReservationDebug, ReservationQuote, ReservationQuoteRoomCategoryPrices, ReservationQuoteRoomPriceDetails } from './reservation.type';

import type { BookingBillingInfo, BookingData, BookingDataValueOf } from './BookingComponent';
import type { Omit, SelectType } from '../../util.types';
import { PriceType, QuotePrice, QuotePriceType } from '../../lodgify-requests/quote.type';
import type { RoomData } from '../../rooms.data';
import type { RoomsState } from '../../rooms.state';
import { PropertyContext, PropertyContextType } from '../../App/PropertyContext';



const helpers = (() => {
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

    return {
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
})();


type SetReservation = React.Dispatch<React.SetStateAction<Reservation>>;

export type ReservationReducerPayload =
    | {
        type: 'change-input'; name: keyof BookingData; value: BookingData[ keyof BookingData ];
    }
    | {
        type: 'request-accomodation-price'; previousReservation: Reservation; setReservation: SetReservation; room: RoomData;
    } & Omit<GetQuoteOptions, 'propertyId' | 'roomTypes' | 'start' | 'end'>
    | {
        type: 'create-booking'; room: RoomData; billingInfo: BookingBillingInfo; setReservation: SetReservation;
    };


type Payload<Type extends ReservationReducerPayload[ 'type' ]> = SelectType<ReservationReducerPayload, Type>;

type Rreducer = (prevState: Reservation, action: ReservationReducerPayload, context: { app: AppContextType, property: PropertyContextType; }) => Reservation;

const reservationReducer: Rreducer /* React.Reducer<Reservation, ReservationReducerPayload> */ = (
    reservation, { type, ...payload }, context
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
                        startDate: momentToLodgifyDate(startDate),
                        endDate: momentToLodgifyDate(endDate)
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

            if (helpers.hasReservationNewProps(previousReservation, reservation) && helpers.isReservationValid(reservation)) {

                requests(context.app).getQuote({
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

        case 'create-booking': {
            const { room, billingInfo, setReservation } = payload as Payload<'create-booking'>;

            if (helpers.isReservationValid(reservation) && helpers.isBillingInfoValid(billingInfo)) {
                requests(context.app).createBooking({
                    propertyId: room.propertyId,
                    rooms: [ { roomTypeId: room.roomId, people: reservation.nbGuests } ],
                    guest: {
                        name: `${billingInfo.firstName} ${billingInfo.lastName}`,
                        email: billingInfo.email,
                        countryCode: billingInfo.country,
                        phone: billingInfo.phoneNumber,
                    },
                    messages: billingInfo.comment ? [
                        { subject: 'Message from website', message: billingInfo.comment, type: 'Renter' }
                    ] : undefined,
                    source: 'Manual',
                    sourceText: 'personal-website',
                    arrival: reservation.startDate,
                    departure: reservation.endDate,
                    status: 'Open', // '',
                    // payment_type?: '',
                    // payment_address?: '',
                    currencyCode: 'eur',
                    bookability: 'InstantBooking',
                    // origin?: '',
                    paymentWebsiteId: context.property.websiteId
                }).then(() => {
                    setReservation(prev => {
                        const bookings = prev.bookings || [];
                        return {
                            ...prev,
                            isLoading: false,
                            bookings: [
                                ...bookings, {
                                    isBooked: true,
                                    isPayed: false,
                                    startDate: reservation.startDate,
                                    endDate: reservation.endDate
                                }
                            ]
                        };
                    });
                }).catch(err => {
                    console.error(err);
                    setReservation(prev => ({ ...prev, isLoading: false }));
                });

                return setState({ isLoading: true });
            }

            return reservation;
        }

        default:
            throw new Error(`Reducer action type "${type as string}" is not handled!`);
    }
};


export const useReservation = (initRoom: RoomData, rooms: RoomsState) => {
    const [ reservation, setReservation ] = useState<Reservation>({ ...new ReservationDebug(), /* nbGuests: 1, roomValue: initRoom.value, */ isLoading: false });

    const appContext = useContext(AppContext);
    const propertyContext = useContext(PropertyContext);
    const context = { app: appContext, property: propertyContext };

    const updateReservation = useCallback((name: keyof BookingData, value: BookingData[ keyof BookingData ]) => {
        setReservation(reservation => {
            const newReservation = reservationReducer(reservation, { type: 'change-input', name, value }, context);

            return reservationReducer(newReservation, {
                type: 'request-accomodation-price',
                room: rooms[ newReservation.roomValue ],
                previousReservation: reservation,
                setReservation
            }, context);
        });
    }, []);

    return { setReservation: updateReservation, reservation };
};
