
import { Range } from '../types';

export interface Availibity {
    user_id: number;
    property_id: number;
    room_type_id: number;
    periods: Period[];
}

export type Period = Range<string> & {
    available: number;
    closed_period?: any;
    bookings: Booking[];
    channel_calendars: any[];
};


export interface Booking {
    id: number;
    status?: any;
}


/* 

{
    "user_id": 510120,
    "property_id": 432806,
    "room_type_id": 498935,
    "periods": [
        {
        "start": "2023-01-01",
        "end": "2023-01-16",
        "available": 1,
        "closed_period": null,
        "bookings": [],
        "channel_calendars": []
        },
        {
        "start": "2023-01-17",
        "end": "2023-01-20",
        "available": 0,
        "closed_period": null,
        "bookings": [
            {
            "id": 5670858,
            "status": "Booked"
            }
        ],
        "channel_calendars": []
        }
    ]
}

*/
