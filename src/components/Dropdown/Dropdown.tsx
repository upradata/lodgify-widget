import './Dropdown.scss';

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { adaptOptions } from '@lodgify/ui/lib/es/components/inputs/Dropdown/utils/adaptOptions';
import { Icon } from '@lodgify/ui';
import { getControlledInputValue } from '@lodgify/ui/lib/es/utils/get-controlled-input-value';
import { getHasImages } from '@lodgify/ui/lib/es/components/inputs/Dropdown/utils/getHasImages';
import { getIcon } from '@lodgify/ui/lib/es/components/inputs/Dropdown/utils/getIcon';
import { getIsOpenAfterChange } from '@lodgify/ui/lib/es/components/inputs/Dropdown/utils/getIsOpenAfterChange';
import { getPropOnCondition } from '@lodgify/ui/lib/es/utils/get-prop-on-condition';
import { NO_RESULTS } from '@lodgify/ui/lib/es/utils/default-strings';
import { some } from '@lodgify/ui/lib/es/utils/some';
import classnames from 'classnames';
import { Dropdown as SemanticDropdown } from 'semantic-ui-react';
import { DropdownProps, DropdownRef, DropdownSearchInput, LodgifyDropdownProps, SemanticDropdownProps } from './Dropdown.props';
import { getOptionsWithSearch } from '../CountryDropdown/CountryDropdown';
import { fragments, removeType, usePrevious, hasProp, isNil, useActionsAfterRender } from '@root/util';
import { InputController, InputControllerChildProps, InputControllerProps, StrictInputControllerPropsWithInputState } from '../InputController';

type OnChange = SemanticDropdownProps[ 'onChange' ];
type OnChangePackedParameters = { event: Parameters<OnChange>[ 0 ], data: Parameters<OnChange>[ 1 ]; };
type AdaptOnChangeEvent = (...args: Parameters<OnChange>) => OnChangePackedParameters;


const getIsInputValueReset = function <T>(previousValue: T, value: T, isInitValue: (v: T) => boolean) {
    return !isNil(previousValue) && !isInitValue(previousValue) && isInitValue(value);
};


const _DropdownFwdRef: React.ForwardRefRenderFunction<DropdownRef, DropdownProps> = ({ className: klass, ...props }, ref) => {
    const [ cmpProps, strictInputControllerProps, semanticProps ] = fragments(
        props,
        LodgifyDropdownProps,
        StrictInputControllerPropsWithInputState<OnChangePackedParameters, Parameters<OnChange>>
    );


    const propValue = hasProp(cmpProps, 'value') ? cmpProps.value : null;
    const initialValue = hasProp(cmpProps, 'initialValue') ? cmpProps.initialValue : props.multiple ? [] : '';

    type State = {
        isBlurred: boolean;
        isOpen: boolean;
        value: DropdownProps[ 'value' ];
        searchQuery: string;
        autofilled: 'processing' | 'done' | 'idle';
    };

    const [ state, _setState ] = useState<State>({
        isBlurred: true,
        isOpen: false,
        value: propValue || initialValue,
        searchQuery: semanticProps.searchQuery,
        autofilled: 'idle'
    });


    useEffect(() => {
        if (!propValue && cmpProps.initialValue)
            cmpProps.onChange?.(cmpProps.name, cmpProps.initialValue);
    }, []);


    const scheduleActionsAfterRender = useActionsAfterRender();

    const setState = (partialState: Partial<State>/* , event?: React.SyntheticEvent */) => _setState(state => {
        const s: State = { ...state, ...partialState };

        const autofilled = partialState.autofilled === 'done' ? 'idle' : s.autofilled;
        const forceClosed = !!partialState.autofilled && partialState.autofilled !== 'idle'; // && state.autofilled !== 'idle';

        const newState = { ...s, autofilled, isOpen: forceClosed ? false : s.isOpen };

        if (state.value !== newState.value) {
            scheduleActionsAfterRender.add(() => cmpProps.onChange?.(cmpProps.name, newState.value/* , event */));
        }

        if (!state.isBlurred && newState.isBlurred) {
            scheduleActionsAfterRender.add(() => cmpProps.onBlur?.(cmpProps.name/* , event */));
        }

        if (state.isBlurred && !newState.isBlurred) {
            scheduleActionsAfterRender.add(() => cmpProps.onFocus?.(cmpProps.name/* , event */));
        }

        return newState;
    });


    const previousPropsValue = usePrevious(propValue, propValue || initialValue);


    useEffect(() => {
        const isInitValue = (v: DropdownProps[ 'value' ]) => isNil(v) || props.multiple ? Array.isArray(v) && v.length === 0 : v === '';

        if (getIsInputValueReset(previousPropsValue, cmpProps.value, isInitValue)) {
            setState({ value: initialValue, autofilled: 'idle' });
            return;
        }

        if (previousPropsValue !== cmpProps.value) {
            const value = getControlledInputValue(propValue, initialValue, state.value);
            setState({ value, autofilled: 'idle' });
            return;
        }

        // setState({ autofilled: 'idle' });
    }, [ previousPropsValue, cmpProps.value ]);


    const value = getControlledInputValue(propValue, initialValue, state.value);
    const hasImages = getHasImages(cmpProps.options);
    const adaptedOptions = adaptOptions(cmpProps.options, hasImages);


    const dropdownProps: InputControllerChildProps<SemanticDropdownProps> = {
        clearable: cmpProps.isClearable,
        compact: cmpProps.isCompact,
        disabled: cmpProps.isDisabled || !adaptedOptions.length,
        icon: <Icon name={getIcon(value, cmpProps.isClearable)} size={getPropOnCondition('small', cmpProps.isCompact)} />,
        onClick: useCallback((event, data) => {
            setState({
                isOpen: data.open,
                isBlurred: false,
                autofilled: 'idle'
            }/* , event */);
        }, []),
        open: state.isOpen,
        options: adaptedOptions,
        placeholder: cmpProps.label,
        search: cmpProps.getOptionsWithSearch || cmpProps.isSearchable,
        selectOnBlur: false,
        selection: true,
        upward: cmpProps.willOpenAbove,
        /*  value, */
        searchQuery: state.searchQuery,
        ...semanticProps,
        searchInput: useMemo(() => {
            const searchInputProps = removeType({ name: props.name, autoComplete: props.autoComplete }, 'undefined') as DropdownSearchInput;
            const isObject = typeof props.searchInput === 'object';

            const searchInputObject = isObject || typeof props.searchInput === 'undefined' ? props.searchInput || {} : undefined;

            if (searchInputObject)
                return { ...searchInputObject, ...searchInputProps } as DropdownSearchInput;

            return props.searchInput;
        }, [ props.searchInput, props.autoComplete, props.name ]),
        onOpen: useCallback(() => { setState({ isOpen: true }); }, []),
        onClose: useCallback(() => { setState({ isOpen: false, searchQuery: '' }); }, []),
        onSearchChange: useCallback((event, { searchQuery, options, open: isOpen }) => {
            const isAutoFilled = !event.nativeEvent.inputType;

            if (isAutoFilled) {
                const items = getOptionsWithSearch(options, searchQuery);

                if (items.length === 1) {
                    const { value } = items[ 0 ];
                    setState({ autofilled: 'processing', searchQuery: '', value });
                } else if (!isOpen) {
                    setState({ isOpen: true, searchQuery });
                }
            } else {
                setState({ searchQuery });
            }
        }, []),
        ref
    };


    const onChange: OnChange = useCallback((event, data) => {
        // to ensure that handleChange is called after onClose
        // semantic dropdown handleItemClick is calling onChange before but if the search input has some value ("fr" for instance)
        // and then click on the french flag,
        // the browser will call first the input onClose listener before calling the onChange called synchronously by the Dropdown component
        // Semantic should handle it forcing the calling order
        setTimeout(() => {
            setState({
                value: data.value,
                isOpen: getIsOpenAfterChange((event as any).key),
                autofilled: 'done',
            }/* , event */);
        }, 0);
    }, []);


    const className = classnames('dropdown-container', 'ui', 'input', {
        'has-images': hasImages,
        'is-compact': cmpProps.isCompact
    });


    const inputControllerProps: InputControllerProps<OnChangePackedParameters, Parameters<OnChange>> = {
        ...strictInputControllerProps,
        adaptOnChangeEvent: useCallback(((event, data) => ({ event, data })) as AdaptOnChangeEvent, []),
        error: cmpProps.error,
        isFocused: state.isOpen,
        isDirty: some(value) || some(cmpProps.initialValue || cmpProps.value),
        isValid: cmpProps.isValid,
        name: cmpProps.name,
        onChange: useCallback((_name, { event, data }) => { onChange(event, data); }, []),
        onBlur: useCallback(() => {
            setState({
                isBlurred: true,
                isOpen: false
            });
        }, []),
        value,
        className,
        icon: !hasImages ? cmpProps.icon : undefined,
        useValidCheckOnValid: cmpProps.useValidCheckOnValid
    };

    return (
        <div className={classnames('Dropdown', klass)}>
            <InputController {...inputControllerProps} as='div'>
                <SemanticDropdown {...dropdownProps} />
            </InputController>
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
    // value: undefined,
    willOpenAbove: false,
    // initialValue: null,
    useValidCheckOnValid: false
};


export const Dropdown = memo(_Dropdown);
