import { CountryCode, MetadataJson } from 'libphonenumber-js';
import React from 'react';


export type FlagProps = {
    country: CountryCode,
    // Will be HTML `title` attribute of the `<img/>`.
    countryName: string,
    // Country flag icon components.
    // By default flag icons are inserted as `<img/>`s
    // with their `src` pointed to `country-flag-icons` gitlab pages website.
    // There might be cases (e.g. an offline application)
    // where having a large (3 megabyte) `<svg/>` flags
    // bundle is more appropriate.
    // `import flags from 'react-phone-number-input/flags'`.
    flags: React.ComponentType<{}>,
    // A URL for a country flag icon.
    // By default it points to `country-flag-icons` gitlab pages website.
    flagUrl: string;
};

// Default country flag icon.
// `<img/>` is wrapped in a `<div/>` to prevent SVGs from exploding in size in IE 11.
// https://github.com/catamphetamine/react-phone-number-input/issues/111
export const Flag = (metadata: MetadataJson): React.FunctionComponent<FlagProps> => props => {
    const { country, countryName, flags, flagUrl, ...rest } = props;

    if (flags && flags[ country ]) {
        return flags[ country ]({
            title: countryName
        });
    }

    const prefix = metadata.countries[ country ][ 0 ];

    return <React.Fragment>
        <img {...rest}
            alt={countryName}
            role={countryName ? undefined : "presentation"}
            src={flagUrl.replace('{XX}', country).replace('{xx}', country.toLowerCase())} />;
        <span>+{prefix}</span>
    </React.Fragment>;
};

Flag.displayName = 'Flag';
