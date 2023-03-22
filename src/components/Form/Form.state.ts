import { useCallback, useEffect, useState, useMemo } from 'react';
// import { getEmptyState } from '@lodgify/ui/lib/es/components/collections/Form/utils/getEmptyState';
// import { getErroredState } from '@lodgify/ui/lib/es/components/collections/Form/utils/getErroredState';
import isEqual from 'fast-deep-equal';

// import type { FormValue, FormValues } from '@lodgify/ui';
import type { FormProps, InputsState, InputState } from './Form.props';
import { getEmptyState, processInputValue } from './Form.helpers';
import { getValidationWithDefaults } from './Form.validation';
import { map } from '../../util';


export type UseFormStateProps = Pick<FormProps, 'successMessage' | 'validation' | 'onInputChange'>;

export const useFormState = (props: UseFormStateProps) => {

    const [ state, setState ] = useState<InputsState>({});

    const propsValidation = useMemo(() => {
        return map(props.validation.props, (name, validation) => [ name, getValidationWithDefaults(validation, props.validation.default) ]);
    }, [ props.validation ]);


    // const [ stateNameChanged, setStateNameChanged ] = useState<{ name: string | null; }>({ name: null });

    /* useEffect(() => {
        const { name } = stateNameChanged;

        if (name)
            props.onInputChange?.(name, (state[ name ] as FormValue).value);
    }, [ stateNameChanged, props.onInputChange ]); */


    const setInputState = useCallback((inputName: string, inputState: InputState) => {
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
                props.onInputChange?.(inputName, inputStateWithData.transformedValue);
                return newState;
            }

            return state;
        });
    }, [ props.onInputChange ]);


    const getInputStateWithData = useCallback((inputName: string, inputState: InputState, previousInputState: InputState) => {
        const previousState = previousInputState?.[ inputName ] || {};

        if (isEqual(previousState, inputState))
            return undefined;

        const processedInputValue = processInputValue(propsValidation[ inputName ], inputState);

        switch (true) {

            case !previousState.isBlurred && inputState.isBlurred:
            case inputState.isBlurred && previousState.value !== inputState.value:
                return processedInputValue;

            case previousState.value !== processedInputValue.value:
                return processedInputValue;
            /*  return {
                 ...validatedInputValue,
                 error: undefined,
                 isValid: undefined
             }; */

            default:
                return null;
        }
    }, []);

    useEffect(() => {
        if (!!props.successMessage) {
            setState(state => {
                const emptyState = getEmptyState(propsValidation, state);
                return { ...state, ...emptyState };
            });

        }
    }, [ props.successMessage ]);


    return { state, setState, setInputState, propsValidation };
};
