import { memo } from 'react';
import classnames from 'classnames';
import { Flag, FlagProps } from './Flag';
import InternationalIcon from '../../../node_modules/react-phone-number-input/modules/InternationalIcon';

import type { CountryCodeWithInternational } from '../../types';
import type { Omit } from '../../util.types';

export type CountryIconProps = Omit<FlagProps, 'country'> & {
    country?: CountryCodeWithInternational;
    label?: string;
    aspectRatio?: 1 | 1.5;
};

const _CountryIcon: React.FunctionComponent<CountryIconProps> = ({ country, label, aspectRatio, flags, flagUrl, ...props }) => {
    return (
        <div className={classnames('CountryIcon', { 'CountryIcon--square': aspectRatio === 1 })}>
            {country && country !== 'ZZ' ?
                <Flag className="CountryIcon__img" country={country} countryName={label} flags={flags} flagUrl={flagUrl} {...props} /> :
                <InternationalIcon className="CountryIcon__img" title={label} aspectRatio={aspectRatio} />
            }
        </div>
    );
};


_CountryIcon.displayName = 'CountryIcon';
_CountryIcon.defaultProps = {
    flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/{XX}.svg',
};


export const CountryIcon = memo(_CountryIcon);
