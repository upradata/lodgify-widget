
// import parsePhoneNumber from 'libphonenumber-js';
import { CountryCode, MetadataJson } from 'libphonenumber-js/core';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import ReactPhoneNumberInputCore from 'react-phone-number-input/core';
import { InputControllerProps, InputProps } from '@lodgify/ui';
import { InputController } from '@lodgify/ui/lib/es/components/inputs/InputController';
import {
    COUNTRY_OPTIONS,
    DEFAULT_COUNTRY,
    INITIAL_VALUE
} from '@lodgify/ui/lib/es/components/inputs/PhoneInput/constants';
// import { FlagComponent } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/FlagComponent';
// import { CountrySelectComponent } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/CountrySelectComponent';
// import { getLabels } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getLabels';
import { getControlledInputValue } from '@lodgify/ui/lib/es/utils/get-controlled-input-value';
import { getIsInputValueReset } from '@lodgify/ui/lib/es/utils/get-is-input-value-reset';
import labels from '../../../node_modules/react-phone-number-input/locale/en.json.js';
// import { getAllOptions } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getAllOptions.js';
import phoneMetadata from '../../libphonenumber-metadata.custom.json';
import { usePreviousListener } from '../../util';
import { CountrySelectComponent } from './CountrySelectComponent';
import 'react-phone-number-input/style.css';
// import { Flag } from './Flag';
import './PhoneInput.scss';


// import { createPhoneInput } from 'react-phone-number-input/modules/react-hook-form/PhoneInputWithCountry';
// import _ReactPhoneNumberInput from 'react-phone-number-input/react-hook-form-core';
import type { Labels, Metadata, Props as _ReactPhoneNumberProps } from 'react-phone-number-input';
// const metadata = new Metadata(phoneMetadata as MetadataJson);
// const ReactPhoneNumberInput = createPhoneInput(metadata);


type ReactPhoneNumberProps = _ReactPhoneNumberProps<{}> & {
    metadata: Metadata;
    labels: Labels;
};



/* type FlagComponentProps = {
    code: CountryCode;
    name?: string;
};

const Flag: React.FunctionComponent<FlagComponentProps> = ({ code, name = '' }) => {
    return <img alt={name} className="ui image" src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`} />;
}; */


// const metadata = new LibPhoneMetadata(phoneMetadata as MetadataJson);

// type ReactPhoneNumberInputType = typeof ReactPhoneNumberInputCore;
// type ReactPhoneNumberInputProps = ConstructorParameters<ReactPhoneNumberInputType>[ 0 ];

/* export const PhoneNumberInput: React.FunctionComponent<ReactPhoneNumberProps> = props => {
    return <ReactPhoneNumberInputCore {...{ metadata: phoneMetadata, className: 'react-phone-number-input', ...props }} />;
};

PhoneNumberInput.displayName = 'PhoneNumberInput'; */


export type PhoneIputProps = Omit<Partial<ReactPhoneNumberProps>, 'value' | 'onChange'> & {
    // autoComplete?: string;
    // countryNames?: Record<string, string>;
    error?: boolean | string;
    // initialCountryValue?: string;
    isValid?: boolean;
    label?: string;
    // name?: string;
    // onBlur?: () => any;
    // onChange?: (name: string, value: string) => any;
    value?: string;
} & InputProps;

export const PhoneInput: React.FunctionComponent<PhoneIputProps> = props => {

    const [ state, setState ] = useState({
        // labels: getLabels(props.countryNames),
        value: INITIAL_VALUE,
        countryISO: props.defaultCountry
    });

    // const previousPropsValue = usePrevious(props.value);
    const { addListener: addPropsValueListener } = usePreviousListener(props.value);

    const handleChange: PhoneIputProps[ 'onChange' ] = useCallback((name, value) => {
        setState(state => {
            if (state.value !== value)
                props.onChange?.(name, value);

            return { ...state, value };
        });
    }, []);


    useEffect(() => {
        addPropsValueListener((prevValue, newValue) => {
            if (getIsInputValueReset(prevValue, newValue))
                setState(state => ({ ...state, value: newValue }));
        });
    }, []);


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

    const phoneInputProps = useMemo<ReactPhoneNumberProps>(() => ({
        // autoComplete: props.autoComplete,
        // defaultCountry: props.defaultCountry,
        // countryOptions: COUNTRY_OPTIONS,
        countrySelectComponent: CountrySelectComponent,
        // flagComponent: props => <Flag name={props.countryName} code={props.country} />, // FlagComponent,
        // labels: props.labels, // state.labels,
        // onBlur: props.onBlur,
        onChange: () => { },
        onBlur: () => { },
        onCountryChange: (countryISO: CountryCode) => {
            setState(state => ({ ...state, countryISO }));
            props.onCountryChange?.(countryISO);
        },
        metadata: phoneMetadata as MetadataJson,
        labels,
        focusInputOnCountrySelection: true,
        smartCaret: false,
        numberInputProps: {
            placeholder: label
        },
        ...reactPhoneInputProps
        // flagComponent: Flag(phoneMetadata as MetadataJson),
    }), [ label ]);

    // return <PhoneNumberInput {...(phoneInputProps as any)} {...inputControllerProps} />;
    return <InputController {...inputControllerProps}>
        {/* <PhoneNumberInput {...(phoneInputProps as any)} /> */}
        <ReactPhoneNumberInputCore {...phoneInputProps} />
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
    // labels: {},
    defaultCountry: DEFAULT_COUNTRY,
    isValid: false,
    label: '',
    name: '',
    // onBlur: () => { },
    // onChange: () => { },
    value: INITIAL_VALUE
};
