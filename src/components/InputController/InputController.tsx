import React, { cloneElement, forwardRef, memo, useCallback } from 'react';
import { ErrorMessage } from '@lodgify/ui/lib/es/components/inputs/ErrorMessage';
import { getValueFromEvent } from '@lodgify/ui/lib/es/components/inputs/InputController/utils/getValueFromEvent';
import { Icon, InputControllerProps as LodgifyInputControllerProps } from '@lodgify/ui';
import { returnFirstArgument } from '@lodgify/ui/lib/es/utils/return-first-argument';
import { some } from '@lodgify/ui/lib/es/utils/some';
import classnames from 'classnames';
import { Input, StrictInputProps } from 'semantic-ui-react';

import type { Omit } from '../../util.types';


export type InputControllerProps<V = unknown, Args extends unknown[] = unknown[]> =
    Omit<LodgifyInputControllerProps, 'children' | 'onChange' | 'adaptOnChangeEvent'> &
    Omit<StrictInputProps, 'className' | 'fluid' | 'error' | 'onChange'> &
    {
        as?: React.ElementType | string;
        withErrorMessage?: boolean;
        isDirty?: boolean;
        className?: string;
        adaptOnChangeEvent?: (...args: Args) => V;
        onChange?: (name: string, value: V) => void;
    };


const FwdRefInputController: React.ForwardRefRenderFunction<{}, InputControllerProps & { transformedValue?: never; children: Parameters<typeof cloneElement>[ 0 ]; }> = ({
    onChange, error, withErrorMessage, isCompact, isFocused, isValid, name, value, icon,
    adaptOnChangeEvent, inputOnChangeFunctionName, mapValueToProps, children, className: klass, as, ...props
}, ref) => {
    const As = as || Input;

    // we remove transformedValue created in Form component
    const { isDirty, isFluid, transformedValue, ...restProps } = props;

    const showError = !!error && typeof error === 'string';

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

    const inputProps = !!as ? {
        value,
        fluid: isFluid,
        iconPosition: icon ? 'left' : undefined
    } : {};


    return (
        <As className={className} {...inputProps}>

            {cloneElement(children, {
                [ inputOnChangeFunctionName ]: handleChange,
                ref,
                ...(mapValueToProps(value) || {}),
                ...restProps
            })}

            {withErrorMessage && showError && <ErrorMessage errorMessage={error}>{icon}</ErrorMessage>}
            {isValid && <Icon color="green" name="checkmark" />}
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
    isFocused: false,
    error: false,
    isFluid: false,
    icon: null,
    onChange: returnFirstArgument,
    value: null,
    mapValueToProps: value => ({ value: value as string })
};


export const InputController = memo(_InputController);
