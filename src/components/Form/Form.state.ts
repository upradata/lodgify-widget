import { useCallback, useEffect, useMemo, useState } from 'react';
// import { getEmptyState } from '@lodgify/ui/lib/es/components/collections/Form/utils/getEmptyState';
// import { getErroredState } from '@lodgify/ui/lib/es/components/collections/Form/utils/getErroredState';
import isEqual from 'fast-deep-equal';
import { getEmptyState, useProcessInputValue } from './Form.helpers';
import { getValidationWithDefaults, makeGetValidation } from './Form.validation';
import { map } from '../../util';

// import type { FormValue, FormValues } from '@lodgify/ui';
import type { FormProps } from './Form.props';
import { InputsState, InputState } from './Form.state.type';


export type UseFormStateProps = Pick<FormProps, 'successMessage' | 'validation' | 'onInputChange'>;

export const useFormState = (props: UseFormStateProps) => {

    const [ state, setState ] = useState<InputsState>({});
    const processInputValue = useProcessInputValue();

    const getValidation = useMemo(() => {
        const propsValidation = map(props.validation.props, (name, validation) => [
            name,
            getValidationWithDefaults(validation, props.validation.default)
        ]);

        return makeGetValidation(propsValidation, props.validation.default);
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
            const inputStateWithData = getInputStateWithData({
                inputName,
                inputState: { ...state[ inputName ], ...inputState },
                previousInputState: state,
                hasNewValue: 'value' in inputState
            });

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


    const getInputStateWithData = useCallback((options: {
        inputName: string;
        inputState: InputState;
        previousInputState: InputState;
        hasNewValue: boolean;
    }) => {
        const { inputName, inputState, previousInputState, hasNewValue } = options;
        const previousState = previousInputState?.[ inputName ] || {};

        if (isEqual(previousState, inputState))
            return undefined;

        const processedInputValue = processInputValue({
            hasNewValue,
            validation: getValidation(inputName),
            inputValue: inputState,
            state
        });

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
                const emptyState = getEmptyState(getValidation, state);
                return { ...state, ...emptyState };
            });

        }
    }, [ props.successMessage ]);


    return { state, setState, setInputState, getValidation };
};
