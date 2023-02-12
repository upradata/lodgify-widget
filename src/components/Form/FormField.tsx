import React, { useMemo } from 'react';
import SemanticForm from 'semantic-ui-react/dist/es/collections/Form/Form.js';
import { FormState, InputControllerProps, InputGroup, InputProps } from '@lodgify/ui';
import { getInputWidth } from '@lodgify/ui/lib/es/components/collections/Form/utils/getInputWidth';


const Field = React.memo(SemanticForm.Field);
type InputElement = React.ReactElement<InputControllerProps & { onBlur?: InputProps[ 'onBlur' ]; }>;

export type ParentImperativeApi = {
    handleInputChange: (name: string, value: unknown) => void;
    handleInputBlur: (name: string) => void;
    state: FormState;
    // setState: React.Dispatch<React.SetStateAction<FormState>>;
};

export const getFormField = (child: React.ReactChild | boolean, parent: ParentImperativeApi) => {
    if (!child)
        return child;

    if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
        return <Field children={child} />;
    }

    if (child.type === InputGroup) {
        return React.cloneElement(child, {
            children: React.Children.map(child.props.children, nestedChild => getFormField(nestedChild, parent)),
            widths: 'equal'
        });
    }

    // return GetClonedInput(child, parent);
    return <InputField input={child} inputState={parent.state[ child.props.name ]} parent={parent} />;
};


export const InputField: React.FunctionComponent<{
    input: InputElement;
    inputState: FormState[ string ];
    parent: Omit<ParentImperativeApi, 'state'>;
}> = ({ input, inputState, parent }) => {

    const { name, onChange } = input.props;

    const children = useMemo(() => React.cloneElement(input, {
        onBlur: () => parent.handleInputBlur(name),
        onChange: (name: string, value: unknown) => {
            parent.handleInputChange(name, value);
            onChange?.(name, value);
        },
        ...inputState
    }), [ name, onChange, parent.handleInputBlur, parent.handleInputChange, inputState ]);


    return <Field children={children} width={getInputWidth(input)} />;
};
