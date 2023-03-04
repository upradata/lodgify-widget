import React from 'react';
import { Button, ButtonProps, TextPlaceholder } from '@lodgify/ui';
import { Loader } from 'semantic-ui-react';
import { localizedPrice } from '../../util';


type ButtonPriceProps = {
    price?: number;
    isLoading?: boolean;
};

export type PropertyBookingButtonProps = ButtonPriceProps & ButtonProps;


export const PropertyBookingButton: React.FunctionComponent<PropertyBookingButtonProps> = ({ children, price, isLoading, ...buttonProps }) => {
    return <Button icon='search' isFormSubmit isRounded isDisabled={!(price > 0)} {...buttonProps} >
        {children ? (typeof children === 'string' ? <span>{children}</span> : { children }) : <span>Book</span>}
        <ButtonPrice price={price} isLoading={isLoading} />
    </Button>;
};


const ButtonPrice: React.FunctionComponent<ButtonPriceProps> = ({ price, isLoading }) => {
    if (price > 0)
        return <span className="search__price" style={{ marginLeft: '4px' }}>{localizedPrice(price)}</span>;

    return (
        <div className="search__price--placeholder-wrapper">
            {isLoading && <>
                <div style={{ position: 'relative', width: '40px' }}>
                    <Loader active size="tiny" inverted indeterminate></Loader>
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


PropertyBookingButton.displayName = 'PropertyBookingButton';
