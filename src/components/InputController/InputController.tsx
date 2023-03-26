import React, { cloneElement, forwardRef, memo, useCallback, useState } from 'react';
import { ErrorMessage } from '@lodgify/ui/lib/es/components/inputs/ErrorMessage';
import { getValueFromEvent } from '@lodgify/ui/lib/es/components/inputs/InputController/utils/getValueFromEvent';
import { Icon, InputControllerProps as LodgifyInputControllerProps } from '@lodgify/ui';
import { returnFirstArgument } from '@lodgify/ui/lib/es/utils/return-first-argument';
import { some } from '@lodgify/ui/lib/es/utils/some';
import classnames from 'classnames';
import { Input, StrictInputProps } from 'semantic-ui-react';
import { hasProp } from '../../util';

import type { Omit } from '../../util.types';


export type InputControllerProps<V = unknown, Args extends unknown[] = unknown[]> =
    Omit<LodgifyInputControllerProps, 'children' | 'onChange' | 'adaptOnChangeEvent'> &
    Omit<StrictInputProps, 'className' | 'fluid' | 'error' | 'onChange'> &
    {
        as?: React.ElementType | string;
        showErrorMessage?: 'typing' | 'blur';
        isDirty?: boolean;
        className?: string;
        adaptOnChangeEvent?: (...args: Args) => V;
        onChange?: (name: string, value: V) => void;
        initialValue?: V;
        onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
        onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
        hasFocusAndBlur?: boolean;
        useValidCheckOnValid?: boolean;
    };


const FwdRefInputController: React.ForwardRefRenderFunction<{}, InputControllerProps & { transformedValue?: never; children: Parameters<typeof cloneElement>[ 0 ]; }> = ({
    onChange, error, showErrorMessage, isCompact, isValid, name, icon,
    adaptOnChangeEvent, inputOnChangeFunctionName, mapValueToProps, children, className: klass, as,
    onBlur, onFocus, hasFocusAndBlur, useValidCheckOnValid, ...props
}, ref) => {
    const As = as || Input;

    // we remove transformedValue created in Form component
    const { isDirty, isFluid, transformedValue, isFocused, value: v, ...restProps } = props;
    const value = hasProp(props, 'value') ? v : null;

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

    const inputProps = typeof as === 'function' ? {
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
