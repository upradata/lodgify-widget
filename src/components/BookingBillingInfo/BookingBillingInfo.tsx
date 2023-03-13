import './BookingBillingInfo.scss';

import countriesData from '../../countries-metadata.json';

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Dropdown, DropdownProps, FormValue, InputGroup, TextInput, Validation as ValidationType } from '@lodgify/ui';
// import { getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';
import { TextArea } from '@lodgify/ui/lib/es/components/inputs/TextArea';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';
// import debounce from 'debounce';
import { BookingBillingInfo as BookingBillingInfoType } from '../Booking/BookingComponent';
import { BookingContext } from '../Booking/BookingContext';
import { debounce } from '../../util';
import { Form, FormImperativeAPI, FormProps } from '../Form';
import { PhoneInput } from '../PhoneInput';

import type { DateRange, PropsWithStyleBase } from '../../util.types';


type DropdownOption = DropdownProps[ 'options' ][ number ] & { key?: string; };


const countriesOptions: DropdownProps[ 'options' ] = countriesData.map(({ name, code, }) => ({
    key: code,
    text: name,
    value: code,
    // label: name,
    imageUrl: `http://purecatamphetamine.github.io/country-flag-icons/3x2/${code.toUpperCase()}.svg`
} as DropdownOption));

const countriesDataByCode = countriesData.reduce((o, data) => ({ ...o, [ data.code ]: data }), {} as { [ Code: string ]: (typeof countriesData)[ number ]; });



type FormValueType = 'string' | 'email' | 'country' | 'phone' | 'date-range' | 'number';

type FormValueToType<V extends FormValueType> =
    V extends 'string' | 'email' | 'phone' ? string :
    V extends 'country' ? CountryCode :
    V extends 'date-range' ? DateRange :
    V extends 'number' ? number : never;


type Validations = { [ K in keyof BookingBillingInfoType ]: Partial<ValidationType> & { type: FormValueType; } };

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
    } satisfies Validations), [ formState.phoneCountry ]);

    return {
        formState,
        setFormState,
        setPropFormState: useCallback(function <P extends keyof UseFormProps>(prop: P, value: UseFormProps[ P ]) {
            setFormState(state => ({ ...state, [ prop ]: value }));
        }, [ setFormState ]),
        validation
    };
};


type RealValidations = ReturnType<typeof useForm>[ 'validation' ];

type FormValues = {
    [ K in keyof Validations ]: FormValueToType<RealValidations[ K ][ 'type' ]>
};

type FormInputValues = {
    [ K in keyof FormValues ]: FormValue<FormValues[ K ]>
};


// export type BookingDetailsData = FormValues;

export type BookingDetailsProps = PropsWithStyleBase & {
    onSubmit?: FormProps<FormValues>[ 'onSubmit' ];
    buttonText?: string;
} /* & CardProps */;



const getCountryOptionsWithSearch = (options: Pick<DropdownOption, 'value'>[], searchValue: string) => {
    const regExp = new RegExp(`^${searchValue}`, 'i');
    return options.filter(({ value: code }) => regExp.test(countriesDataByCode[ code as string ].name) || regExp.test(`${code}`));
};


export const BookingBillingInfo: React.FunctionComponent<BookingDetailsProps> = ({ onSubmit: handleSummit, buttonText }) => {
    const { billingInfo, setBillingInfo } = useContext(BookingContext);

    const [ billingState, setBillingState ] = useState(billingInfo);
    const { setPropFormState, validation } = useForm({ phoneCountry: billingState.country });

    const onSubmit: FormProps<FormInputValues>[ 'onSubmit' ] = useCallback((values => {
        const data = Object.entries(values).reduce((o, [ k, v ]) => ({ ...o, [ k ]: v.value }), {} as FormValues);
        handleSummit?.(data);
    }), [ handleSummit ]);


    const debouncedSetBillingInfo = debounce((billingState: BookingBillingInfoType) => { setBillingInfo(billingState); }, 200);

    useEffect(() => {
        debouncedSetBillingInfo(billingState);
    }, [ billingState ]);

    const onInputChange = useCallback((name: keyof FormValues, value: FormValues) => {
        setBillingState(state => ({ ...state, [ name ]: value }));
    }, [ setBillingInfo, ]);


    const formRef = useRef<FormImperativeAPI>(null);

    return (
        <div className="BookingBillingInfo">

            <Form submitButtonText={buttonText} validation={validation} onSubmit={onSubmit} onInputChange={onInputChange} ref={formRef}>

                <InputGroup>
                    <TextInput autoComplete="given-name" label="First name" name="firstName" value={billingState.firstName} />
                    <TextInput autoComplete="family-name" label="Last name" name="lastName" value={billingState.lastName} />
                </InputGroup>

                <TextInput autoComplete="email" label="Email" name="email" value={billingState.email} />

                <InputGroup>
                    <PhoneInput
                        width="seven"
                        label="Phone number"
                        name="phoneNumber"
                        autoComplete="tel"
                        defaultCountry={billingState.country}
                        value={billingState.phoneNumber}
                        onCountryChange={useCallback(code => setPropFormState('phoneCountry', code), [ setPropFormState ])} />

                    <Dropdown
                        width="five"
                        label="Country"
                        name="country"
                        options={countriesOptions}
                        value={billingState.country}
                        isClearable={false}
                        noResultsText="No country"
                        getOptionsWithSearch={getCountryOptionsWithSearch}
                        onChange={useCallback((name, _value) => {
                            formRef.current?.setInputState(name, { isBlurred: true });
                        }, [])} />
                </InputGroup>


                <TextArea label="Comments (optional)" name="comment" maxCharacters={4000} value={billingState.comment} />
            </Form>
        </div>
    );
};

/* 
<Card
            className="BookingDetails"
            header="Booking form"
            subHeader="Personal details"
            description="Fill in the form to validate the booking. At the end of the process, you will receive a confirmation email."
            {...cardProps}>

*/

BookingBillingInfo.displayName = 'BookingBillingInfo';
BookingBillingInfo.defaultProps = {
    // country: 'FR'
    buttonText: 'Ok'
};
