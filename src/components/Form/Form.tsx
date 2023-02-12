import isEqual from 'fast-deep-equal';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SemanticForm from 'semantic-ui-react/dist/es/collections/Form/Form.js';
import Message from 'semantic-ui-react/dist/es/collections/Message/Message.js';
// import Card from 'semantic-ui-react/dist/es/views/Card/Card.js';
import { Button, FormProps, FormState, Heading, Link } from '@lodgify/ui';
import { getEmptyRequiredInputs } from '@lodgify/ui/lib/es/components/collections/Form/utils/getEmptyRequiredInputs';
import { getEmptyState } from '@lodgify/ui/lib/es/components/collections/Form/utils/getEmptyState';
import { getErroredState } from '@lodgify/ui/lib/es/components/collections/Form/utils/getErroredState';
// import { getFormChild } from '@lodgify/ui/lib/es/components/collections/Form/utils/getFormChild';
// import { getFormInputsState } from '@lodgify/ui/lib/es/components/collections/Form/utils/getFormInputsState';
import { getIsSubmitButtonDisabled } from '@lodgify/ui/lib/es/components/collections/Form/utils/getIsSubmitButtonDisabled';
import { getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';
// import { setInputState } from '@lodgify/ui/lib/es/components/collections/Form/utils/setInputState';
import { SEND } from '@lodgify/ui/lib/es/utils/default-strings';
import { forEach } from '@lodgify/ui/lib/es/utils/for-each';
import { size } from '@lodgify/ui/lib/es/utils/size';
import './Form.scss';
// import { usePrevious } from '../../util';
import { getFormField, ParentImperativeApi } from './FormField';


const useFormState = (props: FormProps) => {

    const [ state, setState ] = useState<FormState>({});

    // const previousState = usePrevious(state);
    // const previousProps = usePrevious(props);

    /* const updateSetState = (prevState: FormState, inputName: string, inputState: FormState[ string ]) => ({
        ...prevState,
        [ inputName ]: {
            ...prevState[ inputName ],
            ...inputState
        }
    }); */

    const setInputState = (inputName: string, inputState: FormState[ string ]) => {
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

    const getInputStateWithData = (inputName: string, inputState: FormState[ string ], previousState: FormState) => {
        const previousInputState = previousState?.[ inputName ] || {};

        switch (true) {
            case isEqual(previousInputState, inputState):
                return undefined;

            case !previousInputState.isBlurred && inputState.isBlurred:
            case inputState.isBlurred && previousInputState.value !== inputState.value:
                const errorState = getErroredState(props.validation[ inputName ], inputState) as FormState[ string ];
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


export const Form: React.FunctionComponent<Omit<FormProps, 'headingText'>> = props => {
    const { state, setInputState } = useFormState(props);

    // useEffect(() => {
    //     const initValues: Partial<Record<keyof Validation, unknown>> = {
    //         guests: guests.value,
    //         room: location.value,
    //         dateRange: dates
    //     };

    //     const formInstance = ref.current;

    //     Object.entries(initValues).forEach(([ inputName, value ]) => {
    //         const inputValidation = getValidationWithDefaults(validation[ inputName ]) as FormProps[ 'validation' ][ string ];

    //         if (!inputValidation.getIsEmpty(value)) {
    //             if (inputValidation.getIsValid(value))
    //                 formInstance.setState({ [ inputName ]: { value } });
    //             else
    //                 formInstance.setState({ [ inputName ]: { error: inputValidation.invalidMessage } });
    //         }
    //     });

    //     // const oldHandleInputChange = (formInstance as any).handleInputChange;
    //     // (formInstance as any).handleInputChange = debounce((formInstance as any).handleInputChange, 300);
    // }, []);


    const handleInputBlur = useCallback((name: string) => {
        return setInputState(name, {
            isBlurred: true
        });
    }, []);


    const handleInputChange = useCallback((name: string, value: unknown) => {
        return setInputState(name, {
            isBlurred: false,
            value: value
        });
    }, []);


    const handleSubmit = useCallback(() => {
        const emptyRequiredInputs = getEmptyRequiredInputs(props.validation, state);

        size(emptyRequiredInputs) ? forEach(emptyRequiredInputs, (validation, name) => {
            const _getValidationWithDef = getValidationWithDefaults(validation),
                isRequiredMessage = _getValidationWithDef.isRequiredMessage;

            setInputState(name, { error: isRequiredMessage });
        }) : props.onSubmit(state);
    }, []);


    const imperativeInterfaceForChildren: ParentImperativeApi = useMemo(() => ({
        handleInputChange,
        handleInputBlur,
        state
    }), [ handleInputChange, handleInputBlur, state ]);


    const { autoComplete, errorMessage, successMessage, actionLink } = props;

    return (
        <SemanticForm autoComplete={autoComplete} error={!!errorMessage} success={!!successMessage} onSubmit={handleSubmit} className="Form">
            {React.Children.map(props.children as FormProps[ 'children' ], child => getFormField(child, imperativeInterfaceForChildren))}
            {/* {props.children} */}

            {successMessage && <Message content={successMessage} success />}
            {errorMessage && <Message content={errorMessage} error />}
            {actionLink && <Link onClick={actionLink.onClick}>{actionLink.text}</Link>}

            <Button isDisabled={getIsSubmitButtonDisabled(state)} isFormSubmit isPositionedRight isRounded>
                {props.submitButtonText || SEND}
            </Button>
        </SemanticForm>
    );
};


Form.displayName = 'Form';

Form.defaultProps = {
    autoComplete: null,
    errorMessage: '',
    onSubmit: () => { },
    actionLink: null,
    submitButtonText: SEND,
    successMessage: '',
    validation: {}
};

/* const Field = React.memo(SemanticForm.Field);

const FormField: React.FunctionComponent<{ name: string; } & FormState[ string ] & {
    handleInputChange: (name: string, value: unknown) => void;
    handleInputBlur: (name: string) => void;
    state: FormState;
    setState: React.Dispatch<React.SetStateAction<FormState>>;
}> = props => {
    useMemo(() => ({
        onBlur: () => props.handleInputBlur(props.name),
        onChange: (name: string, value: unknown) => {
            props.handleInputChange(name, value);
            props.onChange?.(name, value);
        },
        ...props.state
    }), [ props ]);

    return <Field>{props.children}</Field>;
};
 */
