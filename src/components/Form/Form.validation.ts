import { DEFAULT_IS_INVALID_MESSAGE, DEFAULT_IS_REQUIRED_MESSAGE } from './Form.helpers';

// import type { Validation } from '@lodgify/ui';
import type { Omit, SelectType } from '../../util.types';


export type DomValue = string | boolean;

export type Validation<DOMValue = DomValue, TransformedValue = unknown> = {
    invalidMessage: string;
    isRequired: boolean;
    isRequiredMessage: string;
    isEmpty: (value: DOMValue) => boolean;
    validate: (value: DOMValue) => { value?: TransformedValue; error?: string | boolean; };
    input?:
    | { type: 'string' | 'integer' | 'double' | 'boolean' | 'email' | 'date'; }
    | { type: 'range-integer' | 'range-double', min?: number; max?: number; };
};

export type ValidationType = Validation[ 'input' ][ 'type' ];

export type DomInputValue<T extends ValidationType> = T extends 'boolean' ? boolean : string;

type Optional<O, T extends 'partial' | 'identity' = 'identity'> = T extends 'partial' ? Partial<O> : O;

export type PropsValidation<InputValues extends Record<string, unknown> = Record<string, unknown>, PartialV extends 'partial' | 'identity' = 'identity'> = {
    [ K in keyof InputValues ]: Optional<Validation<DomValue, InputValues[ keyof InputValues ]>, PartialV>
};

/*  Record<
    InputNames,
    PartialV extends 'partial' ? Partial<Validation<Values>> : Validation<Values>
>; */

export type PropsValidationOptions<InputValues extends Record<string, unknown> = Record<string, unknown>> = {
    default?: Partial<Validation>,
    props?: Partial<PropsValidation<InputValues, 'partial'>>;
};




const tryCatch = <T = void>(fn: () => T): { error?: string | boolean; } & T => {
    try {
        return fn();
    } catch (e) {
        return { error: (e as Error).message || true } as any;
    }
};

export const getValidationWithDefaults = <
    DomValue = unknown,
    FormValue = unknown,
    V extends Validation<DomValue, FormValue> = Validation<DomValue, FormValue>
>(
    validation: Partial<V> = {}, defaultValidation: Partial<V> = {}
): V => {

    const { input } = validation;

    const validate = (value => {
        switch (input.type) {
            case 'string': return { value };
            case 'boolean': return { value, error: typeof value === 'boolean' };
            case 'integer': return tryCatch(() => ({ value: parseInt(value as string, 10) }));
            case 'double': return tryCatch(() => ({ value: parseFloat(value as string) }));
            case 'email': return { value, error: typeof value !== 'string' || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) };
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
    T extends 'string' | 'email' | 'date' ? string :
    T extends 'boolean' ? boolean :
    T extends 'integer' | 'double' | 'range-integer' | 'range-double' ? number : never;


type Payload<T extends ValidationType> = SelectType<Validation[ 'input' ], T>;
type ExactValidation<T extends ValidationType> = Validation<DomInputValue<T>, ValidationValue<T>>;


type MakeValidationOption<T extends ValidationType> = Partial<Omit<ExactValidation<T>, 'input'> & { input: Omit<Payload<T>, 'type'>; }>;
type MakeValidationReturn<T extends ValidationType> = Omit<ExactValidation<T>, 'input'> & { input: Payload<T>; };

export const makeValidation = <T extends ValidationType>(type: T, validation: MakeValidationOption<T> = {}): MakeValidationReturn<T> => {
    return { ...validation, input: { type, ...validation.input } } as any;
};
