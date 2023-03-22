import 'react-phone-number-input/style.css';

import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
// import { getDiallingCode } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getDiallingCode.js';
// import { getOptionsWithSearch } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getOptionsWithSearch.js';
// import { FlagComponent } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/FlagComponent';
// import { CountrySelectComponent } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/CountrySelectComponent';
// import { getAllOptions } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getAllOptions.js';
// import { createCountryIconComponent } from 'react-phone-number-input/modules/CountryIcon';
import { getCountryCallingCode } from 'libphonenumber-js';
// import InternationalIcon from 'react-phone-number-input/modules/InternationalIcon';
import { Dropdown, DropdownProps } from '../Dropdown';

// import { Flag } from './Flag';
// import parsePhoneNumber from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js/core';
import type { CountrySelectOptions, CountrySelectWithIconProps } from 'react-phone-number-input';
import type { Omit as MyOmit } from '../../util.types';


type DropdownItemProps = CountrySelectOptions & { name: string; };

// react-phone-number-input/modules/CountrySelect.js only need onChange
export type CountrySelectComponentProps =
    MyOmit<
        CountrySelectWithIconProps<DropdownItemProps> &
        Omit<DropdownProps<CountryCode, DropdownItemProps>, 'onChange' | 'label' | keyof CountrySelectWithIconProps>,
        'onFocus' | 'onBlur'
    >;

/* const CountryIcon = createCountryIconComponent({
    // Must be equal to `defaultProps.flagUrl` in `./PhoneInputWithCountry.js`.
    flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/{XX}.svg',
    flagComponent: Flag,
    internationalIcon: InternationalIcon
}); */



/* const getIconOrFlag = (country: CountryCode) => {
    const flagName = country.toLowerCase();
    return flagName && VALID_FLAG_NAMES.includes(flagName) ? React.createElement(Flag, {
        name: flagName
    }) : React.createElement(Icon, {
        name: ICON_NAMES.PHONE,
        size: "small"
    });
}; */
/* const CountryIcon=createCountryIconComponent({
    // Must be equal to `defaultProps.flagUrl` in `./PhoneInputWithCountry.js`.
    flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/{XX}.svg',
    flagComponent: Flag,
    internationalIcon: DefaultInternationalIcon
}); */




export const getOptionsWithSearch: CountrySelectComponentProps[ 'getOptionsWithSearch' ] = (options, searchValue) => {
    const regExp = new RegExp(`^${searchValue.replace('+', '\\+')}`, 'i');

    return options.filter(({ name, value }) => {
        return regExp.test(name) || regExp.test(`${value}`);
    });
};


export const getDiallingCode = (countryCode: CountryCode) => {
    try {
        return `+${getCountryCallingCode(countryCode)}`;
    } catch (_unused) {
        return '';
    }
};

type DropdownItemOption = {
    name: string;
    text: React.ReactNode;
    value: CountryCode;
    content: React.ReactNode;
};



const _CountrySelectComponent: React.FunctionComponent<CountrySelectComponentProps> = ({ onChange, options, iconComponent: CountryIcon, ...props }) => {
    // const [ isOpen, setIsOpen ] = useState(false);
    // const [ value, setValue ] = useState(props.value);
    // const [ searchQuery, setSearchQuery ] = useState(props.searchQuery);

    const dropDownProps: DropdownProps<CountryCode, DropdownItemProps> = {
        getOptionsWithSearch,
        isClearable: false,
        // floating: true,
        // isSearchable: true,
        // isFluid: true,
        autoComplete: 'country',
        ...props,
        onChange: useCallback((name, value) => { onChange(value); }, [ onChange ]),
        // value,
        // searchQuery,
        // open: isOpen,
        // onOpen: useCallback(() => { setIsOpen(true); }, []),
        // onClose: useCallback(() => {
        //     setIsOpen(false);
        //     setSearchQuery('');
        // }, []),
        // onSearchChange: useCallback((event, { searchQuery, options, value }) => {
        //     const isAutoFilled = !event.nativeEvent.inputType;

        //     if (isAutoFilled) {
        //         const items = getOptionsWithSearch(options, searchQuery);

        //         if (items.length === 1) {
        //             if (items[ 0 ].value !== value)
        //                 setValue(items[ 0 ].value);

        //             setSearchQuery('');
        //             setIsOpen(false);

        //         } else if (!isOpen) {
        //             setSearchQuery(searchQuery);
        //             setIsOpen(true);
        //         }
        //     } else {
        //         setSearchQuery(searchQuery);
        //     }
        // }, []),
        // onChange: useCallback((name: string, value: CountryCode) => {
        //     // to ensure that onClose is called after onChange
        //     // semantic dropdown handleItemClick is calling onChange before but if the search input has some value ("fr" for instance)
        //     // and then click on the french flag,
        //     // the browser will call first the input onClose listener before calling the onChange called synchronously by the Dropdown component
        //     // Semantic should handle it forcing the calling order
        //     setTimeout(() => {
        //         setValue(value);
        //         onChange(value);
        //     }, 0);
        // }, [ onChange ]),
        options: useMemo(() => {
            const optionCache: Record<string, DropdownItemOption> = {};

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
        }, [ options ]),
    };

    return <Dropdown {...dropDownProps} />;
};

_CountrySelectComponent.displayName = 'CountrySelectComponent';
export const CountrySelectComponent = memo(_CountrySelectComponent);
