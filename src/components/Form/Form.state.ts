import { useCallback, useEffect, useState } from 'react';
import { getEmptyState } from '@lodgify/ui/lib/es/components/collections/Form/utils/getEmptyState';
import { getErroredState } from '@lodgify/ui/lib/es/components/collections/Form/utils/getErroredState';
import isEqual from 'fast-deep-equal';

import type { FormValue, FormValues } from '@lodgify/ui';
import type { FormProps } from './Form.props';


export type UseFormStateProps = Pick<FormProps, 'successMessage' | 'validation' | 'onInputChange'>;

export const useFormState = (props: UseFormStateProps) => {

    const [ state, setState ] = useState<FormValues>({});
   // const [ stateNameChanged, setStateNameChanged ] = useState<{ name: string | null; }>({ name: null });

    /* useEffect(() => {
        const { name } = stateNameChanged;

        if (name)
            props.onInputChange?.(name, (state[ name ] as FormValue).value);
    }, [ stateNameChanged, props.onInputChange ]); */


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

                // setStateNameChanged({ name: inputName });
                props.onInputChange?.(inputName, inputStateWithData.value);
                return newState;
            }

            return state;
        });
    }, [ props.onInputChange ]);


    const getInputStateWithData = useCallback((inputName: string, inputState: FormValue, previousState: FormValues) => {
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
                return null;
        }
    }, []);

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
