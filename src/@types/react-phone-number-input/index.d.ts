declare module 'react-phone-number-input/modules/react-hook-form/PhoneInputWithCountry' {
    import PhoneInputWithCountrySelect from 'react-phone-number-input/react-hook-form-core';


    import type { Metadata } from 'libphonenumber-js/core';

    export type PhoneInputWithCountrySelectType = typeof PhoneInputWithCountrySelect;
    export const createPhoneInput: (metadata: Metadata) => PhoneInputWithCountrySelectType;
    export default PhoneInputWithCountrySelect;
}
