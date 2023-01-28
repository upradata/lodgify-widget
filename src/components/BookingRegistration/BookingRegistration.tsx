import { CountryCode, isValidPhoneNumber, PhoneNumber } from 'libphonenumber-js';
import moment, { Moment } from 'moment';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import {
    Button,
    DateRange,
    DateRangePicker,
    Dropdown,
    Form,
    FormProps,
    InputGroup,
    LocationOptions,
    Modal,
    ModalProps,
    NumberInput,
    Paragraph,
    ShowOn,
    TextInput
} from '@lodgify/ui';
import { lodgifyDateToMoment } from '../../lodgify-info/info';
import { LodgifyDate } from '../../lodgify-requests';
import { RoomValues } from '../../rooms.data';
import { PhoneInput } from '../PhoneInput';
import { MediaQuery } from '../MediaQuery';


export type BookingRegisrationDate = DateRange<LodgifyDate | Moment>;

const validation = (props: { country: CountryCode; }): FormProps[ 'validation' ] => ({
    email: {
        isRequired: true,
        getIsValid: (value: string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),
        invalidMessage: `Invalid email`,
        isRequiredMessage: `Required`
    },
    dateRange: {
        isRequired: true,
        getIsValid: (value: DateRange) => [ value?.startDate, value?.endDate ].every(date => moment(date).isValid()),
        getIsEmpty: (value: DateRange) => [ !!value?.startDate, !!value?.endDate ].includes(false),
        invalidMessage: `Invalid date`,
        isRequiredMessage: `Required`
    },
    firstName: {
        isRequired: true,
        isRequiredMessage: `Required`,
    },
    lastName: {
        isRequired: true,
        isRequiredMessage: `Required`,
    },
    phoneNumber: {
        isRequired: true,
        getIsValid: (value: string) => isValidPhoneNumber(value, props.country),
        getIsEmpty: (value: string) => !value,
        invalidMessage: `Invalid phone number`,
        isRequiredMessage: `Required`
    },
    guests: {
        isRequired: true,
        isRequiredMessage: `Required`
    },
    room: {
        isRequired: true,
        isRequiredMessage: `Required`
    }
});


type BookingFormProps = {
    guests: {
        min?: number;
        max?: number;
        value: number;
    };
    location: {
        options: LocationOptions[];
        value: RoomValues;
    };
    price: number;
    dates: BookingRegisrationDate;
};


const BookingForm: React.FunctionComponent<BookingFormProps> = ({
    price, location, dates, guests
}) => {
    const [ country, setCountry ] = useState<CountryCode>('SK');

    return <div className="BookingForm">
        <Form headingText="Booking form" submitButtonText="Submit" validation={validation({ country })}>

            <Paragraph>
                Fill in the form to validate the booking. At the end of the process, you will receive a confirmation email.
            </Paragraph>

            <Dropdown label="Dropdown room" name="room" options={location.options} value={location.value} />

            <DateRangePicker
                startDatePlaceholderText="Check-in"
                endDatePlaceholderText="Check-out"
                name="dateRange"
                value={{ startDate: lodgifyDateToMoment(dates?.startDate), endDate: lodgifyDateToMoment(dates?.endDate) }}
            />

            <NumberInput min={guests?.min || 0} max={guests?.max || Infinity} value={guests.value} label="Number of guests" name="guests" />

            {/* <VerticalGutters /> */}
            <InputGroup>
                <TextInput label="First name" name="firstName" />
                <TextInput label="Last name" name="lastName" />
            </InputGroup>

            <TextInput label="email" name="email" />

            <PhoneInput label="Phone number" defaultCountry="SK" name="phoneNumber" onCountryChange={setCountry} />
        </Form>

    </div>;
};

BookingForm.displayName = 'BookingForm';

type BookingModalProps = Pick<ModalProps, 'onClose' | 'isOpen' | 'isFullscreen' | 'size'> & BookingFormProps;

const BookingModal: React.FunctionComponent<BookingModalProps & { content?: string; }> = (props) => {
    const {
        isFullscreen = false, size, onClose, isOpen = false, content, ...bookingProps
    } = props;

    return <div>{content}</div>;
    /* return <Modal onClose={onClose} isOpen={isOpen} isFullscreen={isFullscreen} size={size}>
        <BookingForm {...bookingProps} />
        {content}
    </Modal>; */
};


BookingModal.displayName = 'BookingModal';

export type BookingRegistrationProps = BookingFormProps & { isOpen?: boolean; };
export type BookingRegistrationImperativeAPI = {
    open: () => void;
    close: () => void;
};


const _BookingRegistration: React.ForwardRefRenderFunction<BookingRegistrationImperativeAPI, BookingRegistrationProps> = (props, ref) => {
    const { isOpen, ...formProps } = props;

    const [ isEnabled, setIsEnabled ] = useState(isOpen);
    const [ isActive, setIsActive ] = useState<Record<string, boolean>>({});

    useEffect(() => { setIsEnabled(isOpen); }, [ isOpen ]);

    useImperativeHandle(ref, () => ({
        open: () => { setIsEnabled(true); },
        close: () => { setIsEnabled(false); }
    }));

    const onClose = useCallback(() => { setIsEnabled(false); }, [ setIsEnabled ]);

    const bookingModalProps: BookingModalProps = {
        onClose,
        ...formProps
    };

    const onMediaQuery = (media: string, isActive: boolean) => setIsActive(prev => ({ ...prev, [ media ]: isActive }));

    const breakpoints = useMemo(() => [
        {
            max: 1200,
            className: '1200',
            children: ({ isEnabled, isActive }) => <BookingModal {...bookingModalProps} content="1200" size="large" isFullscreen isOpen={isEnabled && isActive[ '1200' ]} />,
            onActive: () => onMediaQuery('1200', true),
            onInactive: () => onMediaQuery('1200', false),
        },
        {
            min: 1201,
            className: '1201',
            children: ({ isEnabled, isActive }) => <BookingModal {...bookingModalProps} content="1201" isFullscreen isOpen={isEnabled && isActive[ '1201' ]} />,
            onActive: () => onMediaQuery('1201', true),
            onInactive: () => onMediaQuery('1201', false),
        }
    ], []);

    return <React.Fragment>
        <MediaQuery
            parentProps={{ isEnabled, isActive }}
            breakpoints={breakpoints}
        />

        {/* <ShowOn parentProps={{ className: 'BIG' }} computer widescreen><BookingModal {...bookingModalProps} /></ShowOn>
        <ShowOn parentProps={{ className: 'SMALL' }} mobile tablet><BookingModal {...bookingModalProps} isFullscreen /></ShowOn> */}
    </React.Fragment>;
};

_BookingRegistration.displayName = 'BookingRegistration';
export const BookingRegistration = React.forwardRef(_BookingRegistration);
