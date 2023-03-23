import './BookingBillingInfo.scss';
import countriesData from '../../countries-metadata.json';

import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { InputGroup, TextInput } from '@lodgify/ui';
// import { getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';
import { TextArea } from '@lodgify/ui/lib/es/components/inputs/TextArea';
// import debounce from 'debounce';
// import { BookingBillingInfo as BookingBillingInfoType } from '../Booking/BookingComponent';
import { BookingContext } from '../Booking/BookingContext';
import { Dropdown, DropdownProps } from '../Dropdown';
import { Form, FormImperativeAPI, FormProps } from '../Form';
import { makeValidation, PropsValidationOptions } from '../Form/Form.validation';
import { PhoneInput } from '../PhoneInput';

import type { PropsWithStyleBase } from '../../util.types';
import { CountryDropdown, CountryDropdownProps } from '../CountryDropdown';
import { AppContext } from '../../App/AppContext';
import { CountryCode } from 'libphonenumber-js';


// type DropdownOption = CountryDropdownProps[ 'options' ][ number ]; // DropdownProps<CountryCode>[ 'options' ][ number ] & { key?: string; };


// const countriesOptions: /* DropdownProps */CountryDropdownProps[ 'options' ] = countriesData.map(({ name, code, }) => ({
//     key: code,
//     text: name,
//     value: code,
//     // label: name,
//     imageUrl: `http://purecatamphetamine.github.io/country-flag-icons/3x2/${code.toUpperCase()}.svg`
// } /* as DropdownOption */)) as any;

// const countriesDataByCode = countriesData.reduce((o, data) => ({ ...o, [ data.code ]: data }), {} as { [ Code: string ]: (typeof countriesData)[ number ]; });


// type Validations = { [ K in keyof BookingBillingInfoType ]: Partial<Validation> & { type: FormValueType; } };



const usePropsValidation = () => {
    const { countriesMetadata } = useContext(AppContext);

    const propsValidation = useMemo(() => ({
        default: {
            isRequiredMessage: 'Required',
            invalidMessage: 'Invalid'
        },
        props: {
            email: makeValidation('email'),
            firstName: makeValidation('string'),
            lastName: makeValidation('string'),
            phoneNumber: makeValidation('phone'),
            country: makeValidation('string', { validate: value => ({ error: !countriesMetadata.some(({ code }) => value === code) }) }),
            comment: makeValidation('string', { isRequired: false })
        }
    } satisfies PropsValidationOptions), [ countriesMetadata ]);

    return {
        propsValidation
    };
};

type RealPropsValidations = ReturnType<typeof usePropsValidation>[ 'propsValidation' ][ 'props' ];

type FormInputValues = Record<keyof RealPropsValidations, string>; // FormValues<keyof RealPropsValidations, string>;


export type BookingDetailsProps = PropsWithStyleBase & {
    onSubmit?: (data: FormInputValues) => void;
    buttonText?: string;
};

export const BookingBillingInfo: React.FunctionComponent<BookingDetailsProps> = ({ onSubmit, buttonText }) => {
    const { billingInfo, setBillingInfo } = useContext(BookingContext);

    // const [ billingState, setBillingState ] = useState(billingInfo);
    /* const { setPropFormState, propsValidation } = useForm({ phoneCountry: billingState.country }); */
    const { propsValidation } = usePropsValidation();

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
                        adaptOnChangeEvent={useCallback((value, countryCode) => ({ value, countryCode }), [])}
                        mapValue={useCallback((data: { value: string; countryCode: CountryCode; }) => data?.value, [])}
                        /* onCountryChange={useCallback(code => setPropFormState('phoneCountry', code), [])} */ />

                    <CountryDropdown
                        width="five"
                        label="Country"
                        name="country"
                        autoComplete="country"
                        value={billingInfo.country}
                        isClearable={false}
                        noResultsMessage="No country" />


                </InputGroup>


                {/* <Dropdown
                    label="Country"
                    name="country"
                    autoComplete="country"
                    options={countriesOptions}
                    value={billingInfo.country}
                    isClearable={false}
                    noResultsMessage="No country"
                    getOptionsWithSearch={getCountryOptionsWithSearch}
                    onChange={useCallback((name, _value) => {
                        formRef.current?.setInputState(name, { isBlurred: true });
                    }, [])} /> */}

                <TextArea label="Comments (optional)" name="comment" maxCharacters={4000} value={billingInfo.comment} />
            </Form>
        </div>
    );
};


{/* <Dropdown
        width="five"
        label="Country"
        name="country"
        autoComplete="country"
        options={countriesOptions}
        value={billingInfo.country}
        isClearable={false}
        noResultsMessage="No country"
        getOptionsWithSearch={getCountryOptionsWithSearch}
            onChange={useCallback((name, _value) => {
            formRef.current?.setInputState(name, { isBlurred: true });
        }, [])}  /> */}

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


const countriesOptions: DropdownProps[ 'options' ] = countriesData.map(({ name, code, }) => ({
    key: code,
    text: name,
    value: code,
    // label: name,
    imageUrl: `http://purecatamphetamine.github.io/country-flag-icons/3x2/${code.toUpperCase()}.svg`
}));

const countriesDataByCode = countriesData.reduce((o, data) => ({ ...o, [ data.code ]: data }), {} as { [ Code: string ]: (typeof countriesData)[ number ]; });



const getCountryOptionsWithSearch = (options: DropdownProps[ 'options' ], searchValue: string) => {
    const regExp = new RegExp(`^${searchValue}`, 'i');
    return options.filter(({ value: code }) => regExp.test(countriesDataByCode[ code as string ].name) || regExp.test(`${code}`));
};
