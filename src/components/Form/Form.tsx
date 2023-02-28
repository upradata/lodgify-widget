import React, { useCallback, useImperativeHandle, useMemo } from 'react';
import SemanticForm from 'semantic-ui-react/dist/es/collections/Form/Form.js';
import Message from 'semantic-ui-react/dist/es/collections/Message/Message.js';
// import Card from 'semantic-ui-react/dist/es/views/Card/Card.js';
import { Button, FormValue, FormValues, Link, Validation } from '@lodgify/ui';
import { getEmptyRequiredInputs as _getEmptyRequiredInputs } from '@lodgify/ui/lib/es/components/collections/Form/utils/getEmptyRequiredInputs';
import { getIsSubmitButtonDisabled as _getIsSubmitButtonDisabled } from '@lodgify/ui/lib/es/components/collections/Form/utils/getIsSubmitButtonDisabled';
import { getValidationWithDefaults as _getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';
// import { setInputState } from '@lodgify/ui/lib/es/components/collections/Form/utils/setInputState';
import { SEND } from '@lodgify/ui/lib/es/utils/default-strings';
import { forEach } from '@lodgify/ui/lib/es/utils/for-each';
import { size } from '@lodgify/ui/lib/es/utils/size';
import { FormProps, useFormState } from './Form.state';
import { /* getFormField */FormField, ParentImperativeApi } from './FormField';
import './Form.scss';
import classnames from 'classnames';


export type { FormProps } from './Form.state';

type GetEmptyRequiredInputs = (validation: FormProps[ 'validation' ], state: FormValues) => Record<string, boolean>;
const getEmptyRequiredInputs = _getEmptyRequiredInputs as GetEmptyRequiredInputs;

const getIsSubmitButtonDisabled = _getIsSubmitButtonDisabled as (state: FormValues) => boolean;

const getValidationWithDefaults = _getValidationWithDefaults as (validation: Partial<Validation>) => Validation;


export type FormImperativeAPI = {
    setInputState: (inputName: string, inputState: FormValue) => void;
};


const _Form: React.ForwardRefRenderFunction<FormImperativeAPI, FormProps> = ({ className, searchButton, ...props }, ref) => {
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

        props.onInputChange?.(name, value);
    }, [ setInputState, props.onInputChange ]);


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

    const getButton = () => {
        if (!searchButton) {
            return (
                <Button isDisabled={getIsSubmitButtonDisabled(state)} isFormSubmit isPositionedRight isRounded>
                    {props.submitButtonText || SEND}
                </Button>
            );
        }

        if (typeof searchButton === 'function')
            return searchButton({ isDisabled: getIsSubmitButtonDisabled(state) });

        return searchButton;
    };

    return (
        <SemanticForm autoComplete={autoComplete} error={!!errorMessage} success={!!successMessage} onSubmit={handleSubmit} className={classnames('Form', className)}>
            {React.Children.map(props.children as FormProps[ 'children' ], child => <FormField {...imperativeInterfaceForChildren}>{child}</FormField>
                /* getFormField(child, imperativeInterfaceForChildren) */
            )}
            {/* {props.children} */}

            {successMessage && <Message content={successMessage} success />}
            {errorMessage && <Message content={errorMessage} error />}
            {actionLink && <Link onClick={actionLink.onClick}>{actionLink.text}</Link>}

            {getButton()}
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
