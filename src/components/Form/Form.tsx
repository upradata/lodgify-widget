import React, { useCallback, useImperativeHandle, useMemo } from 'react';
import SemanticForm from 'semantic-ui-react/dist/es/collections/Form/Form.js';
import Message from 'semantic-ui-react/dist/es/collections/Message/Message.js';
// import Card from 'semantic-ui-react/dist/es/views/Card/Card.js';
import { Button, FormValue, Link } from '@lodgify/ui';
import { getEmptyRequiredInputs } from '@lodgify/ui/lib/es/components/collections/Form/utils/getEmptyRequiredInputs';
import { getIsSubmitButtonDisabled } from '@lodgify/ui/lib/es/components/collections/Form/utils/getIsSubmitButtonDisabled';
import { getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';
// import { setInputState } from '@lodgify/ui/lib/es/components/collections/Form/utils/setInputState';
import { SEND } from '@lodgify/ui/lib/es/utils/default-strings';
import { forEach } from '@lodgify/ui/lib/es/utils/for-each';
import { size } from '@lodgify/ui/lib/es/utils/size';
import { FormProps, useFormState } from './Form.state';
import { getFormField, ParentImperativeApi } from './FormField';
import './Form.scss';

export type FormImperativeAPI = {
    setInputState: (inputName: string, inputState: FormValue) => void;
};


const _Form: React.ForwardRefRenderFunction<FormImperativeAPI, FormProps> = (props, ref) => {
    const { state, setInputState } = useFormState(props);

    useImperativeHandle(ref, () => ({ setInputState }), []);

    const handleInputBlur = useCallback((name: string) => {
        setInputState(name, {
            isBlurred: true
        });
    }, []);


    const handleInputChange = useCallback((name: string, value: unknown) => {
        setInputState(name, {
            isBlurred: false,
            value: value
        });

        props.onInputChange?.(name, value);
    }, []);


    const handleSubmit = useCallback(() => {
        const emptyRequiredInputs = getEmptyRequiredInputs(props.validation, state);

        size(emptyRequiredInputs) ? forEach(emptyRequiredInputs, (validation, name) => {
            const _getValidationWithDef = getValidationWithDefaults(validation),
                isRequiredMessage = _getValidationWithDef.isRequiredMessage;

            setInputState(name, { error: isRequiredMessage, isBlurred: true });
        }) : props.onSubmit(state);
    }, [ state ]);


    const imperativeInterfaceForChildren: ParentImperativeApi = useMemo(() => ({
        handleInputChange,
        handleInputBlur,
        setInputState,
        state,
        validation: props.validation
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


_Form.displayName = 'Form';
export const Form = React.forwardRef(_Form);


Form.defaultProps = {
    autoComplete: null,
    errorMessage: '',
    onSubmit: () => { },
    actionLink: null,
    submitButtonText: SEND,
    successMessage: '',
    validation: {}
};
