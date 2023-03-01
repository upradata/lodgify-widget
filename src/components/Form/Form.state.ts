import isEqual from 'fast-deep-equal';
import { useEffect, useState, useCallback } from 'react';
import { FormProps as LodgifyFormProps, FormValue, FormValues } from '@lodgify/ui';
import { getEmptyState } from '@lodgify/ui/lib/es/components/collections/Form/utils/getEmptyState';
import { getErroredState } from '@lodgify/ui/lib/es/components/collections/Form/utils/getErroredState';


export type FormProps<Values = unknown> = Omit<LodgifyFormProps<Values>, 'headingText'> & {
    onInputChange?: (name: string, value: Values) => void;
    searchButton?: React.ReactNode | ((props: { isDisabled: boolean; }) => React.ReactNode);
};


export const useFormState = (props: Pick<FormProps, 'successMessage' | 'validation' | 'onInputChange'>) => {

    const [ state, setState ] = useState<FormValues>({});

    const setInputState = useCallback((inputName: string, inputState: FormValue) => {
        if (!inputState)
            return;

        setState(state => {
            const inputStateWithData = getInputStateWithData(inputName, { ...state[ inputName ], ...inputState }, state);

            if (inputStateWithData) {
                const newState = {
                    ...state,
                    [ inputName ]: inputStateWithData
                };

                props.onInputChange?.(inputName, inputStateWithData.value);
                return newState;
            }

            return state;
        });
    }, [ setState, props.onInputChange ]);


    const getInputStateWithData = (inputName: string, inputState: FormValue, previousState: FormValues) => {
        const previousInputState = previousState?.[ inputName ] || {};

        switch (true) {
            case isEqual(previousInputState, inputState):
                return undefined;

            case !previousInputState.isBlurred && inputState.isBlurred:
            case inputState.isBlurred && previousInputState.value !== inputState.value:
                const errorState = getErroredState(props.validation[ inputName ], inputState) as FormValue;
                return errorState;

            case previousInputState.value !== inputState.value:
                return {
                    ...inputState,
                    error: undefined,
                    isValid: undefined
                };

            default:
                break;
        }
    };

    useEffect(() => {
        if (!!props.successMessage) {
            setState(state => {
                const emptyState = getEmptyState(state);
                return { ...state, ...emptyState };
            });

        }
    }, [ props.successMessage ]);


    return { state, setState, setInputState };
};
