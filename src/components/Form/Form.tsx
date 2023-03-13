import './Form.scss';

import React, { memo, useCallback, useImperativeHandle, useMemo } from 'react';
import { getEmptyRequiredInputs as _getEmptyRequiredInputs } from '@lodgify/ui/lib/es/components/collections/Form/utils/getEmptyRequiredInputs';
// import { getIsSubmitButtonDisabled as _getIsSubmitButtonDisabled } from '@lodgify/ui/lib/es/components/collections/Form/utils/getIsSubmitButtonDisabled';
import { getValidationWithDefaults as _getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';
// import Card from 'semantic-ui-react/dist/es/views/Card/Card.js';
import { Button, FormValue, FormValues, Link, Validation } from '@lodgify/ui';
import { forEach } from '@lodgify/ui/lib/es/utils/for-each';
// import { setInputState } from '@lodgify/ui/lib/es/components/collections/Form/utils/setInputState';
import { SEND } from '@lodgify/ui/lib/es/utils/default-strings';
import { size } from '@lodgify/ui/lib/es/utils/size';
import classnames from 'classnames';
import { Form as SemanticForm, Message } from 'semantic-ui-react';
import { FormField, ParentImperativeApi } from './FormField';
import { useFormState } from './Form.state';

import type { FormProps } from './Form.props';


type GetEmptyRequiredInputs = (validation: FormProps[ 'validation' ], state: FormValues) => Record<string, boolean>;
const getEmptyRequiredInputs = _getEmptyRequiredInputs as GetEmptyRequiredInputs;

const getIsSubmitButtonDisabled = (inputsState: FormValues) => {
    return Object.values<FormValue>(inputsState).some(({ error }) => !!error);
};
// _getIsSubmitButtonDisabled as (state: FormValues) => boolean;

const getValidationWithDefaults = _getValidationWithDefaults as (validation: Partial<Validation>) => Validation;


export type FormImperativeAPI = {
    setInputState: (inputName: string, inputState: FormValue) => void;
};


const _Form: React.ForwardRefRenderFunction<FormImperativeAPI, FormProps> = ({ className, searchButton, submitButtonText, isSubmitDisabled, ...props }, ref) => {
    const { state, setInputState } = useFormState(props);

    useImperativeHandle(ref, () => ({ setInputState }), [ setInputState ]);

    const handleInputBlur = useCallback((name: string) => {
        setInputState(name, {
            isBlurred: true
        });
    }, [ setInputState ]);


    const handleInputChange = useCallback((name: string, value: unknown) => {
        setInputState(name, {
            isBlurred: false,
            value: value
        });

    }, [ setInputState ]);


    const handleSubmit = useCallback(() => {
        const emptyRequiredInputs = getEmptyRequiredInputs(props.validation, state);

        if (size(emptyRequiredInputs)) {
            forEach(emptyRequiredInputs, (validation: Partial<Validation>, name: string) => {
                const { isRequiredMessage } = getValidationWithDefaults(validation);
                setInputState(name, { error: isRequiredMessage, isBlurred: true });
            });
        } else {
            props.onSubmit(state);
        }
    }, [ state, setInputState, props.onSubmit ]);


    const imperativeInterfaceForChildren: ParentImperativeApi = useMemo(() => ({
        handleInputChange,
        handleInputBlur,
        setInputState,
        state,
        validation: props.validation
    }), [ handleInputChange, handleInputBlur, state, props.validation, setInputState ]);


    const { autoComplete, errorMessage, successMessage, actionLink } = props;

    return (
        <SemanticForm autoComplete={autoComplete} error={!!errorMessage} success={!!successMessage} onSubmit={handleSubmit} className={classnames('Form', className)}>
            {React.Children.map(props.children as FormProps[ 'children' ], child => <FormField {...imperativeInterfaceForChildren}>{child}</FormField>)}

            {successMessage && <Message content={successMessage} success />}
            {errorMessage && <Message content={errorMessage} error />}
            {actionLink && <Link onClick={actionLink.onClick}>{actionLink.text}</Link>}

            <FormButton searchButton={searchButton} submitButtonText={submitButtonText} isDisabled={isSubmitDisabled(state)} />
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
    isSubmitDisabled: getIsSubmitButtonDisabled
};
