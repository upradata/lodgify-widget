export * from './availabity.type';
export * from './property-info.type';
export * from './daily-rate.type';
export * from './quote.type';
export * from './addons.type';
export * from './common.type';
export * from './room-info.type';


type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type Year = `20${Digit}${Digit}`;
type Month = `${'0' | '1'}${Digit}`;
type Day = `${'0' | '1' | '2' | '3'}${Digit}`;

export type LodgifyDate = `${Year}-${Month}-${Day}`;
