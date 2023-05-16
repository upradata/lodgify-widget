import './Price.scss';

import React from 'react';
import { TextPlaceholder } from '@lodgify/ui';
import { Loader } from 'semantic-ui-react';
import { localizedPrice } from '@root/util';


export class PriceProps {
    price?: number;
    isLoading?: boolean;
    loaderInverted?: boolean;
};


export const Price: React.FunctionComponent<PriceProps> = ({ price, isLoading, loaderInverted = false }) => {
    if (!isLoading && price > 0)
        return <span className="Price search__price" style={{ marginLeft: '4px' }}>{localizedPrice(price)}</span>;

    return (
        <div className="Price search__price--placeholder-wrapper">
            {isLoading && <>
                <div style={{ position: 'relative', width: '40px' }}>
                    <Loader active size="tiny" inverted={loaderInverted} indeterminate></Loader>
                </div>
                <span>€</span>
            </>}

            {!isLoading && <>
                <TextPlaceholder style={{ width: '20px' }} />
                <span>€</span>
            </>}
        </div>
    );
};
