// import parsePhoneNumber from 'libphonenumber-js';
import { CountryCode } from 'libphonenumber-js/core';
import React, { memo, useCallback, useMemo } from 'react';
import { InputProps as SemanticInputProps } from 'semantic-ui-react';
import { Dropdown, DropdownProps } from '@lodgify/ui';
import { getDiallingCode } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getDiallingCode.js';
import { getOptionsWithSearch } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getOptionsWithSearch.js';
// import { FlagComponent } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/FlagComponent';
// import { CountrySelectComponent } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/CountrySelectComponent';
// import { getAllOptions } from '@lodgify/ui/lib/es/components/inputs/PhoneInput/utils/getAllOptions.js';
import CountryIcon from '../../../node_modules/react-phone-number-input/modules/CountryIcon.js';
import 'react-phone-number-input/style.css';


export type CountrySelectComponentProps = {
    options: {
        label?: string;
        value?: CountryCode;
    }[];
    value?: string;
} & Omit<SemanticInputProps, 'name'>;

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

const _CountrySelectComponent: React.FunctionComponent<CountrySelectComponentProps> = ({ onChange, options, ...props }) => {
    const dropDownProps: DropdownProps = {
        getOptionsWithSearch,
        isClearable: false,
        // isFluid: true,
        ...props,
        onChange: useCallback((name: string, value: CountryCode) => { onChange(value); }, [ onChange ]),
        options: useMemo(() => {
            const optionCache: Record<string, {
                name: string;
                text: React.ReactNode;
                value: CountryCode;
                content: React.ReactNode;
            }
            > = {};

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
