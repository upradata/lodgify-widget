import { Moment } from 'moment';
import React, { useCallback, useContext, useState } from 'react';
import { LocationOptions, Summary, Icon } from '@lodgify/ui';
import { SummaryProps } from '../../@types/@lodgify/ui/types';
import { lodgifyDateToMoment } from '../../lodgify-info/info';
import { RoomData } from '../../rooms.data';
import { isDateInRange, localizedDate, localizedPrice } from '../../util';
import { BookingProps } from '../Booking/BookingComponent';
import { BookingContext } from '../Booking/BookingContext';
import { Reservation } from '../Booking/reservation.type';
import { BookingDetails, BookingDetailsProps } from '../BookingDetails/BookingDetails';
import { PropertyBookingForm, PropertyBookingFormProps } from './PropertyBookingForm';
import { PropertyBookingButton } from './PropertySearchButton';
// import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/components/loader.css';
import './PropertyBooking.scss';
import { Bar } from '../Bar';
import { Modal } from '../Modal';
import { LodgifyDate } from '../../lodgify-requests';


export const PropertyBooking: React.FunctionComponent<BookingProps> = ({ onReservationChange, onReservationDetailsChange, onSubmit, ...reservation }) => {
    const { getRoom, rooms } = useContext(BookingContext);

    // const [ state, setState ] = useState<Partial<PropertyBookingData>>({});

    const [ isBookingDetailsOpen, setIsBookingDetailsOpen ] = useState(false);

    const onSearchFormOnSubmit: PropertyBookingFormProps[ 'onSubmit' ] = useCallback(data => {
        // setState(state => ({ ...state, ...data }));
        setIsBookingDetailsOpen(true);
    }, []);


    const onBookingDetailsSubmit: BookingDetailsProps[ 'onSubmit' ] = useCallback(data => {
        //  setState(state => ({ ...state, ...data }));
        onReservationDetailsChange(data);
        setIsBookingDetailsOpen(false);
       // onSubmit();
    }, []);

    const locationOptions = Object.values(rooms).map(room => ({ ...room, indent: 0 as const, text: room.name, imageUrl: room.image } as LocationOptions));

    const onPropertyBookingFormInputChange: PropertyBookingFormProps[ 'onInputChange' ] = useCallback((name, value) => {
        onReservationChange({ [ name ]: value });
    }, []);

    const room = getRoom(reservation.roomValue);

    const { searchProps, summaryProps } = useBookingProps({
        reservation,
        locationOptions,
        onInputChange: onPropertyBookingFormInputChange,
        room
    });

    return (
        <div className="PropertyBooking">
            <Bar isFixed>
                <Summary {...summaryProps} />
                <PropertyBookingForm {...searchProps} onSubmit={onSearchFormOnSubmit} />
            </Bar>

            <Modal isOpen={isBookingDetailsOpen} onOpenChange={useCallback(isOpen => { setIsBookingDetailsOpen(isOpen); }, [])}>
                <BookingDetails
                    header={<BookingHeader roomName={room.name} startDate={reservation.startDate} endDate={reservation.endDate} />}
                    subHeader={<BookingSubHeader price={100} nbGuest={reservation.nbGuests} nbNights={reservation.nbOfNights} />}
                    onSubmit={onBookingDetailsSubmit} />
            </Modal>
        </div>
    );
};


PropertyBooking.displayName = 'PropertyBooking';


const dateAsString = (date: LodgifyDate) => localizedDate(lodgifyDateToMoment(date));

const BookingHeader: React.FunctionComponent<{ roomName: string; startDate: LodgifyDate; endDate: LodgifyDate; }> = ({ roomName, startDate, endDate }) => {
    return (
        <div className="BookingHeader vertical-baseline">
            <span className="BookingHeader__location">{roomName}</span>

            <div className="BookingHeader__dates vertical-center">
                <span>{dateAsString(startDate)}</span>
                <Icon name="arrow right" />
                <span>{dateAsString(endDate)}</span>
            </div>
        </div>
    );
};


const plural = (n: number, s: string) => `${s}${n > 1 ? 's' : ''}`;

const BookingSubHeader: React.FunctionComponent<{ price: number; nbGuest: number; nbNights: number; }> = ({ price, nbGuest, nbNights }) => {

    return (
        <div className="BookingSubHeader vertical-center">
            <div className="BookingSubHeader__guests vertical-center" style={{ gap: 2 }}>
                <span style={{ marginTop: 1 }}>{nbGuest}x</span>
                <Icon name="guests" />
            </div>

            <div className="BookingSubHeader__nights vertical-center">
                ｜ <span>{nbNights} {plural(nbNights, 'night')}</span>
            </div>

            <div className="BookingSubHeader__price vertical-center" style={{ color: '#4b4b4b', marginLeft: 20 }}>
                {/* <Icon name="caret right" /> */}
                <span className="BookingSubHeader__price">{localizedPrice(price)}</span>
            </div>
        </div>
    );
};


type UseBookingProps = {
    reservation: Reservation;
    room: RoomData;
    locationOptions: LocationOptions[];
    onInputChange: PropertyBookingFormProps[ 'onInputChange' ];
};


const useBookingProps = ({ reservation, room, locationOptions, onInputChange }: UseBookingProps) => {

    const getIsDayBlocked = useCallback((date: Moment) => {
        const isBlocked = !!room.periodsNonAvailable?.find(({ start, end }) => isDateInRange(start, end)(date));
        return isBlocked;
    }, [ reservation.roomValue ]);


    const { nbGuests, price, isLoading, roomValue, startDate, endDate } = reservation;

    const bookButton = <PropertyBookingButton price={nbGuests * price} isLoading={isLoading} />;

    const searchProps: PropertyBookingFormProps = {
        // isFixed: true,
        // isStackable: true,
        searchButton: bookButton,
        getIsDayBlocked,
        // modalTrigger: <Button isPositionedRight isRounded isCompact>Check Availability</Button>,
        // summaryElement: <div>Property Information</div>,
        // modalSummaryElement: <div>Property information for mobile modal</div>,
        // isModalOpen: true,
        // isDisplayedAsModal: false,
        isDateRangePickerLoading: !room.periodsNonAvailable,
        onInputChange,
        locationInputLabel: 'Room',
        guestsInputLabel: `${nbGuests} Persons`,
        datesCheckInLabel: 'Arrival',
        datesCheckOutLabel: 'Departure',
        datesInputValue: {
            startDate: lodgifyDateToMoment(startDate),
            endDate: lodgifyDateToMoment(endDate)
        },
        maximumGuestsInputValue: 4,
        guestsInputValue: nbGuests,
        locationOptions,
        locationInputValue: roomValue
    };

    const summaryProps: SummaryProps = {
        locationName: 'Za Rohom',
        pricePerPeriod: room.price ? localizedPrice(room.price.min_price) : '?',
        pricePerPeriodPrefix: 'from',
        propertyName: room.name || 'Room',
        ratingNumber: room.rating || 4.5,
        isShowingPlaceholder: room.price === undefined || room.rating === undefined
    };

    return { searchProps, summaryProps };
};
