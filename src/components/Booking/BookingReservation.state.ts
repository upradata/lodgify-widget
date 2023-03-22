import { useCallback, useContext, useState } from 'react';
import { AppContext, AppContextType } from '../../App/AppContext';
import { getNbOfNights } from '../../util';
import { requests } from '../../lodgify-requests';
import { lodgifyDateToMoment, momentToLodgifyDate } from '../../lodgify-info/info';
import { PriceType, QuotePrice, QuotePriceType } from '../../lodgify-requests/quote.type';
import { PropertyContext, PropertyContextType } from '../../App/PropertyContext';
import { Reservation, ReservationDebug, ReservationQuote, ReservationQuoteRoomCategoryPrices, ReservationQuoteRoomPriceDetails } from './reservation.type';

import type { BookingData, BookingDataValueOf } from './BookingComponent';
import type { SelectType } from '../../util.types';
import type { RoomData } from '../../rooms.data';
import type { RoomsState } from '../../rooms.state';
import { ReservationReducerAction, helpers, ReservationAction, Payload } from './BookingReservation.action';




type Reducer = (prevState: Reservation, action: ReservationReducerAction, context: { app: AppContextType, property: PropertyContextType; }) => Reservation;

const reservationReducer: Reducer /* React.Reducer<Reservation, ReservationReducerPayload> */ = (
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

                    const roomsPriceDetails: ReservationQuoteRoomPriceDetails[] = quote.roomTypes.map(({ people: nbGuests, priceTypes, subtotal }) => ({
                        nbGuests,
                        roomValue: reservation.roomValue,
                        categoriesPrices: getCategoriesPrices(priceTypes),
                        subTotal: subtotal
                    }));

                    const isPricesIncludesVat = !!quote.totalIncludingVat;
                    const totalGross = quote.amountGross;

                    const reservationQuote: ReservationQuote = {
                        totalGross,
                        totalNet: quote.totalExcludingVat,
                        vat: quote.totalVat,
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
                    // total: reservation.quote.totalGross,
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


//  Object.entries(data).forEach(([ name, value ]) => { setReservation(name as keyof BookingData, value); });
export const useReservation = (initRoom: RoomData, rooms: RoomsState) => {
    const [ reservation, setReservation ] = useState<Reservation>({ ...new ReservationDebug(), /* nbGuests: 1, roomValue: initRoom.value, */ isLoading: false });

    const appContext = useContext(AppContext);
    const propertyContext = useContext(PropertyContext);
    const context = { app: appContext, property: propertyContext };

    const updateReservation = useCallback(({ type, ...payload }: ReservationAction) => {
        switch (type) {
            case 'change-input': {
                const data = payload as SelectType<ReservationAction, 'change-input'>;

                setReservation(reservation => {
                    const newReservation = Object.entries(data).reduce((newReservation, [ name, value ]) => {
                        return reservationReducer(newReservation, { type: 'change-input', name: name as keyof BookingData, value }, context);
                    }, reservation);

                    return reservationReducer(newReservation, {
                        type: 'request-accomodation-price',
                        room: rooms[ newReservation.roomValue ],
                        previousReservation: reservation,
                        setReservation
                    }, context);
                });

                break;
            }

            case 'create-booking': {
                const { billingInfo } = payload as SelectType<ReservationAction, 'create-booking'>;

                setReservation(reservation => reservationReducer(reservation, {
                    type: 'create-booking',
                    room: rooms[ reservation.roomValue ],
                    billingInfo,
                    setReservation
                }, context));

                break;
            }

            default:
                throw new Error(`action type "${type as string}" is not handled!`);
        }

    }, []);

    return { setReservation: updateReservation, reservation };
};
