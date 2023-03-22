import React, { memo, useEffect, useState } from 'react';
import { adaptOptions } from '@lodgify/ui/lib/es/components/inputs/Dropdown/utils/adaptOptions';
import { ErrorMessage, Icon } from '@lodgify/ui';
import { getControlledInputValue } from '@lodgify/ui/lib/es/utils/get-controlled-input-value';
import { getHasErrorMessage } from '@lodgify/ui/lib/es/utils/get-has-error-message';
import { getHasImages } from '@lodgify/ui/lib/es/components/inputs/Dropdown/utils/getHasImages';
import { getIcon } from '@lodgify/ui/lib/es/components/inputs/Dropdown/utils/getIcon';
import { getIsInputValueReset } from '@lodgify/ui/lib/es/utils/get-is-input-value-reset';
import { getIsOpenAfterChange } from '@lodgify/ui/lib/es/components/inputs/Dropdown/utils/getIsOpenAfterChange';
import { getPropOnCondition } from '@lodgify/ui/lib/es/utils/get-prop-on-condition';
import { ICON_NAMES } from '@lodgify/ui/lib/es/components/elements/Icon';
import { NO_RESULTS } from '@lodgify/ui/lib/es/utils/default-strings';
import { some } from '@lodgify/ui/lib/es/utils/some';
import classnames from 'classnames';
import { Dropdown as SemanticDropdown, StrictDropdownProps } from 'semantic-ui-react';
import { DropdownProps, DropdownRef, LodgifyDropdownProps } from './Dropdown.props';
import { partition, usePrevious } from '../../util';


const _DropdownFwdRef: React.ForwardRefRenderFunction<DropdownRef, DropdownProps> = (props, ref) => {
    const [ cmpProps, semanticProps ] = partition(props, LodgifyDropdownProps);

    type State = {
        isBlurred: boolean;
        isOpen: boolean;
        value: unknown;
    };

    const [ state, _setState ] = useState<State>({
        isBlurred: true,
        isOpen: false,
        value: getControlledInputValue(cmpProps.value, cmpProps.initialValue)
    });

    const setState = (partialState: Partial<State>) => _setState(state => {
        const newState = { ...state, ...partialState };

        if (state.value !== newState.value) {
            cmpProps.onChange?.(cmpProps.name, newState.value);
        }

        if (!state.isBlurred && newState.isBlurred) {
            cmpProps.onBlur?.(cmpProps.name);
        }

        if (state.isBlurred && !newState.isBlurred) {
            cmpProps.onFocus?.(cmpProps.name);
        }

        return newState;
    });


    const handleChange: StrictDropdownProps[ 'onChange' ] = (event, { value }) => {
        setState({
            value,
            isOpen: getIsOpenAfterChange((event as any).key)
        });
    };

    const handleOpen = (isOpen: boolean) => {
        setState({
            isOpen: isOpen,
            isBlurred: false
        });
    };

    const handleBlur = (isBlurred: boolean) => {
        setState({
            isBlurred: isBlurred,
            isOpen: false
        });
    };


    const previousPropsValue = usePrevious(cmpProps.value);


    useEffect(() => {
        if (getIsInputValueReset(previousPropsValue, cmpProps.value)) {
            setState({ value: undefined });
            return;
        }

        if (previousPropsValue !== cmpProps.value) {
            const value = getControlledInputValue(cmpProps.value, cmpProps.initialValue, state.value);
            setState({ value });
            return;
        }
    }, [ cmpProps.value ]);


    const value = getControlledInputValue(cmpProps.value, cmpProps.initialValue, state.value);
    const hasImages = getHasImages(cmpProps.options);
    const adaptedOptions = adaptOptions(cmpProps.options, hasImages);
    const hasErrorMessage = getHasErrorMessage(cmpProps.error);



    const dropdownProps: StrictDropdownProps & Pick<DropdownProps, 'ref'> = {
        clearable: cmpProps.isClearable,
        compact: cmpProps.isCompact,
        disabled: cmpProps.isDisabled || !adaptedOptions.length,
        icon: React.createElement(Icon, {
            name: getIcon(value, cmpProps.isClearable),
            size: getPropOnCondition('small', cmpProps.isCompact)
        }),
        onBlur: () => { handleBlur(true); },
        onChange: handleChange,
        onClick: () => { handleOpen(!state.isOpen); },
        open: state.isOpen,
        options: adaptedOptions,
        placeholder: cmpProps.label,
        search: cmpProps.getOptionsWithSearch || cmpProps.isSearchable,
        selectOnBlur: false,
        selection: true,
        upward: cmpProps.willOpenAbove,
        value,
        ...semanticProps,
        ref
    };

    const className = classnames('dropdown-container', {
        'has-images': hasImages,
        'is-compact': cmpProps.isCompact,
        dirty: some(value) || some(cmpProps.initialValue || cmpProps.value),
        error: cmpProps.error,
        focus: state.isOpen,
        valid: cmpProps.isValid
    });

    return (
        <div className={className}>
            {hasErrorMessage && <ErrorMessage errorMessage={cmpProps.error} />}
            {cmpProps.isValid && <Icon color="green" name={ICON_NAMES.CHECKMARK} />}
            {!hasImages && cmpProps.icon && <Icon name={cmpProps.icon} />}

            <SemanticDropdown {...dropdownProps} />
        </div>
    );
};


const _Dropdown = React.forwardRef(_DropdownFwdRef);
_Dropdown.displayName = 'Dropdown';

_Dropdown.defaultProps = {
    error: false,
    getOptionsWithSearch: null,
    icon: null,
    isClearable: true,
    isCompact: false,
    isDisabled: false,
    isSearchable: false,
    isValid: false,
    label: '',
    name: '',
    noResultsMessage: NO_RESULTS,
    onBlur: () => { },
    onChange: () => { },
    onFocus: () => { },
    options: [],
    value: undefined,
    willOpenAbove: false,
    initialValue: null
};


export const Dropdown = memo(_Dropdown);
