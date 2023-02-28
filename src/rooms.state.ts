import { useCallback, useState } from 'react';
import { getLodgifyInfo, getPeriodsNonAvailable, RequestOption } from './lodgify-info/info';
import { PropertyInfoPrice } from './lodgify-requests/types';
import { RoomData, RoomsData, RoomValues } from './rooms.data';


export const roomsDataAsObject = (rooms: RoomData[]) => rooms.reduce((o, room) => {
    return { ...o, [ room.value ]: room };
}, {} as RoomsData);


export const setRoom = (data: { rooms: RoomsData, room: Partial<RoomData>; roomValue: RoomValues; }) => ({
    ...data.rooms,
    [ data.roomValue ]: {
        ...data.rooms[ data.roomValue ],
        ...data.room
    }
});

export type UpdateRoomAction = |
{
    type: 'request-property-availability'; payload: { roomValue: RoomValues; } & Omit<RequestOption<'getAvailability'>, 'propertyId'>;
} |
{
    type: 'request-property-info'; payload: { roomValue: RoomValues; } & Omit<RequestOption<'getPropertyInfo'>, 'propertyId'>;
} |
{
    type: 'request-property-price'; payload: { roomValue: RoomValues; } & Omit<RequestOption<'getDailyRates'>, 'propertyId'>;
};


export const useRoomState = (roomsList: RoomData[]) => {
    const [ rooms, _setRooms ] = useState(roomsDataAsObject(roomsList));

    const updateRoom = useCallback(async (action: UpdateRoomAction) => {
        switch (action.type) {
            case 'request-property-availability': {
                const { roomValue, start, end } = action.payload;

                if (!!rooms[ roomValue ].periodsNonAvailable)
                    return;

                const perdiods = await getLodgifyInfo(roomValue, 'getAvailability', ({ propertyId }) => ({
                    propertyId, start, end //  start: '2023-01-01', end: '2024-01-01'
                })).then(res => {
                    if (res.type === 'success')
                        return getPeriodsNonAvailable(res.json[ 0 ]);
                });

                if (perdiods) {
                    _setRooms(rooms => setRoom({
                        rooms,
                        roomValue,
                        room: {
                            periodsNonAvailable: perdiods
                        }
                    }));
                }

                return;
            }

            case 'request-property-info': {
                const { roomValue } = action.payload;
                const room = rooms[ roomValue ];

                if (room.price !== undefined && room.rating !== undefined)
                    return;

                const propertyInfo = await getLodgifyInfo(roomValue, 'getPropertyInfo', ({ propertyId }) => ({
                    propertyId
                })).then(res => {
                    if (res.type === 'success')
                        return res.json;
                });

                if (propertyInfo) {
                    _setRooms(rooms => setRoom({
                        rooms,
                        roomValue,
                        room: {
                            price: Object.entries(propertyInfo).reduce((o, [ k, v ]) => {
                                return k.includes('price') ? { ...o, [ k ]: v } : o;
                            }, {} as PropertyInfoPrice),
                            rating: propertyInfo.rating
                        }
                    }));
                }
                return;
            }

            default:
                throw new Error();
        }
    }, [ rooms, _setRooms ]);

    return {
        rooms,
        setRoom: updateRoom,
        getRoom: useCallback((roomValue: RoomValues) => rooms[ roomValue ], [ rooms ])
    };
};
