import React, { useState } from 'react';
import { Button } from '@lodgify/ui';
import { PropertyBooking } from '../PropertyBookingBar';

import type { BookingProps } from './BookingComponent';


export const BookingView: React.FunctionComponent<BookingProps> = props => {
    const [ isShowing, setIsShowing ] = useState(true);

    return (
        <React.Fragment>
            <Button style={{ width: 'fit-content' }} hasShadow isRounded onClick={() => setIsShowing(!isShowing)}>
                {isShowing ? 'Hide' : 'Show'} search bar
            </Button>

            {isShowing && <PropertyBooking {...props} />}
        </React.Fragment>
    );
};

BookingView.displayName = 'BookingView';
