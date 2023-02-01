import { Moment } from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/components/loader.css';
import { Loader } from 'semantic-ui-react';
import { Button, ButtonProps, LocationOptions, SummaryProps, TextPlaceholder } from '@lodgify/ui';
import { getLodgifyInfo, getReservationPrice, lodgifyDateToMoment, momentToLodgifyDate } from '../../lodgify-info/info';
import { LodgifyDate } from '../../lodgify-requests';
import { roomsData, RoomValues } from '../../rooms.data';
import { useRoomState } from '../../rooms.state';
import { getNbOfNights, isDateInRange, localizedPrice } from '../../util';
import { BookingRegistration } from '../BookingRegistration';
import { PropertySearchBar } from '../PropertySearchBar';
import { SearchBarFields, SearchBarProps } from '../SearchBar';


// import './RoomsSearch.css';


const locationOptions = roomsData.map(room => ({ ...room, indent: 0 as const, text: room.name, imageUrl: room.image } as LocationOptions));


const RoomSearchButton: React.FunctionComponent<{ price?: number; isLoading?: boolean; } & Omit<ButtonProps, 'children'>> = ({ price, isLoading, ...buttonProps }) => {
    return <Button icon='search' isFormSubmit isRounded {...buttonProps}>
        <span>Book</span>
        {price > 0 ?
            price && <span className="search__price" style={{ marginLeft: '4px' }}>{localizedPrice(price)}</span> :

            isLoading ?
                <div className="search__price--placeholder-wrapper">
                    <div style={{ position: 'relative', width: '40px' }}><Loader active size="tiny" inverted indeterminate></Loader></div><span>€</span>
                </div> :
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
    isLoading?: boolean;
};
export const RoomsSearch: React.FunctionComponent<{}> = props => {
    const { setRoom, rooms } = useRoomState();
    const [ reservation, setReservation ] = useState<Reservation>({ nbGuests: 1, roomValue: roomsData[ 0 ].value, isLoading: false });

    const bookingRegistrationRef = useRef<React.ElementRef<typeof BookingRegistration>>();

    const getRoom = useCallback((roomValue: RoomValues) => rooms[ roomValue ], [ rooms ]);

    useEffect(() => {
        Object.values(roomsData).forEach(({ value }) => {
            setRoom({ type: 'request-property-availability', payload: { roomValue: value, start: '2023-01-01', end: '2024-01-01' } });
            setRoom({ type: 'request-property-info', payload: { roomValue: value } });
        });
    }, []);

    const getIsDayBlocked = useCallback((date: Moment) => {
        const isBlocked = !!getRoom(reservation.roomValue).periodsNonAvailable?.find(({ start, end }) => {
            /* const start = moment(period.start, 'YYYY-MM-DD');
            const end = moment(period.end, 'YYYY-MM-DD'); */

            // return period.bookings.length !== 0 && isDateInRange(start, end)(date);
            return isDateInRange(start, end)(date);
        });

        return isBlocked;
        //  return date.format('dddd') === 'Friday';
    }, [ reservation.roomValue ]);


    const [ isShowing, setIsShowing ] = useState(true);

    const onChangeInput: SearchBarProps<RoomValues>[ 'onChangeInput' ] = useCallback((data: SearchBarFields<RoomValues>) => {
        const { guests, dates } = data;
        const isDefined = (prop: keyof SearchBarFields<RoomValues>) => prop in data;

        setReservation(reservation => {

            const newReservation = { ...reservation };
            console.log('ROOMS_SEARCH', data);

            const isNew = (prop: keyof typeof reservation) => reservation[ prop ] !== newReservation[ prop ];

            if (guests > 0)
                newReservation.nbGuests = data.guests;

            if (data.location)
                newReservation.roomValue = data.location;

            if (isDefined('dates') && dates.startDate !== undefined)
                newReservation.startDate = momentToLodgifyDate(data.dates.startDate);

            if (isDefined('dates') && dates.endDate !== undefined)
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
                newReservation.isLoading = true;

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
                    setReservation(prev => ({ ...prev, price, isLoading: false }));
                });
            }

            return newReservation;
        });
    }, [ getRoom ]);

    const onBookClick = useCallback(() => {
        bookingRegistrationRef.current.open();
    }, [ bookingRegistrationRef ]);


    const searchProps: SearchBarProps = useMemo(() => {
        const room = getRoom(reservation.roomValue);

        return {
            isFixed: true,
            // isStackable: true,
            searchButton: <RoomSearchButton price={reservation.nbGuests * reservation.price} isLoading={reservation.isLoading} onClick={onBookClick} />,
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
        };
    }, [ reservation, getRoom ]);


    const summaryProps: SummaryProps = useMemo(() => {
        const room = getRoom(reservation.roomValue);

        return {
            locationName: 'Za Rohom',
            pricePerPeriod: room.price ? localizedPrice(room.price.min_price) : '?',
            pricePerPeriodPrefix: 'from',
            propertyName: room.name || 'Room',
            ratingNumber: room.rating || 4.5,
            isShowingPlaceholder: room.price === undefined || room.rating === undefined
        };
    }, [ reservation.roomValue, getRoom ]);


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

        {isShowing && <PropertySearchBar {...searchProps} {...summaryProps} />}
    </React.Fragment>;
};


RoomsSearch.displayName = 'RoomsSearch';
