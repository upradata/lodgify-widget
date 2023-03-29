import React, { cloneElement, forwardRef, memo, useCallback, useState } from 'react';
import { ErrorMessage } from '@lodgify/ui/lib/es/components/inputs/ErrorMessage';
import { getValueFromEvent } from '@lodgify/ui/lib/es/components/inputs/InputController/utils/getValueFromEvent';
import { Icon } from '@lodgify/ui';
import { returnFirstArgument } from '@lodgify/ui/lib/es/utils/return-first-argument';
import { some } from '@lodgify/ui/lib/es/utils/some';
import classnames from 'classnames';
import { Input } from 'semantic-ui-react';
import { fragments, hasProp } from '../../util';
import { InputState } from '../Form';
import { InputControllerProps } from './InputController.props';


const FwdRefInputController: React.ForwardRefRenderFunction<{}, InputControllerProps & { children: Parameters<typeof cloneElement>[ 0 ]; }> = ({
    onChange, error, showErrorMessage, isCompact, isValid, name, icon,
    adaptOnChangeEvent, inputOnChangeFunctionName, mapValueToProps, children, className: klass, as,
    onBlur, onFocus, hasFocusAndBlur, useValidCheckOnValid, ...props
}, ref) => {
    const As = as || Input;

    // we remove transformedValue created in Form component
    const [ , propsWithoutInputStateProps ] = fragments(props, InputState);

    const { isDirty, isFluid, isFocused, ...restProps } = propsWithoutInputStateProps;
    const value = hasProp(props, 'value') ? props.value : null;

    const handleChange = useCallback((...args: any[]) => {
        onChange(name, adaptOnChangeEvent.apply(null, args));
    }, [ name, onChange, adaptOnChangeEvent ]);

    const [ focused, setFocused ] = useState(false);
    const _isFocused = hasProp(props, 'isFocused') ? isFocused : focused;

    const handleFocus = useCallback(event => { setFocused(true); onFocus?.(event); }, [ onFocus ]);
    const handleBlur = useCallback(event => { setFocused(false); onBlur?.(event); }, [ onBlur ]);

    const hasErrorMessage = !!error && typeof error === 'string';
    const showError = hasErrorMessage && (showErrorMessage === 'typing' || showErrorMessage === 'blur' && !_isFocused);

    const className = classnames({
        dirty: hasProp(props, 'isDirty') ? isDirty : some(value),
        compact: isCompact,
        error: !!error,
        focus: _isFocused,
        valid: isValid
    }, klass);

    const inputProps = typeof As === 'function' ? {
        value,
        fluid: isFluid,
        iconPosition: icon ? 'left' : undefined
    } : {};

    const childrenProps = {
        [ inputOnChangeFunctionName ]: handleChange,
        ref,
        ...(mapValueToProps(value) || {}),
        ...restProps,
        ...(hasFocusAndBlur ? {
            onFocus: handleFocus,
            onBlur: handleBlur
        } : {})
    };

    return (
        <As className={className} {...inputProps}>

            {cloneElement(children, childrenProps)}

            {showError && <ErrorMessage errorMessage={error}>{icon}</ErrorMessage>}
            {isValid && useValidCheckOnValid && <Icon color="green" name="checkmark" />}
            {!!as && icon && <Icon name={icon} />}
        </As>
    );
};



FwdRefInputController.displayName = 'InputController';
const _InputController = forwardRef(FwdRefInputController);

_InputController.defaultProps = {
    adaptOnChangeEvent: getValueFromEvent,
    inputOnChangeFunctionName: 'onChange',
    isCompact: false,
    isValid: false,
    useValidCheckOnValid: true,
    // isFocused: false,
    error: false,
    isFluid: false,
    icon: null,
    onChange: returnFirstArgument,
    // value: null,
    mapValueToProps: value => ({ value: value as string }),
    showErrorMessage: 'typing',
    hasFocusAndBlur: true
};


export const InputController = memo(_InputController);
