import './BookingDetails.scss';

import countriesData from '../../countries-metadata.json';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Dropdown, DropdownProps, FormValue, InputGroup, TextInput } from '@lodgify/ui';
// import { getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';
import { TextArea } from '@lodgify/ui/lib/es/components/inputs/TextArea';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';
import { Moment } from 'moment';
import { Card, CardProps } from '../Card';
import { DateRange, PropsWithStyleBase } from '../../util.types';
import { Form, FormImperativeAPI, FormProps } from '../Form';
import { LodgifyDate } from '../../lodgify-requests';
import { partition } from '../../util';
import { PhoneInput } from '../PhoneInput';


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

type FormValueType = 'string' | 'email' | 'country' | 'phone' | 'date-range' | 'number';

type FormValueToType<V extends FormValueType> =
    V extends 'string' | 'email' | 'phone' ? string :
    V extends 'country' ? CountryCode :
    V extends 'date-range' ? DateRange :
    V extends 'number' ? number : never;


type UseFormProps = { phoneCountry: CountryCode; };

const useForm = (props: UseFormProps) => {
    const [ formState, setFormState ] = useState(props);

    const validation = useMemo(() => ({
        email: {
            isRequired: true,
            getIsValid: (value: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value),
            invalidMessage: `Invalid email`,
            isRequiredMessage: `Required`,
            type: 'email'
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
        country: {
            isRequired: true,
            isRequiredMessage: `Required`,
            getIsValid: (value: string) => countriesOptions.some(({ value: v }) => value === v),
            type: 'country'
        },
        comment: {
            isRequired: false,
            type: 'string'
        }
    } satisfies AddValueToObject<FormProps[ 'validation' ], { type: FormValueType; }>), [ formState ]);

    return {
        formState,
        setFormState,
        setPropFormState: useCallback(function <P extends keyof UseFormProps>(prop: P, value: UseFormProps[ P ]) {
            setFormState(state => ({ ...state, [ prop ]: value }));
        }, [ setFormState ]),
        validation
    };
};


type Validation = ReturnType<typeof useForm>[ 'validation' ];

type FormValues = {
    [ K in keyof Validation ]: FormValueToType<Validation[ K ][ 'type' ]>
};


type FormInputValues = {
    [ K in keyof FormValues ]: FormValue<FormValues[ K ]>
};


export type BookingDetailsData = FormValues;

export type BookingDetailsProps = PropsWithStyleBase & {
    onSubmit?: FormProps<FormValues>[ 'onSubmit' ];
    onInputChange?: FormProps<FormValues>[ 'onInputChange' ];
} & CardProps & Partial<FormValues>;



const getCountryOptionsWithSearch = (options: Pick<DropdownOption, 'value'>[], searchValue: string) => {
    const regExp = new RegExp(`^${searchValue}`, 'i');
    return options.filter(({ value: code }) => regExp.test(countriesDataByCode[ code as string ].name) || regExp.test(`${code}`));
};


export const BookingDetails: React.FunctionComponent<BookingDetailsProps> = props => {
    const [ cardProps, { onSubmit: handleSummit, onInputChange: handleInputChange, ...formData } ] = partition(props, CardProps);

    const { setPropFormState, validation } = useForm({ phoneCountry: formData.country });

    const onSubmit: FormProps<FormInputValues>[ 'onSubmit' ] = useCallback((values => {
        const data = Object.entries(values).reduce((o, [ k, v ]) => ({ ...o, [ k ]: v.value }), {} as FormValues);
        handleSummit?.(data);
    }), [ handleSummit ]);


    const onInputChange = useCallback((name: keyof FormValues, value: FormValues) => {
        handleInputChange?.(name, value);
    }, [ handleInputChange ]);


    const formRef = useRef<FormImperativeAPI>(null);



    return (
        <Card
            className="BookingDetails"
            header="Booking form"
            subHeader="Personal details"
            description="Fill in the form to validate the booking. At the end of the process, you will receive a confirmation email."
            {...cardProps}>

            <Form submitButtonText="Ok" validation={validation} onSubmit={onSubmit} onInputChange={onInputChange} ref={formRef}>

                <InputGroup>
                    <TextInput autoComplete="given-name" label="First name" name="firstName" value={formData.firstName} />
                    <TextInput autoComplete="family-name" label="Last name" name="lastName" value={formData.lastName} />
                </InputGroup>

                <TextInput autoComplete="email" label="Email" name="email" value={formData.email} />

                <InputGroup>
                    <PhoneInput
                        width="seven"
                        label="Phone number"
                        name="phoneNumber"
                        autoComplete="tel"
                        defaultCountry={formData.country}
                        value={formData.phoneNumber}
                        onCountryChange={useCallback(code => setPropFormState('phoneCountry', code), [ setPropFormState ])} />

                    <Dropdown
                        width="five"
                        label="Country"
                        name="country"
                        options={countriesOptions}
                        value={formData.country}
                        isClearable={false}
                        noResultsText="No country"
                        getOptionsWithSearch={getCountryOptionsWithSearch}
                        onChange={useCallback((name, _value) => {
                            formRef.current?.setInputState(name, { isBlurred: true });
                        }, [])} />
                </InputGroup>


                <TextArea label="Comments" name="comment" maxCharacters={4000} value={formData.comment} />
            </Form>
        </Card>
    );
};

BookingDetails.displayName = 'BookingDetails';
BookingDetails.defaultProps = {
    country: 'FR'
};
