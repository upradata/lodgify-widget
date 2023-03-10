import React, { useCallback, useEffect, useMemo } from 'react';
import { FormValue, FormValues, InputControllerProps, InputGroup, InputProps } from '@lodgify/ui';
// import { getInputWidth } from '@lodgify/ui/lib/es/components/collections/Form/utils/getInputWidth';
import { getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';
import SemanticForm from 'semantic-ui-react/dist/es/collections/Form/Form.js';
import { FormProps } from './Form.state';


export const InputField = React.memo(SemanticForm.Field);

type RenderInputFieldOptions<V = any> = {
    onBlur: () => void;
    onChange: (_name: string, value: V) => void;
} & FormValue<V>;

type RenderInputFieldProps = { children?: (options: RenderInputFieldOptions) => React.ReactElement; name: string; };
export const RenderInputField: React.FunctionComponent<RenderInputFieldProps> = ({ children }) => {
    return <React.Fragment>{children}</React.Fragment>;
};


export const NoInputField: React.FunctionComponent<{}> = ({ children }) => <React.Fragment>{children}</React.Fragment>;


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


export type FormFieldProps = ParentImperativeApi & { children: React.ReactChild | boolean | null; };

export const FormField: React.FunctionComponent<FormFieldProps> = ({ children, ...props }) => {
    if (!children)
        return children as null;

    if (!React.Children.only(children))
        throw new Error(`FormField accetps only one child and ${React.Children.count(children)} has been specified.`);

    if (isPrimitiveElement(children)) {
        return <InputField>{children}</InputField>;
    }

    const _children = children as React.ReactElement; // for typing

    if (_children.type === NoInputField)
        return _children;

    if (_children.type === InputGroup) {
        return React.cloneElement(_children, {
            children: React.Children.map(_children.props.children, c => <FormField {...props}>{c}</FormField>),
            widths: 'equal'
        });
    }

    const { state, ...parent } = props;

    const isInputField = _children.type === InputField;
    // children can be ... 
    const { name } = isInputField ? reactChildComponent<InputChildProps>(_children)?.props || { name: '' } : _children.props;

    return (
        <_InputField
            name={name}
            inputState={state[ name ]}
            parent={parent}
            isInputField={isInputField}
            isRenderInputField={_children.type === RenderInputField}
        >
            {_children}
        </_InputField>
    );
};


type InputChildProps = InputControllerProps & { onBlur?: InputProps[ 'onBlur' ]; width?: number; };

type InputFieldChild = Exclude<
    React.ReactElement<InputChildProps & RenderInputFieldProps>,
    string
>;


const reactChildComponent = function <P = {}>(element: React.ReactElement): React.ReactElement<P> {
    if (!React.Children.only(element))
        throw new Error(`React element does not have only one child`);

    return React.Children.toArray(element.props.children)[ 0 ] as React.ReactElement;
};

export const _InputField: React.FunctionComponent<{
    // input: InputElement;
    children: InputFieldChild;
    name: string;
    inputState: FormValue<any>;
    isInputField: boolean;
    isRenderInputField: boolean;
    parent: Omit<ParentImperativeApi, 'state'>;
}> = ({ /* input */children, name, inputState, isInputField, isRenderInputField, parent }) => {

    const inputOrField = children as InputFieldChild;

    // const { name } = isInputField ? reactChildComponent<InputChildProps>(inputOrField)?.props || { name: '' } : inputOrField.props;

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


    const inputFieldElement = useMemo(() => {
        const input = isInputField ? reactChildComponent<InputChildProps>(inputOrField) : null;

        return isInputField && React.cloneElement(
            inputOrField,
            { width: inputOrField.props.width, ...inputOrField.props },
            isPrimitiveElement(input) ? input : React.cloneElement(input, {
                ...input.props,
                onBlur,
                onChange,
                ...inputState
            }));
    }, [ isInputField, inputOrField, onChange, onBlur, inputState ]);


    const renderedElement = useMemo(() => {
        const input = isRenderInputField ? inputOrField as React.ReactElement<RenderInputFieldProps> : null;
        const render = input?.props.children;

        return isRenderInputField && render({ onBlur, onChange, ...inputState });
    }, [ isRenderInputField, inputOrField, onChange, onBlur, inputState ]);


    const inputFieldChildren = useMemo(() => !isInputField && React.cloneElement(inputOrField, {
        /* onBlur: () => parent.handleInputBlur(name),
        onChange: (name: string, value: unknown) => {
            parent.handleInputChange(name, value);
            input.props.onChange?.(name, value);
        }, */
        onBlur,
        onChange,
        ...inputState
    }), [ isInputField, inputOrField, onChange, onBlur, inputState ]);


    if (inputFieldElement)
        return inputFieldElement;

    if (renderedElement)
        return renderedElement;

    return <InputField width={inputOrField.props.width}>{inputFieldChildren}</InputField>;
};
