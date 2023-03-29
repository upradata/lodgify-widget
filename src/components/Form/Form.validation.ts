import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import { DEFAULT_IS_INVALID_MESSAGE, DEFAULT_IS_REQUIRED_MESSAGE } from './Form.helpers';

import type { DateRange } from '@lodgify/ui';
import type { CountryCode } from '../../types';
import type { InputsState } from './Form.state.type';
import type { Omit, SelectType, TypeOf } from '../../util.types';
import { errorToString } from '../../util';


type ValidatedValue<TransformedValue = unknown> = { transformedValue?: TransformedValue; error?: string | boolean; };

type DateType = 'string' | 'object'; // 'moment' | 'date';

export type Validation<InputValue = unknown, TransformedValue = InputValue, State extends InputsState = InputsState> = {
    invalidMessage: string;
    isRequired: boolean;
    isRequiredMessage: string;
    isEmpty: (value: InputValue) => boolean;
    emptyValue: InputValue;
    validate: (value: InputValue, state: State) => ValidatedValue<TransformedValue>;
    untransformed: (transformedValue: TransformedValue) => InputValue;
    input:
    | { type: 'string' | 'integer' | 'double' | 'boolean' | 'email'; }
    | { type: 'range-integer' | 'range-double'; min?: number; max?: number; }
    | { type: 'phone-string'; countryCode?: CountryCode; }
    | { type: 'phone'; }
    | { type: 'range-dates' | 'date'; dateType: DateType; };
};

export type ValidationType = Validation[ 'input' ][ 'type' ];

type Optional<O, T extends 'partial' | 'identity' = 'identity'> = T extends 'partial' ? Partial<O> : O;

export type PropsValidation<
    InputValue = unknown,
    InputValues extends Record<string, InputValue> = Record<string, InputValue>,
    PartialV extends 'partial' | 'identity' = 'identity'
> = {
        [ K in keyof InputValues ]: Optional<Validation<InputValue, InputValues[ keyof InputValues ], InputsState<InputValues>>, PartialV>
    };


export type PropsValidationOptions<
    InputValue = unknown,
    InputValues extends Record<string, InputValue> = Record<string, InputValue>
> = {
    default?: Partial<Validation>,
    props?: Partial<PropsValidation<InputValue, InputValues, 'partial'>>;
};


// type InferDateType<T extends 'string' | 'moment' | 'date'> = T extends 'string' ? string : T extends 'date' ? Date : Moment;

type InputTypeOf = Exclude<TypeOf, 'symbol' | 'function'>;

type InferValueFromType<T extends InputTypeOf> =
    T extends 'undefined' ? undefined :
    T extends 'boolean' ? boolean :
    T extends 'string' ? string :
    T extends 'number' ? number :
    T extends 'bigint' ? bigint :
    T extends 'object' ? object | null | any[] : never;



const parseNumber = (value: unknown, type: 'integer' | 'double'): ValidatedValue => {
    const nb = type === 'integer' ? parseInt(value as string, 10) : parseFloat(value as string);
    return isNaN(nb) ? { error: `Not a "${type}"` } : { transformedValue: nb };
};


export const validateAndTransform = <T extends InputTypeOf = 'string' | 'boolean'>(
    value: unknown,
    options: { type?: T; error?: string | boolean | ((value: InferValueFromType<T>) => string | boolean); transform?: (value: unknown) => unknown; }
): ValidatedValue => {
    try {
        const { error, type, transform } = options;

        if (type && typeof value !== type)
            return { error: `value (${typeof value === 'object' ? JSON.stringify(value) : value}) is not of type "${type}"` };

        const err = !!error && (typeof error === 'function' ? error(value as InferValueFromType<T>) : error);

        if (!!err)
            return { error: err };


        return { transformedValue: transform?.(value) ?? value };

    } catch (e) {
        return { error: errorToString(e) };
    }
};


export const validatePhone = (value: unknown, countryCode: CountryCode) => validateAndTransform(value, {
    type: 'string',
    error: v => isValidPhoneNumber(v, countryCode) ? false : 'Invalid phone'
});


export const getValidationWithDefaults = <V extends Validation = Validation>(
    validation: Partial<V> = {}, defaultValidation: Partial<V> = {}
): V => {

    const input = validation.input || defaultValidation.input || { type: 'default' };

    const validate = (value => {
        switch (input.type) {
            case 'string': return validateAndTransform(value, { type: 'string' });
            case 'boolean': return validateAndTransform(value, { type: 'boolean' });
            case 'integer': return parseNumber(value, 'integer');
            case 'double': return parseNumber(value, 'double');
            case 'email': return validateAndTransform(value, {
                type: 'string',
                error: v => !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ? 'Invalid email' : false
            });
            case 'range-integer':
            case 'range-double': {
                const { min = -Infinity, max = Infinity } = input;

                const { transformedValue: nb, error } = parseNumber(value, 'integer');

                if (typeof error !== undefined)
                    return { error };

                if (min <= nb && nb <= max)
                    return { transformedValue: nb };

                return { error: `${nb} is out of range [ ${min}, ${max} ]` };
            }
            case 'phone-string':
            case 'phone': {
                if (input.type === 'phone-string')
                    return validatePhone(value, input.countryCode);

                const phone = value as ValidationValue<'phone'>[ 'value' ];
                const { error } = validatePhone(phone.value, phone.countryCode);

                return error ? { error } : { transformedValue: value };
            }
            case 'date':
            case 'range-dates': {
                const { dateType } = input;

                if (input.type === 'range-dates') {
                    const dates = value as ValidationValue<'range-dates'>[ 'value' ];

                    const validations = {
                        startDate: validateAndTransform(dates.startDate, { type: dateType }),
                        endDate: validateAndTransform(dates.endDate, { type: dateType })
                    };

                    const error = Object.entries(validations).map(([ k, { error } ]) => error ? `<${k}>: ${error}` : '').filter(s => s !== '').join(', ');
                    return error ? { error } : { transformedValue: value };
                }

                return validateAndTransform(value as ValidationValue<'date'>[ 'value' ], { type: dateType });
            }

            case 'default':
            default: return { transformedValue: value };
        }
    }) as V[ 'validate' ];



    const untransformed = (value => {
        if (!value)
            return value;

        switch (input.type) {
            case 'integer':
            case 'double':
            case 'range-integer':
            case 'range-double': return `${value}`;
            case 'phone': {
                const phone = value as string;
                const parsePhone = parsePhoneNumber(phone);

                return { value: value, countryCode: parsePhone.country } as ValidationValue<'phone'>[ 'value' ];
            }

            default: return value;
        }
    }) as V[ 'untransformed' ];

    const emptyValue = () => {
        switch (input.type) {
            case 'boolean': return false;
            case 'phone':
            case 'range-dates':
            case 'date': return null;

            default: return '';
        }
    };

    const validationWithDefaults = {
        isEmpty: value => value === '' || typeof value === 'undefined' || value === null,
        emptyValue: emptyValue(),
        /* isValid: value => true, */
        isRequiredMessage: DEFAULT_IS_REQUIRED_MESSAGE,
        invalidMessage: DEFAULT_IS_INVALID_MESSAGE,
        isRequired: true,
        validate,
        untransformed,
        ...defaultValidation,
        ...validation
    } as V;

    return validationWithDefaults;
};



export type ValidationValue<T extends ValidationType> =
    T extends 'string' | 'email' | 'phone-string' ? { value: string; transformedValue: string; } :
    T extends 'boolean' ? { value: boolean; transformedValue: boolean; } :
    T extends 'phone' ? { value: { countryCode: CountryCode; value: string; }; transformedValue: string; } :
    T extends 'date' ? { value: DateType; transformedValue: DateType; } :
    T extends 'range-dates' ? { value: DateRange<DateType>; transformedValue: DateRange<DateType>; } :
    T extends 'integer' | 'double' | 'range-integer' | 'range-double' ? { value: string; transformedValue: number; } :
    unknown;


type Payload<T extends ValidationType> = SelectType<Validation[ 'input' ], T>;
type ExactValidation<T extends ValidationType, State extends InputsState> = Validation<
    ValidationValue<T>[ 'value' ],
    ValidationValue<T>[ 'transformedValue' ],
    State
>;


type MakeValidationOption<T extends ValidationType, State extends InputsState> = Partial<Omit<ExactValidation<T, State>, 'input'> & { input: Omit<Payload<T>, 'type'>; }>;
type MakeValidationReturn<T extends ValidationType, State extends InputsState> = Omit<ExactValidation<T, State>, 'input'> & { input: Payload<T>; };

export const makeValidation = <T extends ValidationType, State extends InputsState>(
    type: T, validation: MakeValidationOption<T, State> = {}
): MakeValidationReturn<T, State> => {
    return { ...validation, input: { type, ...validation.input } } as any;
};



type InferValidationData<T> = T extends PropsValidation<infer InputPropsValue, infer InputValues> ? {
    InputPropsValue: InputPropsValue;
    inputNames: keyof InputValues;
    inputValues: InputValues[ keyof InputValues ];
    inputValuesRecord: InputValues;
} : never;

type InferValidation<PropsV extends PropsValidation> = Validation<
    InferValidationData<PropsV>[ 'InputPropsValue' ],
    InferValidationData<PropsV>[ 'inputValues' ],
    InputsState<InferValidationData<PropsV>[ 'inputValuesRecord' ]>
>;

export const makeGetValidation = <
    PropsV extends PropsValidation
>(
    propsValidation: PropsV,
    defaultValidation: Partial<InferValidation<PropsV>> = {}
) => {
    const defaultValidationWithDefault = getValidationWithDefaults({}, { isRequired: false, ...defaultValidation });

    return (name: InferValidationData<PropsV>[ 'inputNames' ]) => {
        return propsValidation?.[ name ] || defaultValidationWithDefault;
    };

};


export type GetValidation<
    InputValue = unknown,
    InputValues extends Record<string, InputValue> = Record<string, InputValue>,
    N extends string = string
> = (name: N) => N extends keyof InputValues ? Validation<InputValue, InputValues[ keyof InputValues ], InputsState<InputValues>> : Validation;
