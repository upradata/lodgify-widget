export type RoomData = {
    name: string;
    propertyId: number;
    roomId: number;
    image?: string;
    value: string;
};

const kebabCase = (s: string) => s.trim().replaceAll(/(\s+)/g, '-').toLowerCase();
const makeRoomData = (data: Omit<RoomData, 'value'>): RoomData => ({ ...data, value: kebabCase(data.name) });

export const roomsData = ([
    makeRoomData({ name: 'Za Rohom', propertyId: 432806, roomId: 498935, image: 'https://l.icdbcdn.com/oh/b47d66b2-8d36-4e13-91a5-6c1624c9d27d.jpg?w=1040' }),
    makeRoomData({ name: 'Carla', propertyId: 415187, roomId: 481198, image: 'https://l.icdbcdn.com/oh/1cdf3588-633f-4d6c-937e-c877f0b8530b.jpg?w=1040' }),
    makeRoomData({ name: 'Mini-Hotel', propertyId: 436901, roomId: 503044, image: 'https://l.icdbcdn.com/oh/6a50263d-aa68-41a2-af0b-97551e554763.jpg?w=1040' }),
    makeRoomData({ name: 'Room 4', propertyId: 432806, roomId: 498935, image: 'https://l.icdbcdn.com/oh/b47d66b2-8d36-4e13-91a5-6c1624c9d27d.jpg?w=1040' }),
    makeRoomData({ name: 'Room 5', propertyId: 432806, roomId: 498935, image: 'https://l.icdbcdn.com/oh/b47d66b2-8d36-4e13-91a5-6c1624c9d27d.jpg?w=1040' })
]);

/*  ...{
        periodsNonAvailable: undefined,
        price: undefined
    } as RoomInfo */

// export type RoomData = (typeof roomsData[ number ]);
// export type RoomNames = (typeof roomsData)[ number ][ 'name' ];
// export type RoomValues = (typeof roomsData)[ number ][ 'value' ];

// export type RoomsData = Record<RoomValues, RoomData>;

export type RoomsData = Record<string, RoomData>;
export type RoomValue = RoomData[ 'value' ];


export const getRoomDataBy = (select: (data: RoomData) => boolean): RoomData => roomsData.find(l => select(l));


// export const getRoomDataById = ({ propertyId, roomId }: Pick<RoomData, 'propertyId' | 'roomId'>) => {
//     return getRoomDataBy(data => data.propertyId === propertyId && data.roomId === roomId);
// };

// export const getRoomDataByValue = (roomValue: RoomValue) => getRoomDataBy(data => data.value === roomValue);
