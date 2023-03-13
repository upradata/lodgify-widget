import React from 'react';
import { Icon } from '@lodgify/ui';
import { dateAsString } from '../../lodgify-info/info';

import type { LodgifyDate } from '../../lodgify-requests/types';


export type StepBookingHeaderProps = { roomName: string; startDate: LodgifyDate; endDate: LodgifyDate; };

export const StepBookingHeader: React.FunctionComponent<StepBookingHeaderProps> = ({ roomName, startDate, endDate }) => {
    return (
        <div className="BookingHeader vertical-baseline">
            <h3 className="BookingHeader__location">{roomName}</h3>

            <div className="BookingHeader__dates vertical-center">
                <span>{dateAsString(startDate)}</span>
                <Icon name="arrow right" />
                <span>{dateAsString(endDate)}</span>
            </div>
        </div>
    );
};
