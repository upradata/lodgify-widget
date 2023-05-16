import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import isEqual from 'fast-deep-equal';
import { getEmptyState, useProcessInputValue } from './Form.helpers';
import { getValidationWithDefaults, makeGetValidation } from './Form.validation';
import { hasProp, map, useActionsAfterRender } from '@root/util';

import type { FormProps } from './Form.props';
import { InputsState, InputState, InputStateAction, SetInputState } from './Form.state.type';


export type UseFormStateProps = Pick<FormProps, 'successMessage' | 'validation' | 'onInputChange' | 'isSubmitDisabled' | 'onSubmitEnabled'>;

export const useFormState = (props: UseFormStateProps) => {

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


    const [ state, setState ] = useState<InputsState>(() => {
        const inputsState = Object.keys(props.validation?.props || {}).reduce((state, name) => ({ ...state, [ name ]: {} }), {} as InputsState);
        return getEmptyState(inputsState, getValidation);
    });

    const scheduleActionsAfterRender = useActionsAfterRender();

    const [ isDisabled, setIsDisabled ] = useState(props.isSubmitDisabled(state, getValidation));

    const setInputState: SetInputState = useCallback((inputName, inputState) => {
        if (!inputState)
            return;

        setState(state => {
            const inputStateWithData = getInputStateWithData({
                inputName,
                inputState: { ...state[ inputName ], ...inputState },
                previousInputsState: state,
                hasNewValue: hasProp(inputState, 'value')
            });

            if (inputStateWithData) {
                const newState = {
                    ...state,
                    [ inputName ]: inputStateWithData
                };

                if (inputState.type === 'update')
                    scheduleActionsAfterRender.add(() => props.onInputChange?.(inputName, inputStateWithData.transformedValue, inputStateWithData));

                const isNowDisabled = props.isSubmitDisabled(newState, getValidation);

                if (isNowDisabled !== isDisabled) {
                    setIsDisabled(isNowDisabled);
                    scheduleActionsAfterRender.add(() => props.onSubmitEnabled?.(!isNowDisabled));
                }

                return newState;
            }

            return state;
        });
    }, [ props.onInputChange ]);


    const getInputStateWithData = useCallback((options: {
        inputName: string;
        inputState: InputStateAction;
        previousInputsState: InputState;
        hasNewValue: boolean;
    }) => {
        const { inputName, previousInputsState, hasNewValue } = options;
        const { type, ...inputState } = options.inputState;

        const previousState: InputState = previousInputsState?.[ inputName ] || {};

        if (type !== 'init' && isEqual(previousState, inputState))
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

            case !hasProp(previousState, 'value') || previousState.value !== processedInputValue.value:
                return processedInputValue;

            case processedInputValue.error && processedInputValue.isEmpty:
                return processedInputValue;

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


    return { state, setState, setInputState, propsValidation, getValidation, isDisabled };
};
