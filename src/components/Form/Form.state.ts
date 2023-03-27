import { useCallback, useEffect, useMemo, useState } from 'react';
import isEqual from 'fast-deep-equal';
import { getEmptyState, useProcessInputValue } from './Form.helpers';
import { getValidationWithDefaults, makeGetValidation } from './Form.validation';
import { hasProp, map } from '../../util';

import type { FormProps } from './Form.props';
import { InputsState, InputState } from './Form.state.type';


export type UseFormStateProps = Pick<FormProps, 'successMessage' | 'validation' | 'onInputChange'>;

export const useFormState = (props: UseFormStateProps) => {

    const [ state, setState ] = useState<InputsState>(() => {
        return Object.keys(props.validation?.props || {}).reduce((state, name) => ({ ...state, [ name ]: {} }), {} as InputsState);
    });

    const processInputValue = useProcessInputValue();

    const { propsValidation, getValidation } = useMemo(() => {
        const propsValidation = map(props.validation.props, (name, validation) => [
            name,
            getValidationWithDefaults(validation, props.validation.default)
        ]);

        return {
            propsValidation,
            getValidation: makeGetValidation(propsValidation, props.validation.default),
        };
    }, [ props.validation ]);


    const setInputState = useCallback((inputName: string, inputState: InputState) => {
        if (!inputState)
            return;

        setState(state => {
            const inputStateWithData = getInputStateWithData({
                inputName,
                inputState: { ...state[ inputName ], ...inputState },
                previousInputState: state,
                hasNewValue: hasProp(inputState, 'value')
            });

            if (inputStateWithData) {
                const newState = {
                    ...state,
                    [ inputName ]: inputStateWithData
                };

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
                const emptyState = getEmptyState(state, getValidation);
                return { ...state, ...emptyState };
            });

        }
    }, [ props.successMessage ]);


    return { state, setState, setInputState, propsValidation, getValidation };
};
