import React from 'react';
import { Icon } from '@lodgify/ui';
import { plural, /* localizedPrice */ } from '../../util';
import { Price, PriceProps } from '../Price';


export type PropertyBookingSubHeaderProps = { nbGuest: number; nbNights: number; } & PriceProps;

export const PropertyBookingSubHeader: React.FunctionComponent<PropertyBookingSubHeaderProps> = ({ nbNights,  nbGuest, ...priceProps }) => {

    return (
        <div className="BookingSubHeader vertical-center">
            <div className="BookingSubHeader__guests vertical-center" style={{ gap: 2 }}>
                <span style={{ marginTop: 1 }}>{nbGuest}x</span>
                <Icon name="guests" />
            </div>

            <div className="BookingSubHeader__nights vertical-center">
                ｜ <span>{nbNights} {plural(nbNights, 'night')}</span>
            </div>

            <div className="BookingSubHeader__price vertical-center" style={{ color: '#4b4b4b', marginLeft: 20 }}>
                {/* <Icon name="caret right" /> */}
                <span className="BookingSubHeader__price">
                    {/*  {localizedPrice(price)} */}
                    <Price {...priceProps} />
                </span>
            </div>
        </div>
    );
};
