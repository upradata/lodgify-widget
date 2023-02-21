import { LodgifyDate } from '../../lodgify-requests';


export class Reservation {
    roomValue?: string;
    nbOfNights?: number;
    startDate?: LodgifyDate;
    endDate?: LodgifyDate;
    price?: number;
    nbGuests: number;
    isLoading?: boolean;
};
