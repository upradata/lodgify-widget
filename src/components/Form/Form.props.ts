// import type { FormProps as LodgifyFormProps /*FormValues , Validation as LodgifyValidation */ } from '@lodgify/ui';
import type { StrictFormProps } from 'semantic-ui-react';
import type { GetValidation, PropsValidationOptions } from './Form.validation';
import type { InputsState, InputState } from './Form.state.type';
import type { Omit, PropsWithStyle } from '../../util.types';


export type FormProps<InputValue = unknown, InputPropsValue extends Record<string, InputValue> = Record<string, InputValue>> = PropsWithStyle<{
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
    validation?: PropsValidationOptions<InputValue, InputPropsValue>;

    onSubmit?: (values: InputPropsValue, inputsState: InputsState<InputPropsValue>) => void;
    onInputChange?: (name: keyof InputPropsValue, value: InputPropsValue[ keyof InputPropsValue ], state: InputState) => void;
    isSubmitDisabled?: (inputsState: InputsState<InputPropsValue>, getValidation: GetValidation<InputValue, InputPropsValue>) => boolean;
    onSubmitEnabled?: (isEnabled: boolean) => void;
    // ref?: React.MutableRefObject<typeof Form>;
}> & Omit<StrictFormProps, 'onSubmit' | 'children'>;
