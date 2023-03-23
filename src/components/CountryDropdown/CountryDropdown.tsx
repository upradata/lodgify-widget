import './CountryDropdown.scss';

import React, { memo, useCallback, useContext, useMemo } from 'react';
import { AppContext } from '../../App/AppContext';
import { CountryIcon } from './CountryIcon';
// import { getDiallingCode } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getDiallingCode.js';
// import { getOptionsWithSearch } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getOptionsWithSearch.js';
// import { FlagComponent } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/FlagComponent';
// import { CountrySelectComponent } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/CountrySelectComponent';
// import { getAllOptions } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getAllOptions.js';
// import { createCountryIconComponent } from '../../../node_modules/react-phone-number-input/modules/CountryIcon';
// import InternationalIcon from '../../../node_modules/react-phone-number-input/modules/InternationalIcon';
import { Dropdown, DropdownProps } from '../Dropdown';

// import parsePhoneNumber from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js/core';
import type { CountrySelectOptions, CountrySelectWithIconProps } from 'react-phone-number-input';
import type { Omit as MyOmit } from '../../util.types';


export type CountryDropdownItemOption = {
    name: string;
    text: React.ReactNode;
    value: CountryCode;
    content: React.ReactNode;
};


type _DropdownProps = DropdownProps<CountryCode, CountryDropdownItemOption>;
type _CountrySelectWithIconProps<P = {}> = CountrySelectWithIconProps<CountrySelectOptions<P>>;

export type CountryDropdownProps<P = {}> =
    MyOmit<
        MyOmit<_CountrySelectWithIconProps, 'options'> &
        { countryOptions?: _CountrySelectWithIconProps<P>[ 'options' ]; } &
        Omit<_DropdownProps, 'onChange' | Exclude<keyof CountrySelectWithIconProps, 'options'>>,

        'onFocus' | 'onBlur'
    >;
// react-phone-number-input/modules/CountrySelect.js only need onChange


/* const CountryIcon = createCountryIconComponent({
    // Must be equal to `defaultProps.flagUrl` in `./PhoneInputWithCountry.js`.
    flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/{XX}.svg',
    flagComponent: Flag,
    internationalIcon: InternationalIcon
}); */



/* const getIconOrFlag = (country: CountryCode) => {
    const flagName = country.toLowerCase();

    if (flagName && VALID_FLAG_NAMES.includes(flagName))
        return <Flag name={flagName} />;

    return <Icon name={ICON_NAMES.PHONE} size="small" />;
}; */

/* const CountryIcon = createCountryIconComponent({
    // Must be equal to `defaultProps.flagUrl` in `./PhoneInputWithCountry.js`.
    flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/{XX}.svg',
    flagComponent: Flag,
    internationalIcon: DefaultInternationalIcon
}); */




export const getOptionsWithSearch: CountryDropdownProps[ 'getOptionsWithSearch' ] = (options, searchValue) => {
    const regExp = new RegExp(`^${searchValue.replace('+', '\\+')}`, 'i');

    return options.filter(({ name, value }) => {
        return regExp.test(name) || regExp.test(`${value}`);
    });
};



const _CountryDropdown: React.FunctionComponent<CountryDropdownProps> = ({ onChange, countryOptions, iconComponent: CountryIcon, ...props }) => {
    const { countriesMetadata } = useContext(AppContext);

    const _countryOptions = useMemo(() => {
        return countryOptions || countriesMetadata.map(v => ({ label: v.name, value: v.code }) as CountrySelectOptions);
    }, [ countryOptions ]);

    const options = useMemo(() => {
        if (!!props.options)
            return undefined;

        const optionCache: Record<string, CountryDropdownItemOption> = {};

        return _countryOptions.map(({ value, label }) => {

            if (!optionCache[ label ]) {
                optionCache[ label ] = {
                    name: label,
                    // text is the result after the dropdown's options is chosen and it is closed
                    text: (
                        <div className="CountryDropdown__text">
                            <CountryIcon country={value} label={label} aspectRatio={1.5} />
                            <span className="text">{label}</span>
                        </div>
                    ),
                    value,
                    // content are the options inside the dropdown options
                    content: (
                        <div className="CountryDropdown__content">
                            <CountryIcon country={value} label={label} aspectRatio={1.5} />
                            <span className="text">{label}</span>
                        </div>
                    )
                };
            }

            return optionCache[ label ];
        });
    }, [ _countryOptions ]);

    const dropDownProps: _DropdownProps = {
        getOptionsWithSearch,
        isClearable: false,
        // floating: true,
        // isSearchable: true,
        // isFluid: true,
        autoComplete: 'country',
        ...props,
        onChange: useCallback((name, value) => { onChange(value); }, [ onChange ]),
        options: props.options || options
    };

    return <Dropdown {...dropDownProps} className="CountryDropdown" />;
};

_CountryDropdown.displayName = 'CountryDropdown';
_CountryDropdown.defaultProps = {
    iconComponent: CountryIcon
};

export const CountryDropdown = memo(_CountryDropdown);
