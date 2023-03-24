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



export class InputProps<V = unknown> {
    name?: string;
    onBlur?: (name: string/* event?: FocusEvent */) => any;
    onChange?: (name: string, value: V) => any;
    width?: string;
    label?: string;
    value?: V;
};
