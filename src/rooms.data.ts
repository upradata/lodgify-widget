import type { Moment } from 'moment';
import type { PropertyInfoPrice } from './lodgify-requests/types';
import type { KebabCase } from './useful-types';

export type RoomInfo = {
    periodsNonAvailable?: { start: Moment; end: Moment; }[];
    price?: PropertyInfoPrice;
    rating: number;
};

export const roomsData = ([
    { name: 'Za Rohom', propertyId: 432806, roomId: 498935, image: 'https://l.icdbcdn.com/oh/b47d66b2-8d36-4e13-91a5-6c1624c9d27d.jpg?w=1040' },
    { name: 'Carla', propertyId: 415187, roomId: 481198, image: 'https://l.icdbcdn.com/oh/1cdf3588-633f-4d6c-937e-c877f0b8530b.jpg?w=1040' },
    { name: 'Mini-Hotel', propertyId: 436901, roomId: 503044, image: 'https://l.icdbcdn.com/oh/6a50263d-aa68-41a2-af0b-97551e554763.jpg?w=1040' },
    { name: 'Room 4', propertyId: 432806, roomId: 498935, image: 'https://l.icdbcdn.com/oh/b47d66b2-8d36-4e13-91a5-6c1624c9d27d.jpg?w=1040' },
    { name: 'Room 5', propertyId: 432806, roomId: 498935, image: 'https://l.icdbcdn.com/oh/b47d66b2-8d36-4e13-91a5-6c1624c9d27d.jpg?w=1040' }
] as const).map(data => ({
    // indent: 0,
    ...data,
    value: data.name.trim().replaceAll(/(\s+)/g, '-').toLowerCase() as KebabCase<typeof data.name>,
    ...{
        periodsNonAvailable: undefined,
        price: undefined
    } as RoomInfo
}));



export type RoomData = (typeof roomsData[ number ]);
export type RoomNames = (typeof roomsData)[ number ][ 'name' ];
export type RoomValues = (typeof roomsData)[ number ][ 'value' ];

export type RoomsData = Record<RoomValues, RoomData>;

export const getRoomData = (roomValue: RoomValues) => roomsData.find(l => l.value === roomValue);
