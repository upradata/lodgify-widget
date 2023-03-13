import { useCallback, useContext, useMemo } from 'react';
import { isDateInRange, localizedPrice } from '../../util';
import { lodgifyDateToMoment } from '../../lodgify-info/info';
import { PropertyBookingFormButton } from './PropertyBookingFormButton';

import type { LocationOptions, SummaryProps } from '@lodgify/ui';
import type { Moment } from 'moment';
import { BookingContext } from '../Booking/BookingContext';
import { PropertyBookingFormProps } from './PropertyBookingForm.props';


export type UsePropertyBookingFormProps = { buttonText?: string; };

export const usePropertyBookingFormProps = ({ buttonText = 'Book' }: UsePropertyBookingFormProps = {}) => {

    const { reservation, setReservation, rooms, getRoom } = useContext(BookingContext);
    const room = getRoom(reservation.roomValue);

    const locationOptions = Object.values(rooms).map(room => ({ ...room, indent: 0 as const, text: room.name, imageUrl: room.image } as LocationOptions));

    const onInputChange: PropertyBookingFormProps[ 'onInputChange' ] = useCallback((name, value) => { setReservation({ [ name ]: value }); }, []);

    const getIsDayBlocked = useCallback((date: Moment) => {
        const isBlocked = !!room.periodsNonAvailable?.find(({ start, end }) => isDateInRange(start, end)(date));
        return isBlocked;
    }, [ room.periodsNonAvailable ]);


    const { nbGuests, isLoading, quote, roomValue, startDate, endDate } = reservation;

    const bookButton = (
        <PropertyBookingFormButton loaderInverted price={quote ? nbGuests * quote.totalGross : undefined} isFormSubmit isLoading={isLoading}>
            {buttonText}
        </PropertyBookingFormButton>
    );

    const searchProps: PropertyBookingFormProps = {
        // isFixed: true,
        // isStackable: true,
        searchButton: bookButton,
        getIsDayBlocked,
        minimumNights: room.minStay,
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
        datesInputValue: useMemo(() => ({
            startDate: lodgifyDateToMoment(startDate),
            endDate: lodgifyDateToMoment(endDate)
        }), [ startDate, endDate ]),
        maximumGuestsInputValue: room.maxGuests || Infinity,
        guestsInputValue: nbGuests,
        locationOptions,
        locationInputValue: roomValue
    };

    const summaryProps: SummaryProps = {
        locationName: 'Za Rohom',
        pricePerPeriod: room.price ? localizedPrice(room.price.minPrice) : '...',
        pricePerPeriodPrefix: 'from',
        propertyName: room.name || 'Room',
        ratingNumber: room.rating || 4.5,
        isShowingPlaceholder: room.price === undefined || room.rating === undefined
    };

    return { searchProps, summaryProps };
};
