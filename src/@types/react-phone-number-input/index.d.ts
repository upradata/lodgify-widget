declare module 'react-phone-number-input/modules/react-hook-form/PhoneInputWithCountry' {
    import PhoneInputWithCountrySelect from 'react-phone-number-input/react-hook-form-core';


    import type { Metadata } from 'libphonenumber-js/core';

    export type PhoneInputWithCountrySelectType = typeof PhoneInputWithCountrySelect;
    export const createPhoneInput: (metadata: Metadata) => PhoneInputWithCountrySelectType;
    export default PhoneInputWithCountrySelect;
}


import type { CountryCode } from 'libphonenumber-js';

declare module 'react-phone-number-input' {
    export type CountrySelectOptions<P = {}> = P & {
        value: CountryCode;
        label: string;
    };

    export type CountrySelectProps<Options extends CountrySelectOptions = CountrySelectOptions> = {
        /**
          * A two-letter country code.
          * Example: "US", "RU", etc.
          */
        value: CountryCode;

        /**
         * A function of `value: string`.
         * Updates the `value` property.
         */
        onChange?: (value: CountryCode) => void,
        // `<select/>` options.
        options: Options[];

        name?: string;
        'aria-label'?: string;
        onFocus?: (event: React.SyntheticEvent<React.Element, FocusEvent>) => void;
        onBlur?: (event: React.SyntheticEvent<React.Element, Event>) => void;
        disabled?: boolean;
        readOnly?: boolean;
    };

    export type CountryIconProps = {
        // 'aria-hidden': boolean;
        country?: CountryCode;
        label?: string;
        aspectRatio?: 1 | 1.5;
    };

    export type CountrySelectWithIconProps<Options extends CountrySelectOptions = CountrySelectOptions> = CountrySelectProps<Options> & {
        // Country flag component.
        iconComponent?: React.ComponentType<CountryIconProps>;
        // Select arrow component.
        arrowComponent?: React.ComponentType;
        // Set to `true` to render Unicode flag icons instead of SVG images.
        unicodeFlags?: boolean;
    };
}
