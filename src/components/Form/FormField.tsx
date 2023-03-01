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

const isPrimitiveElement = (element: React.ReactElement | string | number | boolean): string | number | boolean => {
    return typeof element === 'string' || typeof element === 'number' || typeof element === 'boolean';
};

// const isObjectElement = (element: React.ReactElement | string | number | boolean): React.ReactElement => !isPrimitiveElement(element);

export const FormField: React.FunctionComponent<ParentImperativeApi & { children: React.ReactChild | boolean; }> = ({ children, ...props }) => {
    if (!children)
        return children as null;

    if (!React.Children.only(children))
        throw new Error(`FormField accetps only one child and ${React.Children.count(children)} has been specified.`);


    if (isPrimitiveElement(children)) {
        return <InputField>{children}</InputField>;
    }

    const _children = children as React.ReactElement; // for typing

    if (_children.type === InputGroup) {
        return React.cloneElement(_children, {
            children: React.Children.map(_children.props.children, c => <FormField {...props}>{c}</FormField>),
            widths: 'equal'
        });
    }

    const { state, ...parent } = props;

    return (
        <_InputField inputState={state[ _children.props.name ]} parent={parent} isInputField={_children.type === InputField}>
            {_children}
        </_InputField>
    );
};

type InputFieldChild = Exclude<React.ReactElement<InputControllerProps & { onBlur?: InputProps[ 'onBlur' ]; }>, string>;

const reactChildComponent = (element: React.ReactElement) => {
    if (!React.Children.only(element))
        throw new Error(`React element does not have only one child`);

    return React.Children.toArray(element.props.children)[ 0 ] as React.ReactElement;
};

export const _InputField: React.FunctionComponent<{
    // input: InputElement;
    children: InputFieldChild;
    inputState: FormValues;
    isInputField: boolean;
    parent: Omit<ParentImperativeApi, 'state'>;
}> = ({ /* input */children: inputOrField, inputState, isInputField, parent }) => {

    const { name } = isInputField ? reactChildComponent(inputOrField)?.props || {} : inputOrField.props;

    useEffect(() => {
        const { value } = inputOrField.props;

        if (!value)
            return;

        const inputValidation = getValidationWithDefaults(parent.validation[ name ]) as FormProps[ 'validation' ][ string ];

        if (!inputValidation.getIsEmpty(value)) {
            if (inputValidation.getIsValid(value))
                parent.setInputState(name, { value, isValid: true });
            else
                parent.setInputState(name, { value, error: inputValidation.invalidMessage });
        }
    }, [ /* parent.validation, parent.setInputState, inputOrField.props, name */ ]);


    const onBlur = useCallback(() => parent.handleInputBlur(name), [ name, parent.handleInputBlur ]);

    const onChange = useCallback((_name: string, value: unknown) => {
        parent.handleInputChange(name, value);
        inputOrField.props.onChange?.(name, value);
    }, [ name, parent.handleInputChange, inputOrField.props.onChange ]);


    const element = useMemo(() => {
        const input = isInputField ? reactChildComponent(inputOrField) : null;

        return isInputField && React.cloneElement(
            inputOrField,
            { width: getInputWidth(input), ...inputOrField.props },
            isPrimitiveElement(input) ? input : React.cloneElement(input, {
                ...input.props,
                onBlur,
                onChange,
                ...inputState
            }));
    }, [ isInputField, inputOrField, onChange, onBlur, inputState ]);


    const children = useMemo(() => !isInputField && React.cloneElement(inputOrField, {
        /* onBlur: () => parent.handleInputBlur(name),
        onChange: (name: string, value: unknown) => {
            parent.handleInputChange(name, value);
            input.props.onChange?.(name, value);
        }, */
        onBlur,
        onChange,
        ...inputState
    }), [ isInputField, inputOrField, onChange, onBlur, inputState ]);


    if (element)
        return element;

    return <InputField width={getInputWidth(inputOrField)}>{children}</InputField>;
};
