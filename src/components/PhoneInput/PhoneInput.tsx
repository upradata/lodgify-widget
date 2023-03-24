import 'react-phone-number-input/style.css';
// import { Flag } from './Flag';
import './PhoneInput.scss';

// import { getAllOptions } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getAllOptions.js';

import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
// import { InputController } from '@lodgify/ui/lib/es/components/inputs/InputController';
// import { DEFAULT_COUNTRY, INITIAL_VALUE } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/constants';
// import { FlagComponent } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/FlagComponent';
// import { CountrySelectComponent } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/CountrySelectComponent';
// import { getLabels } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getLabels';
import { getControlledInputValue } from '@lodgify/ui/lib/es/utils/get-controlled-input-value';
import { getCountryCallingCode } from 'libphonenumber-js';
import ReactPhoneNumberInputCore from 'react-phone-number-input/core';
import { AppContext } from '../../App/AppContext';
import { CountryDropdown, CountryDropdownItemOption, CountryDropdownProps, Flag } from '../CountryDropdown';
import { InputController } from '../InputController';
import labels from '../../../node_modules/react-phone-number-input/locale/en.json.js';

// import { getIsInputValueReset } from '@lodgify/ui/lib/es/utils/get-is-input-value-reset';
import type { InputControllerProps, InputProps } from '@lodgify/ui';
// import { usePrevious, usePreviousListener } from '../../util';
// import { createPhoneInput } from 'react-phone-number-input/modules/react-hook-form/PhoneInputWithCountry';
// import _ReactPhoneNumberInput from 'react-phone-number-input/react-hook-form-core';
import type { Labels, Metadata, Props as _ReactPhoneNumberProps } from 'react-phone-number-input';
// import parsePhoneNumber from 'libphonenumber-js';
import type { CountryCode } from '../../types';
import type { Omit } from '../../util.types';


export const INITIAL_VALUE = '';
// export const COUNTRY_OPTIONS = ['US', 'GB', '...'];
export const DEFAULT_COUNTRY = 'FR';

// const metadata = new Metadata(phoneMetadata as MetadataJson);
// const ReactPhoneNumberInput = createPhoneInput(metadata);


type ReactPhoneNumberProps = _ReactPhoneNumberProps<{}> & {
    metadata: Metadata;
    labels: Labels;
};


export const getDiallingCode = (countryCode: CountryCode) => {
    try {
        return `+${getCountryCallingCode(countryCode)}`;
    } catch (_unused) {
        return '';
    }
};


type PhoneInputCountrySelectComponentProps = Omit<CountryDropdownProps, 'onChange'> & { onChange?: (value: CountryCode) => void; };

const PhoneInputCountrySelectComponent: React.FunctionComponent<PhoneInputCountrySelectComponentProps> = ({ options, iconComponent: CountryIcon, ...props }) => {
    const countryDropdownOptions = useMemo(() => {
        const optionCache: Record<string, CountryDropdownItemOption> = {};

        return options.map(({ value, label }) => {

            if (!optionCache[ label ]) {
                optionCache[ label ] = {
                    name: label,
                    // text is the result after the dropdown's options is chosen and it is closed
                    text: <React.Fragment>
                        {/* <Flag name={label} code={value} /> */}
                        <CountryIcon country={value} label={label} aspectRatio={1.5} />
                        <span className="text">{getDiallingCode(value)}</span>
                    </React.Fragment>,
                    // <Flag name={label} code={value} />,
                    value,
                    // content are the options inside the dropdown options
                    content: <React.Fragment>
                        {/* <Flag name={label} code={value} /> */}
                        <CountryIcon country={value} label={label} aspectRatio={1.5} />
                        <span className="text">{`${label} ${getDiallingCode(value)}`}</span>
                    </React.Fragment>
                };
            }

            return optionCache[ label ];
        });
    }, [ options ]);


    const onChange: CountryDropdownProps[ 'onChange' ] = useCallback((_name, value) => props.onChange?.(value), []);

    return <CountryDropdown options={countryDropdownOptions} {...props} onChange={onChange} />;
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
const isReset = (previousValue: string, value: string) => (previousValue !== null || typeof previousValue !== 'undefined') && value === null;

export type PhoneIputProps<V = unknown> = Omit<Partial<ReactPhoneNumberProps>, 'value' | 'onChange'> & {
    // autoComplete?: string;
    // countryNames?: Record<string, string>;
    error?: boolean | string;
    // initialCountryValue?: string;
    isValid?: boolean;
    isBlurred?: boolean;
    initialValue?: string;
    onChange?: (name: string, value: V) => void;
    adaptOnChangeEvent?: (value: string, countryCode: CountryCode) => V;
    mapValue?: (v: V) => string;
} & Omit<InputProps<string>, 'onChange'>;


export const _PhoneInput: React.FunctionComponent<PhoneIputProps> = ({ adaptOnChangeEvent, mapValue, ...props }) => {
    const { phonesMetadata } = useContext(AppContext);

    const [ state, setState ] = useState({
        // labels: getLabels(props.countryNames),
        value: getControlledInputValue(props.value, props.initialValue, props.value),
        countryISO: props.defaultCountry
    });


    const handleChange: PhoneIputProps<string>[ 'onChange' ] = useCallback((name, value) => {
        setState(state => {
            const newValue = isReset(state.value, value) ? '' : value;

            if (state.value !== newValue) {
                props.onChange?.(name, adaptOnChangeEvent(newValue, state.countryISO));
                return { ...state, value: newValue };
            }

            return state;
        });
    }, [ props.onChange ]);


    const { error, isValid, label, isBlurred, name, onChange: _o, value: _v, initialValue, ...reactPhoneInputProps } = props;

    const value = getControlledInputValue(mapValue(props.value), initialValue, state.value);

    const inputControllerProps: Omit<InputControllerProps, 'children'> = {
        error,
        isValid,
        // label,
        onChange: handleChange,
        value,
        name: props.name || 'phone-number'
    };

    const phoneInputProps: ReactPhoneNumberProps = {
        // autoComplete: props.autoComplete,
        // countryOptions: COUNTRY_OPTIONS,
        countrySelectComponent: PhoneInputCountrySelectComponent,
        // flagComponent: props => <Flag name={props.countryName} code={props.country} />, // FlagComponent,
        flagComponent: Flag,
        // labels: props.labels, // state.labels,
        // onBlur: props.onBlur,
        onChange: useCallback(() => { }, []), // will be set by InputController
        // onBlur: useCallback(() => { }, []),
        labels,
        focusInputOnCountrySelection: true,
        smartCaret: false,
        numberInputProps: useMemo(() => ({
            placeholder: label
        }), [ label ]),
        className: 'phone-number-input',
        ...reactPhoneInputProps,
        onCountryChange: useCallback((countryISO: CountryCode) => {
            setState(state => ({ ...state, countryISO }));
            props.onCountryChange?.(countryISO);
        }, [ props.onCountryChange ]),
        metadata: props.metadata || phonesMetadata
        // flagComponent: Flag(phoneMetadata as MetadataJson),
    };

    // return <PhoneNumberInput {...(phoneInputProps as any)} {...inputControllerProps} />;
    return <InputController {...inputControllerProps}>
        {/* <PhoneNumberInput {...(phoneInputProps as any)} /> */}
        <ReactPhoneNumberInputCore {...phoneInputProps} />
    </InputController>;
};

/* 
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
 */



_PhoneInput.displayName = 'PhoneInput';
_PhoneInput.defaultProps = {
    autoComplete: 'off',
    error: false,
    // labels: {},
    defaultCountry: DEFAULT_COUNTRY,
    isValid: false,
    label: '',
    name: '',
    // onBlur: () => { },
    // onChange: () => { },
    initialValue: INITIAL_VALUE,
    flagUrl: Flag.defaultProps.flagUrl,
    adaptOnChangeEvent: value => value,
    mapValue: value => value as string
};


export const PhoneInput = memo(_PhoneInput);
