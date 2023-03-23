import { isValidPhoneNumber } from 'libphonenumber-js';
import { DEFAULT_IS_INVALID_MESSAGE, DEFAULT_IS_REQUIRED_MESSAGE } from './Form.helpers';

import type { CountryCode } from '../../types';
import type { InputsState } from './Form.state.type';
import type { Omit, SelectType } from '../../util.types';
import { DateRange } from '@lodgify/ui';


export type Validation<InputValue = unknown, TransformedValue = InputValue, State extends InputsState = InputsState> = {
    invalidMessage: string;
    isRequired: boolean;
    isRequiredMessage: string;
    isEmpty: (value: InputValue) => boolean;
    validate: (value: InputValue, state: State) => { value?: TransformedValue; error?: string | boolean; };
    input?:
    | { type: 'string' | 'integer' | 'double' | 'boolean' | 'email' | 'date' | 'range-dates'; }
    | { type: 'range-integer' | 'range-double'; min?: number; max?: number; }
    | { type: 'phone-string'; countryCode: CountryCode; }
    | { type: 'phone'; };
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




const tryCatch = <T = void>(fn: () => T): { error?: string | boolean; } & T => {
    try {
        return fn();
    } catch (e) {
        return { error: (e as Error).message || true } as any;
    }
};

type TypeOf = 'undefined' | 'object' | 'boolean' | 'number' | 'bigint' | 'string';

type InferValueFromType<T extends TypeOf> =
    T extends 'undefined' ? undefined :
    T extends 'boolean' ? boolean :
    T extends 'string' ? string :
    T extends 'number' ? number :
    T extends 'bigint' ? bigint :
    T extends 'object' ? object | null | any[] : never;



export const validateAndTransform = <T extends TypeOf = 'string' | 'boolean'>(
    value: unknown,
    options: { type?: T; error?: string | boolean | ((value: InferValueFromType<T>) => string | boolean); transform?: (value: unknown) => unknown; }
) => {
    const { error, type, transform } = options;

    if (type && typeof value !== type)
        return { error: `value "${value}" is not of type "${type}"` };

    const err = !!error && (typeof error === 'function' ? error(value as InferValueFromType<T>) : error);

    if (!!err)
        return { error: err };


    return { value: transform?.(value) ?? value };
};


export const validatePhone = (value: unknown, countryCode: CountryCode) => validateAndTransform(value, {
    type: 'string',
    error: v => isValidPhoneNumber(v, countryCode) ? false : 'Invalid phone'
});


export const getValidationWithDefaults = <V extends Validation = Validation>(
    validation: Partial<V> = {}, defaultValidation: Partial<V> = {}
): V => {

    const { input } = validation;

    const validate = (value => {
        switch (input.type) {
            case 'string': return validateAndTransform(value, { type: 'string' });
            case 'boolean': return validateAndTransform(value, { type: 'boolean' });
            case 'integer': return tryCatch(() => ({ value: parseInt(value as string, 10) }));
            case 'double': return tryCatch(() => ({ value: parseFloat(value as string) }));
            case 'email': return validateAndTransform(value, {
                type: 'string',
                error: v => !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ? 'Invalid email' : false
            });
            case 'range-integer':
            case 'range-double': {
                const { min = -Infinity, max = Infinity } = input;

                const getNb = () => {
                    if (input.type === 'range-integer')
                        return tryCatch(() => ({ value: parseInt(value as string, 10) }));

                    return tryCatch(() => ({ value: parseInt(value as string, 10) }));
                };

                const { value: nb, error } = getNb();

                if (typeof error !== undefined)
                    return { error };

                if (min <= nb && nb <= max)
                    return { value: nb };

                return { error: `${nb} is out of range [ ${min}, ${max} ]` };
            }
            case 'phone-string':
            case 'phone': {
                if (input.type === 'phone-string')
                    return validatePhone(value, input.countryCode);

                const phone = value as ValidationValue<'phone'>[ 'value' ];
                return validatePhone(phone.value, phone.countryCode);
            }
            case 'range-dates': {
                const dates = value as ValidationValue<'range-dates'>[ 'value' ];

                const validations = {
                    startDate: validateAndTransform(dates.startDate, { type: 'string' }),
                    endDate: validateAndTransform(dates.endDate, { type: 'string' })
                };

                const error = Object.entries(validations).map(([ k, { error } ]) => error ? `"${k}": ${error}` : '').join(', ');
                return error ? { error } : { value };
            }

            default: return { value };
        }
    }) as V[ 'validate' ];



    const validationWithDefaults = {
        isEmpty: value => value === '' || typeof value === 'undefined' || value === null,
        /* isValid: value => true, */
        isRequiredMessage: DEFAULT_IS_REQUIRED_MESSAGE,
        invalidMessage: DEFAULT_IS_INVALID_MESSAGE,
        isRequired: true,
        validate,
        ...defaultValidation,
        ...validation
    } as V;

    return validationWithDefaults;
};




export type ValidationValue<T extends ValidationType> =
    T extends 'string' | 'email' | 'date' | 'phone-string' ? { value: string; transformedValue: string; } :
    T extends 'boolean' ? { value: boolean; transformedValue: boolean; } :
    T extends 'phone' ? { value: { countryCode: CountryCode; value: string; }; transformedValue: string; } :
    T extends 'range-dates' ? { value: DateRange<string>; transformedValue: DateRange<string>; } :
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
    const defaultValidationWithDefault = getValidationWithDefaults({}, defaultValidation);

    return (name: InferValidationData<PropsV>[ 'inputNames' ]) => {
        return propsValidation[ name ] || defaultValidationWithDefault;
    };

};
