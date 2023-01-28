import moment, { Moment } from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, ButtonProps, LocationOptions, SearchBarProps, TextPlaceholder } from '@lodgify/ui';
import { getLodgifyInfo, getReservationPrice, momentToLodgifyDate, lodgifyDateToMoment } from '../../lodgify-info/info';
import { LodgifyDate } from '../../lodgify-requests';
import { roomsData, RoomValues } from '../../rooms.data';
import { useRoomState } from '../../rooms.state';
import { getNbOfNights, isDateInRange, localizedPrice } from '../../util';
import { BookingRegistration } from '../BookingRegistration';
import { PropertySearchBar } from '../PropertySearchBar';
import { SearchBarFields } from '../SearchBar';
// import './RoomsSearch.css';


const locationOptions = roomsData.map(room => ({ ...room, indent: 0 as const, text: room.name, imageUrl: room.image } as LocationOptions));


const RoomSearchButton: React.FunctionComponent<{ price?: number; } & Omit<ButtonProps, 'children'>> = ({ price, ...buttonProps }) => {
    return <Button icon='search' isFormSubmit isRounded {...buttonProps}>
        <span>Book</span>
        {price > 0 ?
            <span className="search__price" style={{ marginLeft: '4px' }}>{localizedPrice(price)}</span> :
            <div className="search__price--placeholder-wrapper"><TextPlaceholder style={{ width: '20px' }} /><span>€</span></div>
        }
    </Button>;
};

RoomSearchButton.displayName = 'RoomSearchButton';


export type RoomsSearchProps = {

};

type Reservation = {
    roomValue?: RoomValues;
    nbOfNights?: number;
    startDate?: LodgifyDate;
    endDate?: LodgifyDate;
    price?: number;
    nbGuests: number;
};
export const RoomsSearch: React.FunctionComponent<{}> = props => {
    const { setRoom, rooms } = useRoomState();
    const [ reservation, setReservation ] = useState<Reservation>({ nbGuests: 1, roomValue: roomsData[ 0 ].value });

    const bookingRegistrationRef = useRef<React.ElementRef<typeof BookingRegistration>>();

    const getRoom = (roomValue: RoomValues) => rooms[ roomValue ];

    useEffect(() => {
        Object.values(roomsData).forEach(({ value }) => {
            setRoom({ type: 'request-property-availability', payload: { roomValue: value, start: '2023-01-01', end: '2024-01-01' } });
            setRoom({ type: 'request-property-info', payload: { roomValue: value } });
        });
    }, []);

    const getIsDayBlocked = (date: Moment) => {
        const isBlocked = !!getRoom(reservation.roomValue).periodsNonAvailable?.find(({ start, end }) => {
            /* const start = moment(period.start, 'YYYY-MM-DD');
            const end = moment(period.end, 'YYYY-MM-DD'); */

            // return period.bookings.length !== 0 && isDateInRange(start, end)(date);
            return isDateInRange(start, end)(date);
        });

        return isBlocked;
        //  return date.format('dddd') === 'Friday';
    };


    const [ isShowing, setIsShowing ] = useState(true);

    const onChangeInput: SearchBarProps<RoomValues>[ 'onChangeInput' ] = useCallback((data: SearchBarFields<RoomValues>) => {
        const { dates, guests, location: roomValue } = data;
        setReservation(reservation => {

            const newReservation = { ...reservation };
            console.log('ROOMS_SEARCH', { dates, guests, roomValue });

            const isNew = (prop: keyof typeof reservation) => reservation[ prop ] !== newReservation[ prop ];

            if (guests)
                newReservation.nbGuests = guests;

            if (roomValue)
                newReservation.roomValue = roomValue;

            if (dates?.startDate)
                newReservation.startDate = momentToLodgifyDate(dates.startDate);

            if (dates?.endDate)
                newReservation.endDate = momentToLodgifyDate(dates.endDate);

            const isDateRangeFilled = dates?.startDate && dates?.endDate;

            if (isDateRangeFilled) {
                const { startDate: start, endDate: end } = dates;

                const nbOfNights = getNbOfNights(start, end);
                newReservation.nbOfNights = nbOfNights;
            }

            // setReservation({ ...reservation, ...newReservation });

            if (isDateRangeFilled && (
                newReservation.nbOfNights > 0 && isNew('nbOfNights') ||
                isNew('startDate') ||
                isNew('endDate') ||
                isNew('roomValue')
            )) {
                //setReservation(prev => ({ ...prev, price: undefined }));
                newReservation.price = undefined;

                // Promise => will be executed on a next tick
                getLodgifyInfo(newReservation.roomValue, 'getDailyRates', {
                    start: newReservation.startDate,
                    end: momentToLodgifyDate(dates.endDate),
                    HouseId: getRoom(reservation.roomValue).propertyId,
                    RoomTypeId: getRoom(reservation.roomValue).roomId
                }).then(data => {
                    if (data.type === 'success') {
                        return getReservationPrice(data.json, { start: dates.startDate, end: dates.endDate });
                    }
                }).then(price => {
                    // newReservation.price = price;
                    setReservation(prev => ({ ...prev, price }));
                });
            }

            return newReservation;
        });
    }, []);

    const onBookClick = useCallback(() => {
        // bookingRegistrationRef.current.open();
    }, [ bookingRegistrationRef ]);

    const room = getRoom(reservation.roomValue);

    return <React.Fragment>
        <Button style={{ width: 'fit-content' }} hasShadow isRounded onClick={() => setIsShowing(!isShowing)}>
            {isShowing ? 'Hide' : 'Show'} search bar
        </Button>

        <BookingRegistration
            ref={bookingRegistrationRef}
            price={reservation.price}
            guests={{ min: 1, max: 200, value: reservation.nbGuests }}
            dates={{ startDate: reservation.startDate, endDate: reservation.endDate }}
            location={{ options: locationOptions, value: reservation.roomValue }} />

        {isShowing && (
            <PropertySearchBar
                search={{
                    isFixed: true,
                    // isStackable: true,
                    searchButton: <RoomSearchButton price={reservation.nbGuests * reservation.price} onClick={onBookClick} />,
                    getIsDayBlocked,
                    // modalTrigger: <Button isPositionedRight isRounded isCompact>Check Availability</Button>,
                    // summaryElement: <div>Property Information</div>,
                    // modalSummaryElement: <div>Property information for mobile modal</div>,
                    // isModalOpen: true,
                    isDisplayedAsModal: false,
                    isDateRangePickerLoading: !room.periodsNonAvailable,
                    onChangeInput,
                    locationInputLabel: 'Room',
                    guestsInputLabel: `${reservation.nbGuests} Persons`,
                    datesCheckInLabel: 'Arrival',
                    datesCheckOutLabel: 'Departure',
                    datesInputValue: {
                        startDate: lodgifyDateToMoment(reservation.startDate),
                        endDate: lodgifyDateToMoment(reservation.endDate)
                    },
                    maximumGuestsInputValue: 4,
                    guestsInputValue: reservation.nbGuests,
                    locationOptions,
                    locationInputValue: reservation.roomValue // roomsData[ 0 ].value
                }}
                summary={{
                    locationName: 'Za Rohom',
                    pricePerPeriod: room.price ? localizedPrice(room.price.min_price) : '?',
                    pricePerPeriodPrefix: 'from',
                    propertyName: room.name || 'Room',
                    ratingNumber: room.rating || 4.5,
                    isShowingPlaceholder: room.price === undefined || room.rating === undefined
                }}
            />
        )}
    </React.Fragment>;
};


RoomsSearch.displayName = 'RoomsSearch';
