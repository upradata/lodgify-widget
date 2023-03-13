import React, { useCallback } from 'react';
import { Button, CounterDropdown, CounterDropdownProps, Dropdown, DropdownProps, FormValues, FormValue } from '@lodgify/ui';
import { CHECK_IN, CHECK_OUT, GUESTS, LOCATION } from '@lodgify/ui/lib/es/utils/default-strings';
import { ICON_NAMES } from '@lodgify/ui/lib/es/components/elements/Icon';
import { Calendar, CalendarProps } from '../Calendar';
import { Form, FormProps, InputField } from '../Form';

import type { ChangeInputData } from './PropertyBookingForm.type';
import type { PropertyBookingFormContentProps } from './PropertyBookingForm.props';


// import { size } from '@lodgify/ui/lib/es/utils/size';

type InputNames = keyof ChangeInputData;
type InputValues = ChangeInputData[ InputNames ];

const isDefinedInputValue = <N extends InputNames>(name: N, value: ChangeInputData[ N ]) => {
    if (name === 'dates') {
        const dates = value as ChangeInputData[ 'dates' ];
        return !!dates?.startDate && !!dates?.endDate;
    }

    return !!value;
};

const isSubmitDisabled = (inputsState: FormValues<InputNames, InputValues>) => {
    return Object.entries<FormValue<InputValues>>(inputsState).some(([ name, { error, value } ]) => {
        return !!error || !isDefinedInputValue(name as InputNames, value);
    });
};

export const PropertyBookingFormContent: React.FunctionComponent<PropertyBookingFormContentProps> = props => {

    const dropdownProps: DropdownProps = {
        label: props.locationInputLabel,
        onChange: props.onInputChange,
        options: props.locationOptions,
        value: props.locationInputValue,
        willOpenAbove: props.willLocationDropdownOpenAbove
    };

    const calendarProps: CalendarProps = {
        endDatePlaceholderText: props.datesCheckOutLabel,
        focusedInput: props.datesInputFocusedInput,
        getIsDayBlocked: props.getIsDayBlocked,
        minimumNights: props.minimumNights,
        isCalendarIconDisplayed: props.isCalendarIconDisplayed,
        isLoading: props.isDateRangePickerLoading,
        localeCode: props.dateRangePickerLocaleCode,
        onChange: props.onInputChange,
        onFocusChange: props.datesInputOnFocusChange,
        startDatePlaceholderText: props.datesCheckInLabel,
        value: props.datesInputValue,
        willOpenAbove: props.willLocationDropdownOpenAbove
    };

    const counterDropdownProps: CounterDropdownProps = {
        counterValue: props.guestsInputValue,
        dropdownLabel: props.guestsInputLabel,
        maximumCounterValue: props.maximumGuestsInputValue,
        onChange: props.onInputChange,
        popupId: props.guestsPopupId
    };


    return (
        <Form className="inputs-container"
            onSubmit={props.onSubmit}
            onInputChange={props.onInputChange}
            isSubmitDisabled={isSubmitDisabled}
            searchButton={<FormButton searchButton={props.searchButton} />} >

            <InputField className="input-container location-input-container"><Dropdown icon={ICON_NAMES.MAP_PIN} name="location" {...dropdownProps} /></InputField>
            <InputField className="input-container dates-input-container"><Calendar name="dates" {...calendarProps} /></InputField>
            <InputField className="input-container guests-input-container is-last"><CounterDropdown name="guests" {...counterDropdownProps} /></InputField>

        </Form>
    );
};




const FormButton: React.FunctionComponent<{ searchButton: FormProps[ 'searchButton' ]; isDisabled?: boolean; }> = ({ searchButton, isDisabled }) => {
    return (
        <div className="button-container">{
            /* It is bad, but I cannot for now use a render function searchButton({ isDisabled }) */
            searchButton && React.cloneElement(searchButton, { isDisabled }) ||
            <Button isFormSubmit isPositionedRight isRounded>
                Search
            </Button>
        }
        </div>
    );
};


PropertyBookingFormContent.displayName = 'PropertyBookingFormContent';

PropertyBookingFormContent.defaultProps = {
    dateRangePickerLocaleCode: undefined,
    datesCheckInLabel: CHECK_IN,
    datesCheckOutLabel: CHECK_OUT,
    datesInputFocusedInput: undefined,
    datesInputOnFocusChange: () => { },
    datesInputValue: undefined,
    getIsDayBlocked: () => { },
    guestsInputLabel: GUESTS,
    guestsInputValue: undefined,
    guestsPopupId: undefined,
    isCalendarIconDisplayed: undefined,
    isDateRangePickerLoading: undefined,
    locationInputLabel: LOCATION,
    locationInputValue: undefined,
    locationOptions: null,
    maximumGuestsInputValue: undefined,
    // searchButton: <Button icon={ICON_NAMES.SEARCH} isFormSubmit isRounded>{SEARCH}</Button>,
    willLocationDropdownOpenAbove: true,
    onInputChange: () => { }
};


// export const PropertyBookingFormContent = memo(_PropertyBookingFormContent);
