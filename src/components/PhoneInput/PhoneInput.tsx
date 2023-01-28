
// import parsePhoneNumber from 'libphonenumber-js';
import { CountryCode, Metadata as LibPhoneMetadata, MetadataJson } from 'libphonenumber-js/core';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import ReactPhoneNumberInputCore from 'react-phone-number-input/core';
import 'react-phone-number-input/style.css';
import { InputController } from '@lodgify/ui/lib/es/components/inputs/InputController';
import {
    COUNTRY_OPTIONS,
    DEFAULT_COUNTRY,
    INITIAL_VALUE
} from '@lodgify/ui/lib/es/components/inputs/PhoneInput/constants';
// import { FlagComponent } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils//FlagComponent';
import { CountrySelectComponent } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/CountrySelectComponent';
// import { getLabels } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getLabels';
import { getControlledInputValue } from '@lodgify/ui/lib/es/utils/get-controlled-input-value';
import { getIsInputValueReset } from '@lodgify/ui/lib/es/utils/get-is-input-value-reset';
import phoneMetadata from '../../libphonenumber-metadata.custom.json';
// import { Flag } from './Flag';
import './PhoneInput.css';


// import { createPhoneInput } from 'react-phone-number-input/modules/react-hook-form/PhoneInputWithCountry';
// import _ReactPhoneNumberInput from 'react-phone-number-input/react-hook-form-core';
import type { Labels, Metadata, Props as _ReactPhoneNumberProps } from 'react-phone-number-input';
import { InputControllerProps } from '@lodgify/ui';
import { usePrevious } from '../../util';
// const metadata = new Metadata(phoneMetadata as MetadataJson);
// const ReactPhoneNumberInput = createPhoneInput(metadata);
type ReactPhoneNumberProps = _ReactPhoneNumberProps<{}> & {
    metadata: Metadata;
    labels: Labels;
};

// const metadata = new LibPhoneMetadata(phoneMetadata as MetadataJson);

// type ReactPhoneNumberInputType = typeof ReactPhoneNumberInputCore;
// type ReactPhoneNumberInputProps = ConstructorParameters<ReactPhoneNumberInputType>[ 0 ];

export const PhoneNumberInput: React.FunctionComponent<ReactPhoneNumberProps> = props => {
    return <ReactPhoneNumberInputCore {...{ metadata: phoneMetadata, className: 'react-phone-number-input', ...props }} />;
};

PhoneNumberInput.displayName = 'PhoneNumberInput';


export type PhoneIputProps = Omit<Partial<ReactPhoneNumberProps>, 'value' | 'onChange'> & {
    // autoComplete?: string;
    // countryNames?: Record<string, string>;
    error?: boolean | string;
    // initialCountryValue?: string;
    isValid?: boolean;
    label?: string;
    name?: string;
    // onBlur?: () => any;
    onChange?: (name: string, value: string) => any;
    value?: string;
};

export const PhoneInput: React.FunctionComponent<PhoneIputProps> = props => {

    const [ state, setState ] = useState({
        // labels: getLabels(props.countryNames),
        value: INITIAL_VALUE,
        countryISO: props.defaultCountry
    });

    const previousPropsValue = usePrevious(props.value);
    const previousStateValue = usePrevious(state.value);

    /* const parsedNumber = parsePhoneNumber(state.value || '', state.countryISO);
    console.log(parsedNumber); */

    const handleChange: PhoneIputProps[ 'onChange' ] = (name, value) => {
        setState(prev => ({ ...prev, value }));
        // console.log(reactPhoneInputNumberRef.current);
    };


    useEffect(() => {
        if (getIsInputValueReset(previousPropsValue, props.value))
            setState(prev => ({ ...prev, value: props.value }));
    }, [ props.value, previousPropsValue ]);


    useEffect(() => {
        if (previousStateValue !== state.value)
            props.onChange?.(props.name, state.value);
    }, [ state.value, previousStateValue ]);


    const { error, isValid, label, name, onChange: _o, value: _v, ...reactPhoneInputProps } = props;

    const value = getControlledInputValue(props.value, INITIAL_VALUE, state.value);

    const inputControllerProps: Partial<InputControllerProps> = {
        error,
        isValid,
        // label,
        onChange: handleChange,
        value,
        name: props.name || 'phone-number'
    };

    const phoneInputProps: Partial<ReactPhoneNumberProps> = {
        // autoComplete: props.autoComplete,
        // defaultCountry: props.defaultCountry,
        // countryOptions: COUNTRY_OPTIONS,
        countrySelectComponent: CountrySelectComponent,
        // flagComponent: FlagComponent,
        // labels: props.labels, // state.labels,
        // onBlur: props.onBlur,
        onChange: () => { },
        onBlur: () => { },
        onCountryChange: (countryISO: CountryCode) => {
            setState(prev => ({ ...prev, countryISO }));
            props.onCountryChange?.(countryISO)
        },
        ...reactPhoneInputProps,
        // flagComponent: Flag(phoneMetadata as MetadataJson),
    };

    // return <PhoneNumberInput {...(phoneInputProps as any)} {...inputControllerProps} />;
    return <InputController {...inputControllerProps}>
        {/* <PhoneNumberInput {...(phoneInputProps as any)} /> */}
        <ReactPhoneNumberInputCore {...{
            metadata: phoneMetadata,
            focusInputOnCountrySelection: true,
            smartCaret: false,
            // inputComponent: PhoneInputInput2(inputControllerProps.label),
            /* inputComponent: React.forwardRef((props, ref) => {
                return <div>
                    <span>+{phoneMetadata.countries[ state.countryISO ]?.[ 0 ]}</span>
                    <input {...props} ref={ref as any} />
                </div>;
            }), */
            numberInputProps: {
                placeholder: label
            },
            ...phoneInputProps
        } as any} />
    </InputController>;
};


const PhoneInputInput2 = (label: string) => {
    const Component: React.ForwardRefRenderFunction<unknown, {}> = (props, ref) => {
        // debugger;
        const inputRef = useRef<HTMLInputElement>();

        useImperativeHandle(ref, () => ({
            focus: () => {
                debugger;
                inputRef.current.focus();
            }
        }));

        const { isBlurred, ...p } = props as any;
        return <input {...p} ref={inputRef} placeholder={label} />;
    };

    Component.displayName = 'MyInput';
    return React.forwardRef(Component);
};

const PhoneInputInput = (label: string) => {
    const Component: React.ForwardRefRenderFunction<HTMLInputElement, {}> = (props, ref) => {
        // debugger;
        return <input {...props} ref={ref} placeholder={label} />;
    };

    Component.displayName = 'MyInput';
    return React.forwardRef(Component);
};


PhoneInput.displayName = 'PhoneInput';
PhoneInput.defaultProps = {
    autoComplete: 'off',
    error: false,
    labels: {},
    defaultCountry: DEFAULT_COUNTRY,
    isValid: false,
    label: '',
    name: '',
    onBlur: () => { },
    onChange: () => { },
    value: undefined
};
