import { CountryCode, isValidPhoneNumber, PhoneNumber } from 'libphonenumber-js';
import moment, { Moment } from 'moment';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
    Button,
    DateRangePicker,
    Dropdown,
    Form,
    FormProps,
    FormState,
    InputGroup,
    LocationOptions,
    Modal,
    NumberInput,
    Paragraph,
    ShowOn,
    TextInput
} from '@lodgify/ui';
import { getEmptyRequiredInputs } from '@lodgify/ui/lib/es/components/collections/Form/utils/getEmptyRequiredInputs';
import { getValidationWithDefaults } from "@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults";
import { size } from '@lodgify/ui/lib/es/utils/size';
import { forEach } from '@lodgify/ui/lib/es/utils/for-each';
import { ModalProps } from '../../@types/@lodgify/ui/types';
import { lodgifyDateToMoment } from '../../lodgify-info/info';
import { LodgifyDate } from '../../lodgify-requests';
import { RoomValues } from '../../rooms.data';
import { fragments, partition } from '../../util';
import { DateRange, PropsWithStyleBase } from '../../util.types';
import { MediaQuery } from '../MediaQuery';
import { BreakPoint } from '../MediaQuery/BreakPoint';
import { PhoneInput } from '../PhoneInput';


export type BookingRegisrationDate = DateRange<LodgifyDate | Moment>;


const validation = (props: { country: CountryCode; }) => ({
    email: {
        isRequired: true,
        getIsValid: (value: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value),
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
} satisfies FormProps[ 'validation' ]);


type Validation = ReturnType<typeof validation>;

class BookingFormProps extends PropsWithStyleBase {
    guests = {
        min: undefined as number,
        max: undefined as number,
        value: undefined as number
    };
    location = {
        options: undefined as LocationOptions[],
        value: undefined as RoomValues
    };
    price: number;
    dates = new DateRange<LodgifyDate | Moment>() as BookingRegisrationDate;
};


const BookingForm: React.FunctionComponent<BookingFormProps> = ({
    price, location, dates, guests
}) => {
    const [ country, setCountry ] = useState<CountryCode>('SK');
    const ref = useRef<React.Component<FormProps, FormState>>();

    useEffect(() => {
        const initValues: Partial<Record<keyof Validation, unknown>> = {
            guests: guests.value,
            room: location.value,
            dateRange: dates
        };

        const formInstance = ref.current;
        const inputsValidation = validation({ country });

        Object.entries(initValues).forEach(([ inputName, value ]) => {
            const inputValidation = getValidationWithDefaults(inputsValidation[ inputName ]) as FormProps[ 'validation' ][ string ];

            if (!inputValidation.getIsEmpty(value)) {
                if (inputValidation.getIsValid(value))
                    formInstance.setState({ [ inputName ]: { value } });
                else
                    formInstance.setState({ [ inputName ]: { error: inputValidation.invalidMessage } });
            }
        });
    }, []);

    return <div className="BookingForm">
        <Form ref={ref} headingText="Booking form" submitButtonText="Submit" validation={validation({ country })}>

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

type BookingModalProps = Partial<Pick<ModalProps, 'onClose' | 'isOpen' | 'isFullscreen' | 'size'>> & BookingFormProps & { content?: string; };

const BookingModal: React.FunctionComponent<BookingModalProps> = props => {
    const [ modalProps, bookingProps, { content } ] = fragments(props, ModalProps, BookingFormProps, [ 'content' ] as const);

    /* const {
        isFullscreen = false, size, onClose, isOpen = false, content, ...bookingProps
    } = props; */

    /* return <div>{content}</div>; */
    return <Modal {...modalProps} /* onClose={onClose} isOpen={isOpen} isFullscreen={isFullscreen} size={size} */>
        <BookingForm {...bookingProps} />
        {content}
    </Modal>;
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

    // useEffect(() => { setIsEnabled(isOpen); }, [ isOpen ]);

    useImperativeHandle(ref, () => ({
        open: () => { setIsEnabled(true); },
        close: () => { setIsEnabled(false); }
    }));

    const onClose = useCallback(() => { setIsEnabled(false); }, [ setIsEnabled ]);

    const bookingModalProps: BookingModalProps = {
        onClose,
        ...formProps
    };

    return <React.Fragment>
        <BreakPoint max={1200}><BookingModal {...bookingModalProps} isFullscreen isOpen={isEnabled} /></BreakPoint>
        <BreakPoint min={1201}><BookingModal {...bookingModalProps} isOpen={isEnabled} /></BreakPoint>

        {/* <ShowOn parentProps={{ className: 'BIG' }} computer widescreen><BookingModal {...bookingModalProps} /></ShowOn>
        <ShowOn parentProps={{ className: 'SMALL' }} mobile tablet><BookingModal {...bookingModalProps} isFullscreen /></ShowOn> */}
    </React.Fragment>;
};

_BookingRegistration.displayName = 'BookingRegistration';
export const BookingRegistration = React.forwardRef(_BookingRegistration);
