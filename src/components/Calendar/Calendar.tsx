import 'react-dates/esm/initialize';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
// import { DateRangePickerProps } from '@lodgify/ui';
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
import { debounce } from 'debounce';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { ComponentWithResponsiveProps, withResponsive } from '../../withResponsive';
import { DateRangePickerProps } from './DateRangePicker.type';
import { InputController } from '../InputController';
import { isSame, partition, usePreviousListener } from '../../util';
import { ReactDatesDateRangePickerProps } from './ReactDates.type';


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

    const [ calendarProps, reactDatesProps ] = partition(props, DateRangePickerProps);

    type FocusedInput = DateRangePickerProps[ 'focusedInput' ];

    const [ state, setState ] = useState({
        endDateId: uuid() as number,
        startDateId: uuid() as number,
        focusedInput: null as FocusedInput,
    });


    useEffect(() => {
        moment.locale(calendarProps.localeCode);
        /* handleHeightChange();
        global.addEventListener('resize', handleHeightChange);

        return () => {
            global.removeEventListener('resize', handleHeightChange);
        }; */
    }, []);


    const previous = usePreviousListener({
        propsFocusedInput: calendarProps.focusedInput,
        stateFocusedInput: state.focusedInput
    }, { isSame });


    useEffect(() => {
        previous.removeAll();

        previous.addListener((prevValue, newValue) => {
            const isFocusControlled: boolean = getIsFocusControlled(newValue.propsFocusedInput);

            const previousFocusedInput = isFocusControlled ? prevValue.propsFocusedInput : prevValue.stateFocusedInput;
            const focusedInput = isFocusControlled ? newValue.propsFocusedInput : newValue.stateFocusedInput;

            if (isBlurEvent(previousFocusedInput, focusedInput))
                calendarProps.onBlur?.();

            if (isFocusControlled)
                return;

            if (previousFocusedInput !== focusedInput)
                calendarProps.onFocusChange?.(focusedInput);
        });
    }, [ calendarProps.onBlur, calendarProps.onFocusChange ]);


    const visibilityCheck = useRef();


    const handleFocusChange = useCallback((focusedInput: FocusedInput) => {
        if (!isDisplayedAsModal(windowHeight) && !getIsVisible(visibilityCheck.current))
            return;

        if (getIsFocusControlled(calendarProps.focusedInput))
            calendarProps.onFocusChange(focusedInput);
        else
            setState(state => ({ ...state, focusedInput }));
    }, [ setState, windowHeight, calendarProps.focusedInput, calendarProps.onFocusChange ]);



    const focusedInput = getIsFocusControlled(calendarProps.focusedInput) ? calendarProps.focusedInput : state.focusedInput;


    const inputControllerProps = {
        adaptOnChangeEvent: returnFirstArgument,
        error: calendarProps.error,
        initialValue: calendarProps.initialValue,
        inputOnChangeFunctionName: 'onDatesChange',
        isFocused: !!focusedInput,
        isValid: calendarProps.isValid,
        mapValueToProps: mapValueToProps,
        name: calendarProps.name,
        onChange: calendarProps.onChange,
        value: calendarProps.value
    };

    const dateRangePickerProps = {
        ...reactDatesProps,
        displayFormat: calendarProps.displayFormat,
        endDatePlaceholderText: calendarProps.isLoading ? LOADING_PLACEHOLDER_TEXT : calendarProps.endDatePlaceholderText,
        isDayBlocked: calendarProps.getIsDayBlocked,
        openDirection: getUpOrDownFromBoolean(calendarProps.willOpenAbove),
        startDatePlaceholderText: calendarProps.isLoading ? LOADING_PLACEHOLDER_TEXT : calendarProps.startDatePlaceholderText,
        focusedInput: focusedInput,
        onDatesChange: Function.prototype,
        onFocusChange: handleFocusChange,
        endDateId: state.endDateId,
        startDateId: state.startDateId,
        customArrowIcon: calendarProps.isLoading ? <Icon name={ICON_NAMES.SPINNER} /> : <Icon name={ICON_NAMES.ARROW_RIGHT} />,
        disabled: calendarProps.isLoading,
        customInputIcon: calendarProps.isCalendarIconDisplayed ? React.createElement(Icon, {
            name: ICON_NAMES.CALENDAR
        }) : undefined,
        daySize: 52,
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
    initialValue: undefined,
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


export const Calendar = withResponsive(memo(_Calendar));
