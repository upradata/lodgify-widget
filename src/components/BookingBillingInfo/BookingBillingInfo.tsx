import './BookingBillingInfo.scss';

import countriesData from '../../countries-metadata.json';

import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { InputGroup, TextInput } from '@lodgify/ui';
// import { getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';
import { TextArea } from '@lodgify/ui/lib/es/components/inputs/TextArea';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';
// import debounce from 'debounce';
// import { BookingBillingInfo as BookingBillingInfoType } from '../Booking/BookingComponent';
import { BookingContext } from '../Booking/BookingContext';
import { Dropdown, DropdownProps } from '../Dropdown';
import { Form, FormImperativeAPI, FormProps } from '../Form';
import { makeValidation, PropsValidationOptions } from '../Form/Form.validation';
import { PhoneInput } from '../PhoneInput';

import type { PropsWithStyleBase } from '../../util.types';


type DropdownOption = DropdownProps[ 'options' ][ number ] & { key?: string; };


const countriesOptions: DropdownProps[ 'options' ] = countriesData.map(({ name, code, }) => ({
    key: code,
    text: name,
    value: code,
    // label: name,
    imageUrl: `http://purecatamphetamine.github.io/country-flag-icons/3x2/${code.toUpperCase()}.svg`
} as DropdownOption));

const countriesDataByCode = countriesData.reduce((o, data) => ({ ...o, [ data.code ]: data }), {} as { [ Code: string ]: (typeof countriesData)[ number ]; });


// type Validations = { [ K in keyof BookingBillingInfoType ]: Partial<Validation> & { type: FormValueType; } };

type UseFormProps = { phoneCountry: CountryCode; };


const useForm = (props: UseFormProps) => {
    const [ formState, setFormState ] = useState(props);

    const propsValidation = useMemo(() => ({
        default: {
            isRequiredMessage: 'Required',
            invalidMessage: 'Invalid'
        },
        props: {
            email: makeValidation('email', { invalidMessage: 'Invalid email' }),
            firstName: makeValidation('string'),
            lastName: makeValidation('string'),
            phoneNumber: makeValidation('string', {
                invalidMessage: 'Invalid phone number',
                validate: value => {
                    const isValid = isValidPhoneNumber(value, formState.phoneCountry);
                    return { error: !isValid, value: isValid ? value : undefined };
                }
            }),
            country: makeValidation('string', { validate: value => ({ error: !countriesOptions.some(({ value: v }) => value === v) }) }),
            comment: makeValidation('string', { isRequired: false })
        }
    } satisfies PropsValidationOptions), [ formState.phoneCountry ]);

    return {
        formState,
        setFormState,
        setPropFormState: useCallback(function <P extends keyof UseFormProps>(prop: P, value: UseFormProps[ P ]) {
            setFormState(state => ({ ...state, [ prop ]: value }));
        }, []),
        propsValidation
    };
};

type RealPropsValidations = ReturnType<typeof useForm>[ 'propsValidation' ][ 'props' ];
/* 

type FormValues = {
    [ K in keyof RealPropsValidations ]: ValidationValue<RealPropsValidations[ K ][ 'input' ][ 'type' ]>
};
 */
type FormInputValues = Record<keyof RealPropsValidations, string>; // FormValues<keyof RealPropsValidations, string>;

// export type BookingDetailsData = FormValues;

export type BookingDetailsProps = PropsWithStyleBase & {
    onSubmit?: (data: FormInputValues) => void;
    buttonText?: string;
} /* & CardProps */;



const getCountryOptionsWithSearch = (options: Pick<DropdownOption, 'value'>[], searchValue: string) => {
    const regExp = new RegExp(`^${searchValue}`, 'i');
    return options.filter(({ value: code }) => regExp.test(countriesDataByCode[ code as string ].name) || regExp.test(`${code}`));
};


export const BookingBillingInfo: React.FunctionComponent<BookingDetailsProps> = ({ onSubmit, buttonText }) => {
    const { billingInfo, setBillingInfo } = useContext(BookingContext);

    // const [ billingState, setBillingState ] = useState(billingInfo);
    /* const { setPropFormState, propsValidation } = useForm({ phoneCountry: billingState.country }); */
    const { setPropFormState, propsValidation } = useForm({ phoneCountry: billingInfo.country });

    // const debouncedSetBillingInfo = debounce((billingState: Partial<BookingBillingInfoType>) => { setBillingInfo(billingState); }, 200);

    /* useEffect(() => {
        debouncedSetBillingInfo(billingState);
    }, [ billingState ]);
 */
    const onInputChange: FormProps<FormInputValues>[ 'onInputChange' ] = useCallback((name, value) => {
        // setBillingState(state => ({ ...state, [ name ]: value }));
        setBillingInfo({ [ name ]: value });
    }, [ setBillingInfo, ]);


    const formRef = useRef<FormImperativeAPI>(null);

    return (
        <div className="BookingBillingInfo">

            <Form submitButtonText={buttonText} validation={propsValidation} onSubmit={onSubmit} onInputChange={onInputChange} ref={formRef}>

                <InputGroup>
                    <TextInput autoComplete="given-name" label="First name" name="firstName" value={billingInfo.firstName} />
                    <TextInput autoComplete="family-name" label="Last name" name="lastName" value={billingInfo.lastName} />
                </InputGroup>

                <TextInput autoComplete="email" label="Email" name="email" value={billingInfo.email} />

                <InputGroup>
                    <PhoneInput
                        width="seven"
                        label="Phone number"
                        name="phoneNumber"
                        autoComplete="tel"
                        defaultCountry={billingInfo.country}
                        value={billingInfo.phoneNumber}
                        onCountryChange={useCallback(code => setPropFormState('phoneCountry', code), [])} />

                    <Dropdown
                        width="five"
                        label="Country"
                        name="country"
                        options={countriesOptions}
                        value={billingInfo.country}
                        isClearable={false}
                        noResultsMessage="No country"
                        getOptionsWithSearch={getCountryOptionsWithSearch}
                        onChange={useCallback((name, _value) => {
                            formRef.current?.setInputState(name, { isBlurred: true });
                        }, [])} />
                </InputGroup>


                <TextArea label="Comments (optional)" name="comment" maxCharacters={4000} value={billingInfo.comment} />
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
