import 'react-dates/esm/initialize';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
// import { DateRangePickerProps, InputControllerProps } from '@lodgify/ui';
import { getIsFocusControlled } from '@lodgify/ui/lib/es/components/inputs/DateRangePicker/utils/getIsFocusControlled';
import { getIsVisible } from '@lodgify/ui/lib/es/components/inputs/DateRangePicker/utils/getIsVisible';
import { getNumberOfMonths } from '@lodgify/ui/lib/es/components/inputs/DateRangePicker/utils/getNumberOfMonths';
import { getUpOrDownFromBoolean } from '@lodgify/ui/lib/es/utils/get-up-or-down-from-boolean';
// import { getWindowHeight } from '@lodgify/ui/lib/es/utils/get-window-height';
import { Icon, ICON_NAMES } from '@lodgify/ui/lib/es/components/elements/Icon';
// import { InputController } from '../InputController';
import { isBlurEvent } from '@lodgify/ui/lib/es/utils/is-blur-event';
import { isDisplayedAsModal } from '@lodgify/ui/lib/es/utils/is-displayed-as-modal';
import { LOADING_PLACEHOLDER_TEXT, MAXIMUM_SCREEN_WIDTH_FOR_TWO_MONTH_CALENDAR } from '@lodgify/ui/lib/es/components/inputs/DateRangePicker/constants';
import { mapValueToProps } from '@lodgify/ui/lib/es/components/inputs/DateRangePicker/utils/mapValueToProps';
import { returnFirstArgument } from '@lodgify/ui/lib/es/utils/return-first-argument';
// import { withResponsive } from '@lodgify/ui/lib/es/utils/with-responsive';
import DateRangePicker from 'react-dates/esm/components/DateRangePicker';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { ComponentWithResponsiveProps, withResponsive } from '../../withResponsive';
import { DateRangePickerProps } from './DateRangePicker.type';
import { InputController, InputControllerProps } from '../InputController';
import { isSame, partition, usePreviousListener } from '../../util';

import type { Omit } from '../../util.types';
import type { ReactDatesDateRangePickerProps } from './ReactDates.type';


export type CalendarProps = ComponentWithResponsiveProps<
    Omit<ReactDatesDateRangePickerProps, |
        'displayFormat' |
        'endDatePlaceholderText' |
        'isDayBlocked' |
        'openDirection' |
        'startDatePlaceholderText' |
        'focusedInput' |
        'onDatesChange' |
        'onFocusChange' |
        'endDateId' |
        'startDateId' |
        'customArrowIcon' |
        'disabled' |
        'customInputIcon' |
        'daySize' |
        'hideKeyboardShortcutsPanel' |
        'navNext' |
        'navPrev' |
        'numberOfMonths' |
        'withPortal' |
        'showClearDates'> &
    DateRangePickerProps
>;


const _Calendar: React.FunctionComponent<CalendarProps> = ({ children: _c, isUserOnMobile: _is, windowWidth, windowHeight, ...props }) => {

    const [ rangePickerProps, reactDatesProps ] = partition(props, DateRangePickerProps);

    type FocusedInput = DateRangePickerProps[ 'focusedInput' ];

    const [ state, setState ] = useState({
        endDateId: uuid() as number,
        startDateId: uuid() as number,
        focusedInput: null as FocusedInput,
    });


    useEffect(() => {
        moment.locale(rangePickerProps.localeCode);
        /* handleHeightChange();
        global.addEventListener('resize', handleHeightChange);

        return () => {
            global.removeEventListener('resize', handleHeightChange);
        }; */
    }, []);


    const previous = usePreviousListener({
        propsFocusedInput: rangePickerProps.focusedInput,
        stateFocusedInput: state.focusedInput
    }, { isSame });


    useEffect(() => {
        previous.removeAll();

        previous.addListener((prevValue, newValue) => {
            const isFocusControlled: boolean = getIsFocusControlled(newValue.propsFocusedInput);

            const previousFocusedInput = isFocusControlled ? prevValue.propsFocusedInput : prevValue.stateFocusedInput;
            const focusedInput = isFocusControlled ? newValue.propsFocusedInput : newValue.stateFocusedInput;

            if (isBlurEvent(previousFocusedInput, focusedInput))
                rangePickerProps.onBlur?.(props.name);

            if (isFocusControlled)
                return;

            if (previousFocusedInput !== focusedInput)
                rangePickerProps.onFocusChange?.(focusedInput);
        });
    }, [ rangePickerProps.onBlur, rangePickerProps.onFocusChange, props.name ]);


    const visibilityCheck = useRef();


    const handleFocusChange: ReactDatesDateRangePickerProps[ 'onFocusChange' ] = useCallback((focusedInput: FocusedInput) => {
        if (!isDisplayedAsModal(windowHeight) && !getIsVisible(visibilityCheck.current))
            return;

        if (getIsFocusControlled(rangePickerProps.focusedInput))
            rangePickerProps.onFocusChange(focusedInput);
        else
            setState(state => ({ ...state, focusedInput }));
    }, [ setState, windowHeight, rangePickerProps.focusedInput, rangePickerProps.onFocusChange ]);



    const focusedInput: ReactDatesDateRangePickerProps[ 'focusedInput' ] =
        getIsFocusControlled(rangePickerProps.focusedInput) ? rangePickerProps.focusedInput : state.focusedInput;


    const inputControllerProps: Omit<InputControllerProps, 'children'> = {
        adaptOnChangeEvent: returnFirstArgument,
        error: rangePickerProps.error,
        inputOnChangeFunctionName: 'onDatesChange',
        isFocused: !!focusedInput,
        isValid: rangePickerProps.isValid,
        mapValueToProps,
        name: rangePickerProps.name,
        onChange: rangePickerProps.onChange,
        value: rangePickerProps.value
    };

    const dateRangePickerProps: ReactDatesDateRangePickerProps = {
        daySize: 52,
        ...reactDatesProps,
        // initialValue: calendarProps.initialValue,
        displayFormat: rangePickerProps.displayFormat,
        endDatePlaceholderText: rangePickerProps.isLoading ? LOADING_PLACEHOLDER_TEXT : rangePickerProps.endDatePlaceholderText,
        isDayBlocked: rangePickerProps.getIsDayBlocked,
        openDirection: getUpOrDownFromBoolean(rangePickerProps.willOpenAbove),
        startDatePlaceholderText: rangePickerProps.isLoading ? LOADING_PLACEHOLDER_TEXT : rangePickerProps.startDatePlaceholderText,
        focusedInput,
        onDatesChange: () => { },
        onFocusChange: handleFocusChange,
        endDateId: `${state.endDateId}`,
        startDateId: `${state.startDateId}`,
        customArrowIcon: rangePickerProps.isLoading ? <Icon name={ICON_NAMES.SPINNER} /> : <Icon name={ICON_NAMES.ARROW_RIGHT} />,
        disabled: rangePickerProps.isLoading,
        customInputIcon: rangePickerProps.isCalendarIconDisplayed ? React.createElement(Icon, {
            name: ICON_NAMES.CALENDAR
        }) : undefined,
        hideKeyboardShortcutsPanel: true,
        navNext: React.createElement(Icon, {
            name: ICON_NAMES.ARROW_RIGHT
        }),
        navPrev: React.createElement(Icon, {
            name: ICON_NAMES.ARROW_LEFT
        }),
        numberOfMonths: getNumberOfMonths(windowWidth),
        withPortal: isDisplayedAsModal(windowHeight),
        showClearDates: true
    };

    return (
        <React.Fragment>
            <InputController {...inputControllerProps}>
                <DateRangePicker {...dateRangePickerProps} />
            </InputController>
            <div ref={visibilityCheck}></div>
        </React.Fragment>
    );
};


_Calendar.displayName = 'Calendar';

_Calendar.defaultProps = {
    displayFormat: 'DD/MM/YYYY',
    endDatePlaceholderText: '',
    error: false,
    focusedInput: undefined,
    getIsDayBlocked: Function.prototype,
    isCalendarIconDisplayed: true,
    isLoading: false,
    isValid: false,
    localeCode: 'en',
    name: '',
    onBlur: () => { },
    onChange: () => { },
    onFocusChange: Function.prototype,
    startDatePlaceholderText: '',
    value: undefined,
    willOpenAbove: false,
    windowWidth: MAXIMUM_SCREEN_WIDTH_FOR_TWO_MONTH_CALENDAR
};

const MemoCalendar = memo(_Calendar);
MemoCalendar.displayName = 'memo(Calendar)';

export const Calendar = withResponsive(MemoCalendar);
