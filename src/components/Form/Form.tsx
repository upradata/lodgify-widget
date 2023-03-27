import './Form.scss';

import React, { memo, useCallback, useImperativeHandle, useMemo } from 'react';
import { Button, FormValue, Link } from '@lodgify/ui';
// import { setInputState } from '@lodgify/ui/lib/es/components/collections/Form/utils/setInputState';
import { SEND } from '@lodgify/ui/lib/es/utils/default-strings';
import classnames from 'classnames';
import { Form as SemanticForm, Message } from 'semantic-ui-react';
import { FormField, FormFieldProps, ParentImperativeApi } from './FormField';
import { getEmptyRequiredInputs, isSubmitButtonDisabled } from './Form.helpers';
import { useFormState } from './Form.state';

import type { FormProps } from './Form.props';


export type FormImperativeAPI = {
    setInputState: (inputName: string, inputState: FormValue) => void;
};


const _Form: React.ForwardRefRenderFunction<FormImperativeAPI, FormProps> = ({ className, searchButton, submitButtonText, isSubmitDisabled, ...props }, ref) => {
    const { state, setInputState, getValidation, propsValidation } = useFormState(props);

    useImperativeHandle(ref, () => ({ setInputState }), [ setInputState ]);

    const handleInputBlur = useCallback((name: string) => {
        setInputState(name, {
            isBlurred: true
        });
    }, []);


    const handleInputChange = useCallback((name: string, value: string) => {
        setInputState(name, {
            isBlurred: false,
            value
        });

    }, []);


    const handleSubmit = useCallback(() => {
        const emptyRequiredInputs = getEmptyRequiredInputs(state, getValidation);

        if (emptyRequiredInputs.length > 0) {
            emptyRequiredInputs.forEach(inputName => {
                setInputState(inputName, { error: getValidation(inputName).isRequiredMessage, isBlurred: true });
            });
        } else {
            const values = Object.entries(state).reduce((o, [ k, v ]) => ({ ...o, [ k ]: v.value }), {} as Record<string, unknown>);
            props.onSubmit(values, state);
        }
    }, [ state, props.onSubmit, getValidation ]);


    const imperativeInterfaceForChildren: ParentImperativeApi = useMemo(() => ({
        handleInputChange,
        handleInputBlur,
        setInputState,
        inputsState: state,
        getValidation
    }), [ handleInputChange, handleInputBlur, state, getValidation, setInputState ]);


    const { autoComplete, errorMessage, successMessage, actionLink } = props;

    return (
        <SemanticForm autoComplete={autoComplete} error={!!errorMessage} success={!!successMessage} onSubmit={handleSubmit} className={classnames('Form', className)}>
            {React.Children.map(props.children, (child: FormFieldProps[ 'children' ]) => <FormField {...imperativeInterfaceForChildren}>{child}</FormField>)}

            {successMessage && <Message content={successMessage} success />}
            {errorMessage && <Message content={errorMessage} error />}
            {actionLink && <Link onClick={actionLink.onClick}>{actionLink.text}</Link>}

            <FormButton searchButton={searchButton} submitButtonText={submitButtonText} isDisabled={isSubmitDisabled({ ...state }, getValidation)} />
        </SemanticForm>
    );
};


const _FormButton: React.FunctionComponent<Pick<FormProps, 'searchButton' | 'submitButtonText'> & { isDisabled?: boolean; }> = ({
    searchButton, submitButtonText, isDisabled
}) => {
    if (!searchButton) {
        return (
            <Button isDisabled={isDisabled} isFormSubmit isPositionedRight isRounded>
                {submitButtonText || SEND}
            </Button>
        );
    }

    /* It is bad, but I cannot for now use a render function searchButton({ isDisabled }) */

    return (
        <React.Fragment>
            {React.cloneElement(searchButton, { isDisabled })}
            {/* {typeof searchButton === 'function' ? searchButton({ isDisabled }) : searchButton} */}
        </React.Fragment>
    );
};

_FormButton.displayName = 'FormButton';
const FormButton = memo(_FormButton);




_Form.displayName = 'Form';
export const Form = React.forwardRef(_Form);


Form.defaultProps = {
    autoComplete: null,
    errorMessage: '',
    onSubmit: () => { },
    actionLink: null,
    submitButtonText: SEND,
    successMessage: '',
    validation: {},
    isSubmitDisabled: isSubmitButtonDisabled
};
