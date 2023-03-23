import type { CountryCode } from 'libphonenumber-js';


export type { CountryCode } from 'libphonenumber-js';

export type { MetadataJson as PhonesMetadata } from 'libphonenumber-js/core';

export type CountriesMetadata = {
    name: string;
    code: CountryCode;
}[];

export type Range<T> = {
    start: T;
    end: T;
};
