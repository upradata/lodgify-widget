import classnames from 'classnames';

import type { ImgHTMLAttributes } from 'react';
import type { CountryCode } from '../../types';


export type FlagProps = {
    // The country to be selected by default.
    // Two-letter country code ("ISO 3166-1 alpha-2").
    country: CountryCode;
    // Will be HTML `title` attribute of the `<img/>`.
    countryName?: string;
    // Country flag icon components.
    // By default flag icons are inserted as `<img/>`s
    // with their `src` pointed to `country-flag-icons` gitlab pages website.
    // There might be cases (e.g. an offline application)
    // where having a large (3 megabyte) `<svg/>` flags
    // bundle is more appropriate.
    // `import flags from 'react-phone-number-input/flags'`.
    flags?: Record<string, React.ComponentType<{ title: string; }>>,
    // A URL for a country flag icon.
    // By default it points to `country-flag-icons` gitlab pages website.
    flagUrl?: string;
} & ImgHTMLAttributes<HTMLImageElement>;


export const Flag: React.FunctionComponent<FlagProps> = ({ country, countryName, flags, flagUrl, ...props }) => {
    if (flags && flags[ country ]) {
        const FlagComponent = flags[ country ];
        return <FlagComponent title={countryName} />;
    }

    return <img
        alt={countryName}
        role={countryName ? undefined : "presentation"}
        src={flagUrl.replace('{XX}', country).replace('{xx}', country.toLowerCase())}
        {...props}
        className={classnames(props.className, 'flag')} />;
};


Flag.displayName = 'Flag';
Flag.defaultProps = {
    flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/{XX}.svg'
};
