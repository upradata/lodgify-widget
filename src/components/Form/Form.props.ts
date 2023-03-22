import { PropsValidationOptions } from './Form.validation';

// import type { FormProps as LodgifyFormProps /*FormValues , Validation as LodgifyValidation */ } from '@lodgify/ui';
import type { StrictFormProps } from 'semantic-ui-react';
import type { Omit, PropsWithStyle } from '../../util.types';


// export type Validation<Values> = LodgifyValidation & { transform: (value: string) => Values; }
export type InputState<V = unknown> = {
    isBlurred?: boolean;
    value?: string | boolean;
    transformedValue?: V;
    isValid?: boolean;
    error?: boolean | string;
};

export type InputsState<I extends Record<string, unknown> = Record<string, unknown>> = { [ K in keyof I ]: InputState<I[ K ]> };


export type FormProps<InputValues extends Record<string, unknown> = Record<string, unknown>> = PropsWithStyle<{
    actionLink?: {
        onClick?: Function;
        text: React.ReactNode;
    };
    autoComplete?: 'on' | 'off';
    children: boolean | React.ReactChild | React.ReactNodeArray | null | undefined, // | React.ReactPortal; //  Exclude<React.ReactNode, React.ReactFragment>;
    errorMessage?: string;
    // headingText?: string;
    searchButton?: React.ReactElement; // | ((props: { isDisabled: boolean; }) => React.ReactNode);
    submitButtonText?: string;
    successMessage?: string;
    validation?: PropsValidationOptions<InputValues>;

    onSubmit?: (values: InputValues, inputsState: InputsState<InputValues>) => void;
    onInputChange?: (name: keyof InputValues, value: InputValues[ keyof InputValues ]) => void;
    isSubmitDisabled?: (inputsState: InputsState<InputValues>) => boolean;
    // ref?: React.MutableRefObject<typeof Form>;
}> & Omit<StrictFormProps, 'onSubmit' | 'children'>;
