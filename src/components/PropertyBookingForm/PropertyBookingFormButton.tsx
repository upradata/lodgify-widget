import React from 'react';
import { Button, ButtonProps } from '@lodgify/ui';
import { Price, PriceProps } from '../Price';
import { fragments } from '../../util';

export type PropertyBookingFormButtonProps = PriceProps & ButtonProps;


export const PropertyBookingFormButton: React.FunctionComponent<PropertyBookingFormButtonProps> = ({ children, ...props }) => {
    const [ priceProps, buttonProps ] = fragments(props, PriceProps);

    return <Button /* icon='search' */ isFormSubmit isRounded isDisabled={!(priceProps.price > 0)} {...buttonProps} >
        {children ? (typeof children === 'string' ? <span>{children}</span> : { children }) : <span>Book</span>}
        <Price {...priceProps} />
    </Button>;
};


PropertyBookingFormButton.displayName = 'PropertyBookingFormButton';
