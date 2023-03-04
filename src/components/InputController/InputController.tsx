import React, { cloneElement, createRef, memo, useCallback } from 'react';
import { ErrorMessage } from '@lodgify/ui/lib/es/components/inputs/ErrorMessage';
import { getValueFromEvent } from '@lodgify/ui/lib/es/components/inputs/InputController/utils/getValueFromEvent';
import { InputControllerProps } from '@lodgify/ui';
import { returnFirstArgument } from '@lodgify/ui/lib/es/utils/return-first-argument';
import { some } from '@lodgify/ui/lib/es/utils/some';
import classnames from 'classnames';
import Input from 'semantic-ui-react/dist/es/elements/Input/Input.js';


const ICON_POSITION = 'left';

const _InputController: React.FunctionComponent<InputControllerProps> = ({
    onChange, error, isCompact, isFocused, isValid, isFluid, name, value, icon,
    adaptOnChangeEvent, inputOnChangeFunctionName, mapValueToProps, children
}) => {
    const showError = !!error && typeof error === 'string';
    const inputRef = createRef();

    const handleChange = useCallback((...args: any[]) => {
        onChange(name, adaptOnChangeEvent.apply(null, args));
    }, [ name, onChange, adaptOnChangeEvent ]);

    return (
        <Input className={classnames({
            dirty: some(value),
            compact: isCompact,
            error: !!error,
            focus: isFocused,
            valid: isValid
        })}

            fluid={isFluid}
            iconPosition={icon && ICON_POSITION}
            name={name}
            value={value}
        >
            {cloneElement(children, {
                [ inputOnChangeFunctionName ]: handleChange,
                ref: inputRef,
                ...mapValueToProps(value)
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
    mapValueToProps: value => ({ value })
};


export const InputController = memo(_InputController);
