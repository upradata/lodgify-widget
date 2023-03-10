import { useCallback, useState } from 'react';
import moment from 'moment';
import { getAvailability, GetAvailibityOptions, getDailyRates, getPropertyInfo, GetPropertyInfoOptions, getRatesSettings, getRoomInfo } from './lodgify-requests';
import { getPeriodsNonAvailable, momentToLodgifyDate } from './lodgify-info/info';

import type { Moment } from 'moment';
import type { RoomData, RoomsData, RoomValue } from './rooms.data';


type DailyPrice = {
    minStay: number;
    maxStay: number;
    pricePerDay: number;
};

export type RoomInfo = {
    periodsNonAvailable?: { start: Moment; end: Moment; }[];
    price?: { minPrice: number; maxPrice: number; };
    rating?: number;
    defaultRates?: DailyPrice[];
    minStay?: number;
    maxStay?: number;
    maxGuests?: number;
    vat?: number;
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
                rating: undefined,
                minStay: 0,
                maxStay: Infinity,
                maxGuests: Infinity
            } as RoomInfo
        }
    };
}, {} as RoomsData);


export const _setRoom = (data: { rooms: RoomsState, room: Partial<RoomState>; roomValue: RoomValue; }) => ({
    ...data.rooms,
    [ data.roomValue ]: {
        ...data.rooms[ data.roomValue ],
        ...data.room
    }
});

export type UpdateRoomAction = |
    { type: 'request-property-availability'; roomValue: RoomValue; } & Omit<GetAvailibityOptions, 'propertyId'> |
    { type: 'request-property-info'; roomValue: RoomValue; } & Omit<GetPropertyInfoOptions, 'propertyId'>;


export const useRoomState = (roomsList: RoomData[]) => {
    const [ rooms, _setRooms ] = useState<RoomsState>(initialRoomsState(roomsList));

    const updateRoom = useCallback(async (action: UpdateRoomAction) => {

        const { roomValue } = action;

        const setRoom = (room: Partial<RoomState>) => _setRooms(rooms => _setRoom({
            rooms,
            roomValue,
            room
        }));

        switch (action.type) {
            case 'request-property-availability': {
                const { start, end } = action;
                const { propertyId } = rooms[ roomValue ];

                const periodsNonAvailable = await getAvailability({
                    propertyId, start, end
                }).then(res => {
                    if (res.type === 'success')
                        return getPeriodsNonAvailable(res.json[ 0 ]);
                }).catch(err => {
                    console.error(err);
                });

                if (periodsNonAvailable) {
                    setRoom({ periodsNonAvailable });
                }

                return;
            }

            case 'request-property-info': {
                try {
                    const room = rooms[ roomValue ];

                    if (room.price !== undefined && room.rating !== undefined && room.image !== undefined)
                        return;

                    const { propertyId, roomId: roomTypeId } = rooms[ roomValue ];
                    const today = momentToLodgifyDate(moment());

                    const [ propertyInfo, roomInfo, dailyRates, rateSettings ] = await Promise.all([
                        getPropertyInfo({ propertyId }).then(res => {
                            if (res.type === 'success')
                                return res.json;
                        }),
                        getRoomInfo({ propertyId, roomTypeId }).then(res => {
                            if (res.type === 'success')
                                return res.json;
                        }),
                        // To get the min_stay/max_stay, I have to get the "is_default": true" data from getDailyRates
                        getDailyRates({ start: today, end: today, propertyId, roomTypeId }).then(res => {
                            if (res.type === 'success')
                                return res.json;
                        }),
                        getRatesSettings({ propertyId }).then(res => {
                            if (res.type === 'success')
                                return res.json;
                        })
                    ]);

                    if (propertyInfo) {
                        setRoom({
                            price: {
                                minPrice: propertyInfo.min_price,
                                maxPrice: propertyInfo.max_price
                            },
                            rating: propertyInfo.rating,
                            image: rooms[ roomValue ].image || propertyInfo.image_url,
                            minStay: propertyInfo.price_unit_in_days,
                        });
                    }

                    if (roomInfo) {
                        setRoom({ maxGuests: roomInfo.max_people });
                    }

                    if (dailyRates) {
                        const defaultRates = dailyRates.calendar_items.find(item => item.is_default)?.prices.map(price => ({
                            minStay: price.min_stay || 0,
                            maxStay: price.max_stay || Infinity,
                            pricePerDay: price.price_per_day
                        }));

                        if (defaultRates) {
                            setRoom({
                                defaultRates,
                                // minStay: defaultRates.reduce((min, { minStay }) => Math.min(min, minStay), Infinity),
                                maxStay: defaultRates.reduce((max, { maxStay }) => Math.max(max, maxStay), 0),
                            });
                        }
                    }

                    if (rateSettings) {
                        setRoom({ vat: rateSettings.vat });
                    }

                } catch (err) {
                    console.error(err);
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
