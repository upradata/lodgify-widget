import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';
import { Moment } from 'moment';
import React, { useCallback, useRef, useState } from 'react';
import { Dropdown, DropdownProps, FormProps, FormValue, InputGroup, TextInput } from '@lodgify/ui';
// import { getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';
import { TextArea } from '@lodgify/ui/lib/es/components/inputs/TextArea';
import countriesData from '../../countries-metadata.json';
import { LodgifyDate } from '../../lodgify-requests';
import { fragments } from '../../util';
import { DateRange, PropsWithStyleBase } from '../../util.types';
import { Card, CardProps } from '../Card';
import { Form, FormImperativeAPI } from '../Form';
import { PhoneInput } from '../PhoneInput';
import './BookingDetails.scss';


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

    const validation = {
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
            getIsEmpty: (value: string) => {
                return !value;
            },
            type: 'country'
        },
        textArea: {
            isRequired: false,
            type: 'string'
        }
    } satisfies AddValueToObject<FormProps[ 'validation' ], { type: FormValueType; }>;

    return {
        formState,
        setFormState,
        setPropFormState: function <P extends keyof UseFormProps>(prop: P, value: UseFormProps[ P ]) {
            setFormState({ ...formState, [ prop ]: value });
        },
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
    initialCountry?: {
        name: string;
        code: CountryCode;
    };
    onSubmit?: (data: BookingDetailsData) => void;

} & CardProps;


const getCountryOptionsWithSearch = (options: Pick<DropdownOption, 'value'>[], searchValue: string) => {
    const regExp = new RegExp(`^${searchValue}`, 'i');
    return options.filter(({ value: code }) => regExp.test(countriesDataByCode[ code as string ].name) || regExp.test(`${code}`));
};


export const BookingDetails: React.FunctionComponent<BookingDetailsProps> = ({ initialCountry, ...props }) => {
    const { setPropFormState, validation } = useForm({ phoneCountry: initialCountry.code });
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


    const onSubmit: FormProps<FormInputValues>[ 'onSubmit' ] = useCallback((values => {
        const v = Object.entries(values).reduce((o, [ k, v ]) => ({ ...o, [ k ]: v.value }), {} as FormValues);
        props.onSubmit?.(v);
    }), []);

    const [ cardProps ] = fragments(props, CardProps);
    const formRef = useRef<FormImperativeAPI>(null);

    return (
        <Card
            className="BookingDetails"
            header="Booking form"
            subHeader="Personal details"
            description="Fill in the form to validate the booking. At the end of the process, you will receive a confirmation email."
            {...cardProps}>

            <Form submitButtonText="Ok" validation={validation} onSubmit={onSubmit} ref={formRef}>

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
                        defaultCountry={initialCountry.code}
                        onCountryChange={useCallback(code => setPropFormState('phoneCountry', code), [])} />

                    <Dropdown
                        width="five"
                        label="Country"
                        name="country"
                        options={countriesOptions}
                        value={initialCountry.code}
                        isClearable={false}
                        noResultsText="No country"
                        getOptionsWithSearch={getCountryOptionsWithSearch}
                        onChange={useCallback((name, _value) => {
                            formRef.current?.setInputState(name, { isBlurred: true });
                        }, [])} />
                </InputGroup>


                <TextArea label="Comments" name="textArea" maxCharacters={4000} />
            </Form>
        </Card>
    );
};

BookingDetails.displayName = 'BookingDetails';
BookingDetails.defaultProps = {
    initialCountry: {
        name: 'France',
        code: 'FR'
    }
};
