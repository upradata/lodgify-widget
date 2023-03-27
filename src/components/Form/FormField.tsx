import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { getControlledInputValue } from '@lodgify/ui/lib/es/utils/get-controlled-input-value';
import { InputGroup, InputProps } from '@lodgify/ui';
// import { getInputWidth } from '@lodgify/ui/lib/es/components/collections/Form/utils/getInputWidth';
// import { getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';
import { Form as SemanticForm, SemanticWIDTHS, StrictFormFieldProps } from 'semantic-ui-react';

import type { InputControllerProps } from '../InputController';
import type { InputsState, InputState } from './Form.state.type';
import type { Omit, PropsWithStyle } from '../../util.types';
import type { Validation } from './Form.validation';
import { AppContext } from '../../App/AppContext';
import { errorToString, hasProp } from '../../util';


export const InputField: React.FunctionComponent<PropsWithStyle<StrictFormFieldProps>> = React.memo(SemanticForm.Field);

type RenderInputFieldOptions<V = any> = {
    onBlur: () => void;
    onChange: (_name: string, value: V) => void;
} & InputState<V>;

type RenderInputFieldProps = { children?: (options: RenderInputFieldOptions) => React.ReactElement; name: string; };
export const RenderInputField: React.FunctionComponent<RenderInputFieldProps> = ({ children }) => {
    return <React.Fragment>{children}</React.Fragment>;
};


export const NoInputField: React.FunctionComponent<{}> = ({ children }) => <React.Fragment>{children}</React.Fragment>;


export type ParentImperativeApi = {
    handleInputChange: (name: string, value: unknown) => void;
    handleInputBlur: (name: string) => void;
    setInputState: (inputName: string, inputState: InputState) => void;
    inputsState: InputsState;
    getValidation: (name: string | number) => Validation;
};

const isPrimitiveElement = (element: React.ReactElement | string | number | boolean): string | number | boolean => {
    return typeof element === 'string' || typeof element === 'number' || typeof element === 'boolean';
};


export type FormFieldProps = ParentImperativeApi & { children: React.ReactChild | boolean | null | undefined; };

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

    const getType = (): InputType => {
        if (_children.type === InputField)
            return 'field';

        if (_children.type === RenderInputField)
            return 'render-field';

        return 'input';
    };

    const type = getType();

    // children can be ... 
    const { name } = type === 'field' ? reactChildComponent<InputChildProps>(_children)?.props || { name: '' } : _children.props;

    const { inputsState, ...parent } = props;
    const inputState = inputsState[ name ];

    return (
        <_InputField name={name} parent={parent} inputState={inputState} type={type} >
            {_children}
        </_InputField>
    );
};


type InputChildProps = InputControllerProps & { onBlur?: InputProps[ 'onBlur' ]; width?: SemanticWIDTHS; };

type InputFieldChild = Exclude<
    React.ReactElement<InputChildProps & RenderInputFieldProps>,
    string
>;


const reactChildComponent = function <P = {}>(element: React.ReactElement): React.ReactElement<P> {
    if (!React.Children.only(element))
        throw new Error(`React element does not have only one child`);

    return React.Children.toArray(element.props.children)[ 0 ] as React.ReactElement;
};


type InputType = 'input' | 'field' | 'render-field';

export const _InputField: React.FunctionComponent<{
    // input: InputElement;
    children: InputFieldChild;
    name: string;
    inputState: InputState;
    type: InputType;
    parent: Omit<ParentImperativeApi, 'inputsState'>;
}> = ({ children, name, inputState, type, parent }) => {
    const context = useContext(AppContext);

    const getInput = (): React.ReactElement<InputChildProps> => {

        if (type === 'field')
            return type === 'field' ? reactChildComponent<InputChildProps>(children) : undefined;

        if (type === 'render-field') {
            if (type !== 'render-field')
                return undefined;

            /* if (!inputState)
                throw new Error(`RenderInputField must have inputState`); */

            const render = (children as React.ReactElement<RenderInputFieldProps>).props.children;
            return render({ onBlur: () => { onBlur(); }, onChange: (name, value) => { onChange(name, value); }, ...inputState });
        }

        return children;
    };

    const untransformedInputState = () => {
        try {
            const validation = parent.getValidation(name);
            const value = inputState?.value; // getControlledInputValue(input.props.value, input.props.initialValue, inputState?.value);
            return inputState && hasProp(inputState, 'value') ? { ...inputState, value: validation.untransformed(value) } : {};
        } catch (e) {
            context.logError(errorToString(e));
            return inputState;
        }
    };

    const input = getInput();

    useEffect(() => {
        // check validity on init
        const { value } = input.props;
        const validation = parent.getValidation(name);

        if (validation.isEmpty(value))
            parent.setInputState(name, {});
        else
            parent.handleInputChange(name, value);
    }, []);


    const onBlur = useCallback(() => parent.handleInputBlur(name), [ name, parent.handleInputBlur ]);

    const onChange = useCallback((_name: string, value: unknown) => {
        parent.handleInputChange(name, value);
        input.props.onChange?.(name, value);
    }, [ name, parent.handleInputChange, input.props.onChange ]);


    const cloneElement = (input: React.ReactElement<InputChildProps>) => React.cloneElement(input, {
        ...input.props,
        onBlur,
        onChange,
        ...untransformedInputState()
    });

    const memoArgs = [ children, onChange, onBlur, inputState ];

    const inputFieldElement = useMemo(() => {
        return type === 'field' && React.cloneElement(
            children,
            children.props,
            isPrimitiveElement(input) ? input : cloneElement(input));
    }, memoArgs);
    /* isInputField, inputOrField, */

    const renderedElement = useMemo(() => type === 'render-field' && cloneElement(input), memoArgs);
    // /* isRenderInputField,  inputOrField,*/

    const inputFieldChildren = useMemo(() => type === 'input' && cloneElement(input), memoArgs);
    /* isInputField, inputOrField, */


    if (inputFieldElement)
        return inputFieldElement;

    if (renderedElement)
        return renderedElement;


    return <InputField width={input.props.width}>{inputFieldChildren}</InputField>;
};
