import React from 'react';
import { Icon } from '@lodgify/ui';
import { dateAsString } from '../../lodgify-info/info';

import type { LodgifyDate } from '../../lodgify-requests/types';


export type PropertyBookingHeaderProps = { roomName: string; startDate: LodgifyDate; endDate: LodgifyDate; };

export const PropertyBookingHeader: React.FunctionComponent<PropertyBookingHeaderProps> = ({ roomName, startDate, endDate }) => {
    return (
        <div className="BookingHeader vertical-baseline">
            <span className="BookingHeader__location">{roomName}</span>

            <div className="BookingHeader__dates vertical-center">
                <span>{dateAsString(startDate)}</span>
                <Icon name="arrow right" />
                <span>{dateAsString(endDate)}</span>
            </div>
        </div>
    );
};
