import './BookingBillingInfo.scss';

import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { InputGroup } from '@lodgify/ui';
// import { getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';
import { TextArea } from '@lodgify/ui/lib/es/components/inputs/TextArea';
import { parsePhoneNumber } from 'libphonenumber-js';
import { AppContext } from '../../App/AppContext';
// import debounce from 'debounce';
// import { BookingBillingInfo as BookingBillingInfoType } from '../Booking/BookingComponent';
import { BookingContext } from '../Booking/BookingContext';
import { CountryDropdown } from '../CountryDropdown';
import { Form, FormImperativeAPI, FormProps } from '../Form';
import { makeValidation, PropsValidationOptions } from '../Form/Form.validation';
import { PhoneInput } from '../PhoneInput';
import { TextInput } from '../TextInput';

import type { CountryCode } from '../../types';
import type { PropsWithStyleBase } from '../../util.types';


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
            phoneNumber: makeValidation('phone-string'),
            country: makeValidation('string', {
                validate: value => {
                    return ({ error: !countriesMetadata.some(({ code }) => value === code) });
                }
            }),
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


const getCountryFromPhone = (phone: string, defaultCountry?: CountryCode) => phone ? parsePhoneNumber(phone, defaultCountry).country : undefined;

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

    const countryFromPhone = getCountryFromPhone(billingInfo.phoneNumber, billingInfo.country);

    const [ state, _setState ] = useState({
        phone: billingInfo.phoneNumber,
        phoneCountry: countryFromPhone || billingInfo.country,
        countryCode: billingInfo.country || countryFromPhone || null
    });

    const setState = (set: (previousState: typeof state) => Partial<typeof state>) => _setState(state => ({ ...state, ...set(state) }));

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
                        defaultCountry={state.phoneCountry}
                        value={state.phone}
                        onCountryChange={useCallback(code => {
                            setState(state => ({
                                countryCode: state.countryCode || code,
                                phoneCountry: code
                            }));
                        }, [])}
                        onChange={useCallback((_, value: string) => {
                            setState(state => {
                                if (!value)
                                    return { phone: value };

                                try {
                                    const { country } = parsePhoneNumber(value, state.phoneCountry);

                                    return {
                                        phone: value,
                                        phoneCountry: country,
                                        countryCode: state.countryCode || country,
                                    };
                                } catch (e) {
                                    if (e instanceof Error && e.message === 'TOO_SHORT')
                                        return { phone: value };

                                    return { phone: undefined };
                                }
                            });
                        }, [])} />


                    <CountryDropdown
                        width="five"
                        label="Country"
                        name="country"
                        autoComplete="country"
                        value={state.countryCode}
                        isClearable={false}
                        noResultsMessage="No country"
                        onChange={useCallback((_, code) => {
                            setState(state => ({
                                countryCode: code,
                                phoneCountry: state.phoneCountry || code
                            }));
                        }, [])} />


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


/* const countriesOptions: DropdownProps[ 'options' ] = countriesData.map(({ name, code, }) => ({
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
 */
