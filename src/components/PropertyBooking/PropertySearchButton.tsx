import React from 'react';
import { Button, ButtonProps } from '@lodgify/ui';
import { Price, PriceProps } from '../Price';
import { partition } from '../../util';

export type PropertyBookingButtonProps = PriceProps & ButtonProps;


export const PropertyBookingButton: React.FunctionComponent<PropertyBookingButtonProps> = ({ children, ...props }) => {
    const [ priceProps, buttonProps ] = partition(props, PriceProps);

    return <Button icon='search' isFormSubmit isRounded isDisabled={!(priceProps.price > 0)} {...buttonProps} >
        {children ? (typeof children === 'string' ? <span>{children}</span> : { children }) : <span>Book</span>}
        <Price {...priceProps} />
    </Button>;
};


PropertyBookingButton.displayName = 'PropertyBookingButton';
