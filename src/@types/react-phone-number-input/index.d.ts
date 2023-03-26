declare module 'react-phone-number-input/modules/react-hook-form/PhoneInputWithCountry' {
    import PhoneInputWithCountrySelect from 'react-phone-number-input/react-hook-form-core';


    import type { Metadata } from 'libphonenumber-js/core';

    export type PhoneInputWithCountrySelectType = typeof PhoneInputWithCountrySelect;
    export const createPhoneInput: (metadata: Metadata) => PhoneInputWithCountrySelectType;
    export default PhoneInputWithCountrySelect;
}


import type { CountryCode } from 'libphonenumber-js';

declare module 'react-phone-number-input' {
    export type CountrySelectOptions<Country extends string = CountryCode<string>, P = {}> = P & {
        value: Country;
        label: string;
    };

    export type CountrySelectProps<Country extends string = CountryCode, Options extends CountrySelectOptions<string> = CountrySelectOptions<Country>> = {
        /**
          * A two-letter country code.
          * Example: "US", "RU", etc.
          */
        value: Country; // ZZ is international

        /**
         * A function of `value: string`.
         * Updates the `value` property.
         */
        onChange?: (value: Country) => void;
        // `<select/>` options.
        options: Options[];

        name?: string;
        'aria-label'?: string;
        onFocus?: (event: React.SyntheticEvent<React.Element, FocusEvent>) => void;
        onBlur?: (event: React.SyntheticEvent<React.Element, Event>) => void;
        disabled?: boolean;
        readOnly?: boolean;
    };

    export type CountryIconProps<Country extends string = CountryCode> = {
        // 'aria-hidden': boolean;
        country?: Country;
        label?: string;
        aspectRatio?: 1 | 1.5;
    };

    export type CountrySelectWithIconProps<Country extends string = CountryCode, Options extends CountrySelectOptions<string> = CountrySelectOptions<Country>> =
        CountrySelectProps<Country, Options> & {
            // Country flag component.
            iconComponent?: React.ComponentType<CountryIconProps<Country>>;
            // Select arrow component.
            arrowComponent?: React.ComponentType;
            // Set to `true` to render Unicode flag icons instead of SVG images.
            unicodeFlags?: boolean;
        };
}
