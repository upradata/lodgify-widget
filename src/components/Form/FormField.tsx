import React, { useCallback, useEffect, useMemo } from 'react';
import SemanticForm from 'semantic-ui-react/dist/es/collections/Form/Form.js';
import { FormValue, FormValues, InputControllerProps, InputGroup, InputProps } from '@lodgify/ui';
import { getInputWidth } from '@lodgify/ui/lib/es/components/collections/Form/utils/getInputWidth';
import { getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';
import { FormProps } from './Form.state';


export const InputField = React.memo(SemanticForm.Field);


export type ParentImperativeApi = {
    handleInputChange: (name: string, value: unknown) => void;
    handleInputBlur: (name: string) => void;
    setInputState: (inputName: string, inputState: FormValue) => void;
    state: FormValues;
    validation: FormProps[ 'validation' ];
};


export const FormField: React.FunctionComponent<ParentImperativeApi & { children: React.ReactChild | boolean; }> = ({ children, ...props }) => {
    if (!children)
        return children as null;

    if (!React.Children.only(children))
        throw new Error(`FormField accetps only one child and ${React.Children.count(children)} has been specified.`);


    if (typeof children === 'string' || typeof children === 'number' || typeof children === 'boolean') {
        return <InputField>{children}</InputField>;
    }

    if (children.type === InputGroup) {
        return React.cloneElement(children, {
            children: React.Children.map(children.props.children, nestedChild => <FormField {...props}>{nestedChild}</FormField>),
            widths: 'equal'
        });
    }

    const { state, ...parent } = props;

    return (
        <_InputField inputState={state[ children.props.name ]} parent={parent} isInputField={children.type === InputField}>
            {children}
        </_InputField>
    );
};

type InputFieldChild = Exclude<React.ReactElement<InputControllerProps & { onBlur?: InputProps[ 'onBlur' ]; }>, string>;


export const _InputField: React.FunctionComponent<{
    // input: InputElement;
    children: InputFieldChild;
    inputState: FormValues;
    isInputField: boolean;
    parent: Omit<ParentImperativeApi, 'state'>;
}> = ({ /* input */children: input, inputState, isInputField, parent }) => {

    const { name } = input.props;

    useEffect(() => {
        const { value } = input.props;

        if (!value)
            return;

        const inputValidation = getValidationWithDefaults(parent.validation[ name ]) as FormProps[ 'validation' ][ string ];

        if (!inputValidation.getIsEmpty(value)) {
            if (inputValidation.getIsValid(value))
                parent.setInputState(name, { value, isValid: true });
            else
                parent.setInputState(name, { value, error: inputValidation.invalidMessage });
        }
    }, [ parent.validation, parent.setInputState, input.props, name ]);


    const onBlur = useCallback(() => parent.handleInputBlur(name), [ parent.handleInputBlur ]);

    const onChange = useCallback((name: string, value: unknown) => {
        parent.handleInputChange(name, value);
        input.props.onChange?.(name, value);
    }, [ parent.handleInputChange, input.props.onChange ]);


    const element = useMemo(() => {
        return isInputField && React.cloneElement(
            input,
            { width: getInputWidth(input), ...input.props },
            React.Children.map(input, child => {
                if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean')
                    return child;

                const c = child as React.ReactElement;

                return React.cloneElement(c, {
                    ...c.props,
                    onBlur,
                    onChange,
                    ...inputState
                });
            }));
    }, [ input, onChange, onBlur, inputState ]);


    const children = useMemo(() => !isInputField && React.cloneElement(input, {
        /* onBlur: () => parent.handleInputBlur(name),
        onChange: (name: string, value: unknown) => {
            parent.handleInputChange(name, value);
            input.props.onChange?.(name, value);
        }, */
        onBlur,
        onChange,
        ...inputState
    }), [ input, onChange, onBlur, inputState ]);


    if (element)
        return element;

    return <InputField width={getInputWidth(input)}>{children}</InputField>;
};
