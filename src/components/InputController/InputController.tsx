import React, { cloneElement, createRef, memo, useCallback } from 'react';
import { ErrorMessage } from '@lodgify/ui/lib/es/components/inputs/ErrorMessage';
import { getValueFromEvent } from '@lodgify/ui/lib/es/components/inputs/InputController/utils/getValueFromEvent';
import { InputControllerProps as LodgifyInputControllerProps } from '@lodgify/ui';
import { returnFirstArgument } from '@lodgify/ui/lib/es/utils/return-first-argument';
import { some } from '@lodgify/ui/lib/es/utils/some';
import classnames from 'classnames';
import { Input, StrictInputProps } from 'semantic-ui-react';

import type { Omit } from '../../util.types';


export type InputControllerProps =
    LodgifyInputControllerProps & { isDirty?: boolean; className?: string; } &
    Omit<StrictInputProps, 'className' | 'fluid' | 'error' | 'onChange'>;


const _InputController: React.FunctionComponent<InputControllerProps & { transformedValue?: never; }> = ({
    onChange, error, isCompact, isFocused, isValid, isFluid, name, value, icon,
    adaptOnChangeEvent, inputOnChangeFunctionName, mapValueToProps, children, className: klass, ...props
}) => {

    // we remove transformedValue created in Form component
    const { isDirty, transformedValue, ...inputProps } = props;

    const showError = !!error && typeof error === 'string';
    const inputRef = createRef();

    const handleChange = useCallback((...args: any[]) => {
        onChange(name, adaptOnChangeEvent.apply(null, args));
    }, [ name, onChange, adaptOnChangeEvent ]);

    const className = classnames({
        dirty: 'isDirty' in props ? isDirty : some(value),
        compact: isCompact,
        error: !!error,
        focus: isFocused,
        valid: isValid
    }, klass);

    return (
        <Input className={className} fluid={isFluid} iconPosition={icon ? 'left' : undefined} value={value} name={name} {...inputProps}>

            {cloneElement(children, {
                [ inputOnChangeFunctionName ]: handleChange,
                ref: inputRef,
                ...(mapValueToProps(value) || {})
            })}

            {showError && <ErrorMessage errorMessage={error}>{icon}</ErrorMessage>}
        </Input>
    );
};



_InputController.displayName = 'InputController';

_InputController.defaultProps = {
    adaptOnChangeEvent: getValueFromEvent,
    inputOnChangeFunctionName: 'onChange',
    isCompact: false,
    isValid: false,
    isFocused: false,
    error: false,
    isFluid: false,
    icon: null,
    onChange: returnFirstArgument,
    value: null,
    mapValueToProps: value => ({ value: value as string })
};


export const InputController = memo(_InputController);
