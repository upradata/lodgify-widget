import './CountryDropdown.scss';

import React, { memo, useCallback, useContext, useMemo } from 'react';
import { AppContext } from '@root/App/contexts/AppContext';
import { CountryIcon } from './CountryIcon';
// import { getDiallingCode } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getDiallingCode.js';
// import { getOptionsWithSearch } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getOptionsWithSearch.js';
// import { FlagComponent } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/FlagComponent';
// import { CountrySelectComponent } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/CountrySelectComponent';
// import { getAllOptions } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getAllOptions.js';
// import { createCountryIconComponent } from '../../../node_modules/react-phone-number-input/modules/CountryIcon';
// import InternationalIcon from '../../../node_modules/react-phone-number-input/modules/InternationalIcon';
import { Dropdown, DropdownProps } from '../Dropdown';

import type { CountrySelectOptions, CountrySelectWithIconProps } from 'react-phone-number-input';
// import parsePhoneNumber from 'libphonenumber-js';
import type { CountryCode } from '../../types';
import type { Omit as MyOmit } from '@root/util.types';
import { getCityFromLocale } from '@root/util';


export type CountryDropdownItemOption<Country extends string = CountryCode> = {
    name: string;
    text: React.ReactNode;
    value: Country;
    content: React.ReactNode;
};


type _DropdownProps<Country extends string = CountryCode> = DropdownProps<Country, CountryDropdownItemOption<Country>>;
type _CountrySelectWithIconProps<Country extends string = CountryCode, P = {}> = CountrySelectWithIconProps<Country, CountrySelectOptions<Country, P>>;

export type CountryDropdownProps<Country extends string = CountryCode, P = {}> =
    MyOmit<
        MyOmit<_CountrySelectWithIconProps<Country, P>, 'options' | 'onChange'> &
        { countryOptions?: _CountrySelectWithIconProps<Country, P>[ 'options' ]; } &
        Omit<_DropdownProps<Country>, Exclude<keyof CountrySelectWithIconProps, 'options' | 'onChange'>>,

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
    const { countriesMetadata, timezonesMetadata } = useContext(AppContext);

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

    const localeCity = getCityFromLocale();
    const initialValue = props.initialValue || timezonesMetadata[ localeCity ]?.countryCode;

    const dropDownProps: _DropdownProps = {
        getOptionsWithSearch,
        isClearable: false,
        // floating: true,
        // isSearchable: true,
        // isFluid: true,
        autoComplete: 'country',
        ...props,
        initialValue,
        onChange, // : useCallback((name, value,event) => { onChange(name, value); }, [ onChange ]),
        options: props.options || options
    };

    return <Dropdown {...dropDownProps} className="CountryDropdown" />;
};


// export const DEFAULT_COUNTRY =  'FR';

_CountryDropdown.displayName = 'CountryDropdown';
_CountryDropdown.defaultProps = {
    iconComponent: CountryIcon,
    // defaultValue: DEFAULT_COUNTRY
};

export const CountryDropdown = memo(_CountryDropdown);


export const createCountryDropdown = <Country extends string, P = {}>() => {
    return CountryDropdown as React.FunctionComponent<CountryDropdownProps<Country, P>>;
};
