import './BookingRegistration.scss';

import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { Modal } from '@lodgify/ui';
import classnames from 'classnames';
// import { Bar } from '../Bar';
import { BookingForm, BookingFormProps } from './BookingForm';
import { BreakPoint } from '../MediaQuery/BreakPoint';
import { fragments } from '../../util';
import { ModalProps } from '../../@types/@lodgify/ui/types';


// import { PropertyBooking, PropertyBookingForm } from '../PropertyBooking';


type BookingModalProps = Omit<ModalProps, 'children'> & { hasBar?: 'bottom' | 'top' | false; } & BookingFormProps;


const BookingModal: React.FunctionComponent<BookingModalProps> = props => {
    const [ modalProps, bookingProps, { hasBar } ] = fragments(props, ModalProps, BookingFormProps, [ 'hasBar' ] as const);

    // const searchFormProps = {
    //      isFixed: true,
    //      // isStackable: true,
    //      // searchButton: <RoomSearchButton price={reservation.nbGuests * reservation.price} isLoading={reservation.isLoading} onClick={onBookClick} />,
    //     // getIsDayBlocked,
    //      // modalTrigger: <Button isPositionedRight isRounded isCompact>Check Availability</Button>,
    //      // summaryElement: <div>Property Information</div>,
    //      // modalSummaryElement: <div>Property information for mobile modal</div>,
    //      // isModalOpen: true,
    //      isDisplayedAsModal: false,
    //     //  isDateRangePickerLoading: !room.periodsNonAvailable,
    //     //  onChangeInput,
    //      locationInputLabel: 'Room',
    //     //  guestsInputLabel: `${reservation.nbGuests} Persons`,
    //      datesCheckInLabel: 'Arrival',
    //      datesCheckOutLabel: 'Departure',
    //     //  datesInputValue: {
    //     //      startDate: lodgifyDateToMoment(reservation.startDate),
    //     //      endDate: lodgifyDateToMoment(reservation.endDate)
    //     //  },
    //      maximumGuestsInputValue: 4,
    //     //  guestsInputValue: reservation.nbGuests,
    //     //  locationOptions,
    //     //  locationInputValue: reservation.roomValue // roomsData[ 0 ].value
    //  };

    // const summaryProps: SummaryProps = useMemo(() => {
    //     // const room = getRoom(reservation.roomValue);
    //     return {
    //         locationName: 'Za Rohom',
    //         pricePerPeriod: '100€',
    //         pricePerPeriodPrefix: 'from',
    //         propertyName: 'Room',
    //         ratingNumber: 4.5,
    //         isShowingPlaceholder: false, // room.price === undefined || room.rating === undefined
    //     };
    //     /*  return {
    //          locationName: 'Za Rohom',
    //          pricePerPeriod: room.price ? localizedPrice(room.price.min_price) : '?',
    //          pricePerPeriodPrefix: 'from',
    //          propertyName: room.name || 'Room',
    //          ratingNumber: room.rating || 4.5,
    //          isShowingPlaceholder: room.price === undefined || room.rating === undefined
    //      }; */
    // }, [ /* reservation.roomValue, getRoom  */ ]);

    return (
        <div>
            <Modal {...modalProps} className={classnames({ 'has-bottom-bar': hasBar === 'bottom', 'has-top-bar': hasBar === 'top' })}>
                {/* <FlexContainer alignItems="center" justifyContent="center"> */}
                <BookingForm {...bookingProps} />
                {/* </FlexContainer> */}
            </Modal>


            {/* <Bar isFixed>
                {<Summary {...summaryProps} />}
                <PropertySearchForm {...searchFormProps} />;
            </Bar> */}
        </div>
    );
};


BookingModal.displayName = 'BookingModal';

export type BookingRegistrationProps = BookingFormProps & {
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onOpenChange?: (isOpen: boolean) => void;
} & Pick<BookingModalProps, 'hasBar'>;


export type BookingRegistrationImperativeAPI = {
    open: () => void;
    close: () => void;
};


const _BookingRegistration: React.ForwardRefRenderFunction<BookingRegistrationImperativeAPI, BookingRegistrationProps> = (props, ref) => {
    const { isOpen, onOpen, onClose, onOpenChange, ...formProps } = props;

    const [ isEnabled, setIsEnabled ] = useState(isOpen);

    const _setIsEnabled = (isEnabled: boolean) => {
        isEnabled ? onOpen?.() : onClose?.();
        onOpenChange?.(isEnabled);
        setIsEnabled(isEnabled);
    };

    useEffect(() => { _setIsEnabled(isOpen); }, [ isOpen ]);

    useImperativeHandle(ref, () => ({
        open: () => { _setIsEnabled(true); },
        close: () => { _setIsEnabled(false); }
    }));

    const onModalClose = useCallback(() => { _setIsEnabled(false); }, [ _setIsEnabled ]);

    const bookingModalProps: BookingModalProps = {
        ...formProps,
        onClose: onModalClose,
        isOpen: isEnabled
    };

    return <React.Fragment>
        <BreakPoint max={1200}><BookingModal {...bookingModalProps} isFullscreen /></BreakPoint>
        <BreakPoint min={1201}><BookingModal {...bookingModalProps} size="small" /></BreakPoint>

        {/* <ShowOn parentProps={{ className: 'BIG' }} computer widescreen><BookingModal {...bookingModalProps} /></ShowOn>
        <ShowOn parentProps={{ className: 'SMALL' }} mobile tablet><BookingModal {...bookingModalProps} isFullscreen /></ShowOn> */}
    </React.Fragment>;
};

_BookingRegistration.displayName = 'BookingRegistration';

export const BookingRegistration = React.forwardRef(_BookingRegistration);
BookingRegistration.defaultProps = {
    country: {
        name: 'France',
        code: 'FR'
    }
};
