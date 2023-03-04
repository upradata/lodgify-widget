import countriesData from '../../countries-metadata.json';

import React, { useCallback, useMemo, useState } from 'react';
import {
    DateRangePicker,
    Dropdown,
    DropdownProps,
    FormProps,
    InputGroup,
    LocationOptions,
    NumberInput,
    TextInput
} from '@lodgify/ui';
// import { getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';
import { TextArea } from '@lodgify/ui/lib/es/components/inputs/TextArea';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';
import moment, { Moment } from 'moment';
import { Card } from '../Card';
import { DateRange, PropsWithStyleBase } from '../../util.types';
import { Form } from '../Form';
import { lodgifyDateToMoment } from '../../lodgify-info/info';
import { PhoneInput } from '../PhoneInput';
import { RoomValue } from '../../rooms.data';

import type { LodgifyDate } from '../../lodgify-requests';


type DropdownOption = DropdownProps[ 'options' ][ number ] & { key?: string; };


const countriesOptions: DropdownProps[ 'options' ] = countriesData.map(({ name, code, }) => ({
    key: code,
    text: name,
    value: code,
    // label: name,
    imageUrl: `http://purecatamphetamine.github.io/country-flag-icons/3x2/${code.toUpperCase()}.svg`
} as DropdownOption));

const countriesDataByCode = countriesData.reduce((o, data) => ({ ...o, [ data.code ]: data }), {} as { [ Code: string ]: (typeof countriesData)[ number ]; });

export type BookingRegisrationDate = DateRange<LodgifyDate | Moment>;

type AddValueToObject<T, O> = {
    [ K in keyof T ]: T[ K ] & O
};

type FormValue = 'string' | 'email' | 'country' | 'phone' | 'date-range' | 'number';

type FormValueToType<V extends FormValue> =
    V extends 'string' | 'email' | 'phone' ? string :
    V extends 'country' ? CountryCode :
    V extends 'date-range' ? DateRange :
    V extends 'number' ? number : never;


type UseFormProps = { phoneCountry: CountryCode; };

const useForm = (props: UseFormProps) => {
    const [ formState, setFormState ] = useState(props);

    const validation = {
        email: {
            isRequired: true,
            getIsValid: (value: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value),
            invalidMessage: `Invalid email`,
            isRequiredMessage: `Required`,
            type: 'email'
        },
        dateRange: {
            isRequired: true,
            getIsValid: (value: DateRange) => [ value?.startDate, value?.endDate ].every(date => moment(date).isValid()),
            getIsEmpty: (value: DateRange) => [ !!value?.startDate, !!value?.endDate ].includes(false),
            invalidMessage: `Invalid date`,
            isRequiredMessage: `Required`,
            type: 'date-range'
        },
        firstName: {
            isRequired: true,
            isRequiredMessage: `Required`,
            type: 'string'
        },
        lastName: {
            isRequired: true,
            isRequiredMessage: `Required`,
            type: 'string'
        },
        phoneNumber: {
            isRequired: true,
            getIsValid: (value: string) => isValidPhoneNumber(value, formState.phoneCountry),
            invalidMessage: `Invalid phone number`,
            isRequiredMessage: `Required`,
            type: 'phone'
        },
        guests: {
            isRequired: true,
            isRequiredMessage: `Required`,
            getIsValid: (value: number) => value > 0,
            type: 'number'
        },
        room: {
            isRequired: true,
            isRequiredMessage: `Required`,
            type: 'string'
        },
        country: {
            isRequired: true,
            isRequiredMessage: `Required`,
            getIsEmpty: (value: string) => {
                return !value;
            },
            type: 'country'
        },
        textArea: {
            isRequired: false,
            type: 'string'
        }
    } satisfies AddValueToObject<FormProps[ 'validation' ], { type: FormValue; }>;

    return {
        formState,
        setFormState,
        setPropFormState: function <P extends keyof UseFormProps>(prop: P, value: UseFormProps[ P ]) {
            setFormState({ ...formState, [ prop ]: value });
        },
        validation
    };
};
/* Record<string, {
    getIsEmpty?: Function;
    getIsValid?: Function;
    invalidMessage?: string;
    isRequired?: boolean;
    isRequiredMessage?: string;
}> */

type Validation = ReturnType<typeof useForm>[ 'validation' ];

type FormValues = {
    [ K in keyof Validation ]: FormValueToType<Validation[ K ][ 'type' ]>
};


export class BookingFormProps extends PropsWithStyleBase {
    guests = {
        min: undefined as number,
        max: undefined as number,
        value: undefined as number
    };
    location = {
        options: undefined as LocationOptions[],
        value: undefined as RoomValue
    };
    price: number;
    dates = new DateRange<LodgifyDate | Moment>() as BookingRegisrationDate;
    country?= {
        name: undefined as string,
        code: undefined as CountryCode
    };
};

const getCountryOptionsWithSearch = (options: Pick<DropdownOption, 'value'>[], searchValue: string) => {
    const regExp = new RegExp(`^${searchValue}`, 'i');
    return options.filter(({ value: code }) => regExp.test(countriesDataByCode[ code as string ].name) || regExp.test(`${code}`));
};


export const BookingForm: React.FunctionComponent<BookingFormProps> = ({
    price, location, dates, guests, country
}) => {
    // const [ currentCountry, setCurrentCountry ] = useState<CountryCode>(country.code);
    const { setPropFormState, validation } = useForm({ phoneCountry: country.code });
    /* const ref = useRef<React.Component<FormProps, FormState>>();

    useEffect(() => {
        const initValues: Partial<Record<keyof Validation, unknown>> = {
            guests: guests.value,
            room: location.value,
            dateRange: dates
        };

        const formInstance = ref.current;

        Object.entries(initValues).forEach(([ inputName, value ]) => {
            const inputValidation = getValidationWithDefaults(validation[ inputName ]) as FormProps[ 'validation' ][ string ];

            if (!inputValidation.getIsEmpty(value)) {
                if (inputValidation.getIsValid(value))
                    formInstance.setState({ [ inputName ]: { value } });
                else
                    formInstance.setState({ [ inputName ]: { error: inputValidation.invalidMessage } });
            }
        });

        // const oldHandleInputChange = (formInstance as any).handleInputChange;
        // (formInstance as any).handleInputChange = debounce((formInstance as any).handleInputChange, 300);
    }, []); */


    const onSubmit: FormProps<FormValues>[ 'onSubmit' ] = useCallback((values => {
        console.log('onSubmit', values);
    }), []);


    return (
        <Card
            className="BookingForm"
            header="Booking form"
            subHeader="sub-header very very very very long"
            description="Fill in the form to validate the booking. At the end of the process, you will receive a confirmation email.">

            <Form submitButtonText="Submit" validation={validation} onSubmit={onSubmit}>

                {/* <Paragraph>
                    Fill in the form to validate the booking. At the end of the process, you will receive a confirmation email.
                </Paragraph> */}

                <Dropdown label="Room" name="room" options={useMemo(() => location.options, [ location.options ])} value={location.value} />

                <DateRangePicker
                    startDatePlaceholderText="Check-in"
                    endDatePlaceholderText="Check-out"
                    label="Date Range"
                    name="dateRange"
                    value={{ startDate: lodgifyDateToMoment(dates?.startDate), endDate: lodgifyDateToMoment(dates?.endDate) }}
                />

                <NumberInput min={guests?.min || 0} max={guests?.max || Infinity} value={guests.value} label="Number of guests" name="guests" />

                <InputGroup>
                    <TextInput autoComplete="given-name" label="First name" name="firstName" />
                    <TextInput autoComplete="family-name" label="Last name" name="lastName" />
                </InputGroup>

                <TextInput autoComplete="email" label="Email" name="email" />

                <InputGroup>
                    <PhoneInput
                        width="seven"
                        label="Phone number"
                        name="phoneNumber"
                        autoComplete="tel"
                        defaultCountry={country.code}
                        onCountryChange={useCallback(code => setPropFormState('phoneCountry', code), [ setPropFormState ])} />

                    <Dropdown
                        width="five"
                        label="Country"
                        name="country"
                        options={countriesOptions}
                        value={country.code}
                        isClearable={false}
                        noResultsText="No country"
                        getOptionsWithSearch={getCountryOptionsWithSearch} />
                </InputGroup>

                <TextArea label="Comments" name="textArea" maxCharacters={4000} />
            </Form>
        </Card>
    );

    {/* <LodgifyForm headingText="Booking form" submitButtonText="Submit" validation={validation} onSubmit={onSubmit} >

                <Paragraph>
                    Fill in the form to validate the booking. At the end of the process, you will receive a confirmation email.
                </Paragraph>

                <Dropdown label="Room" name="room" options={useMemo(() => location.options, [ location.options ])} value={location.value} />

                <DateRangePicker
                    startDatePlaceholderText="Check-in"
                    endDatePlaceholderText="Check-out"
                    label="Date Range"
                    name="dateRange"
                    value={{ startDate: lodgifyDateToMoment(dates?.startDate), endDate: lodgifyDateToMoment(dates?.endDate) }}
                />

                <NumberInput min={guests?.min || 0} max={guests?.max || Infinity} value={guests.value} label="Number of guests" name="guests" />
                <TextInput autoComplete="given-name" label="First name" name="firstName" />
                <InputGroup>
                    <TextInput autoComplete="given-name" label="First name" name="firstName" />
                    <TextInput autoComplete="family-name" label="Last name" name="lastName" />
                </InputGroup>

                <TextInput autoComplete="email" label="Email" name="email" />

                <PhoneInput autoComplete="tel" label="Phone number" defaultCountry={country.code} name="phoneNumberCACA" />

                <Dropdown label="Country" name="country" options={useMemo(() => countriesOptions, [ countriesOptions ])} value={country.code} isSearchable isClearable={false} noResultsText="No country"
                    getOptionsWithSearch={useCallback((options: DropdownProps[ 'options' ], searchValue: string) => {
                        const regExp = new RegExp(`^${searchValue}`, 'i');
                        return options.filter(({ label, value }) => regExp.test(label) || regExp.test(`${value}`));
                    }, [])}
                />


                <TextArea label="Comments" name="textArea" maxCharacters={4000} />
            </LodgifyForm> */}
};

BookingForm.displayName = 'BookingForm';
