import isEqual from 'fast-deep-equal';
import { useEffect, useState } from 'react';
import { FormProps as LodgifyFormProps, FormValue, FormValues } from '@lodgify/ui';
import { getEmptyState } from '@lodgify/ui/lib/es/components/collections/Form/utils/getEmptyState';
import { getErroredState } from '@lodgify/ui/lib/es/components/collections/Form/utils/getErroredState';


export type FormProps = Omit<LodgifyFormProps, 'headingText'> & {
    onInputChange?: (name: string, value: unknown) => {};
};


export const useFormState = (props: Pick<FormProps, 'successMessage' | 'validation'>) => {

    const [ state, setState ] = useState<FormValues>({});

    // const previousState = usePrevious(state);
    // const previousProps = usePrevious(props);

    /* const updateSetState = (prevState: FormState, inputName: string, inputState: FormState[ string ]) => ({
        ...prevState,
        [ inputName ]: {
            ...prevState[ inputName ],
            ...inputState
        }
    }); */

    const setInputState = (inputName: string, inputState: FormValue) => {
        if (!inputState)
            return;

        // const pState = previousState || {};

        setState(state => {
            const inputStateWithData = getInputStateWithData(inputName, { ...state[ inputName ], ...inputState }, state);

            return inputStateWithData ? {
                ...state,
                [ inputName ]: inputStateWithData
            } : state;
        });
        //  if (prevState)
        //  updateSetState(previousState || {}, inputName, inputState);

        // return setState(prevState => updateSetState(prevState, inputName, inputState));
    };

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


    /* useEffect(() => {
        Object.entries(state).forEach(([ inputName, inputState ]) => {
            setInputState(inputName, getInputState(inputName, inputState));
        });
    }, [ state ]); */

    return { state, setState, setInputState };
};
