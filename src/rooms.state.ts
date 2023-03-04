import { useCallback, useState } from 'react';
import { getAvailability, getPropertyInfo } from './lodgify-requests';
import {
    getPeriodsNonAvailable,
    RequestOption,
} from './lodgify-info/info';

import type { Moment } from 'moment';
import type { RoomData, RoomsData, RoomValue } from './rooms.data';


export type RoomInfo = {
    periodsNonAvailable?: { start: Moment; end: Moment; }[];
    price?: { minPrice: number; maxPrice: number; };
    rating?: number;
};


export type RoomState = RoomInfo & RoomData;
export type RoomsState = Record<string, RoomState>;


const initialRoomsState = (rooms: RoomData[]): RoomsState => rooms.reduce((o, room) => {
    return {
        ...o,
        [ room.value ]: {
            ...room,
            ...{
                periodsNonAvailable: [],
                price: undefined,
                rating: undefined
            } as RoomInfo
        }
    };
}, {} as RoomsData);


export const setRoom = (data: { rooms: RoomsState, room: Partial<RoomState>; roomValue: RoomValue; }) => ({
    ...data.rooms,
    [ data.roomValue ]: {
        ...data.rooms[ data.roomValue ],
        ...data.room
    }
});

export type UpdateRoomAction = |
    { type: 'request-property-availability'; roomValue: RoomValue; } & Omit<RequestOption<'getAvailability'>, 'propertyId'> |
    { type: 'request-property-info'; roomValue: RoomValue; } & Omit<RequestOption<'getPropertyInfo'>, 'propertyId'>;


export const useRoomState = (roomsList: RoomData[]) => {
    const [ rooms, _setRooms ] = useState<RoomsState>(initialRoomsState(roomsList));

    const updateRoom = useCallback(async (action: UpdateRoomAction) => {
        switch (action.type) {
            case 'request-property-availability': {
                const { roomValue, start, end } = action;
                const { propertyId } = rooms[ roomValue ];

                const periodsNonAvailable = await getAvailability({
                    propertyId, start, end
                }).then(res => {
                    if (res.type === 'success')
                        return getPeriodsNonAvailable(res.json[ 0 ]);
                });

                if (periodsNonAvailable) {
                    _setRooms(rooms => setRoom({
                        rooms,
                        roomValue,
                        room: {
                            periodsNonAvailable
                        }
                    }));
                }

                return;
            }

            case 'request-property-info': {
                const { roomValue } = action;
                const room = rooms[ roomValue ];

                if (room.price !== undefined && room.rating !== undefined && room.image !== undefined)
                    return;

                const { propertyId } = rooms[ roomValue ];

                const propertyInfo = await getPropertyInfo({ propertyId }).then(res => {
                    if (res.type === 'success')
                        return res.json;
                });

                if (propertyInfo) {
                    _setRooms(rooms => setRoom({
                        rooms,
                        roomValue,
                        room: {
                            price: {
                                minPrice: propertyInfo.min_price,
                                maxPrice: propertyInfo.max_price
                            },
                            rating: propertyInfo.rating,
                            image: rooms[ roomValue ].image || propertyInfo.image_url
                        }
                    }));
                }
                return;
            }

            default:
                throw new Error(`Action type "${(action as UpdateRoomAction).type}" is not handled!`);
        }
    }, [ rooms, _setRooms ]);

    return {
        rooms,
        setRoom: updateRoom,
        getRoom: useCallback((roomValue: RoomValue) => rooms[ roomValue ], [ rooms ])
    };
};
