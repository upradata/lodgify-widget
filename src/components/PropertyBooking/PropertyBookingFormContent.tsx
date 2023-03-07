import React from 'react';
import {
    Button,
    CounterDropdown,
    CounterDropdownProps,
    // DateRangePickerProps,
    Dropdown,
    DropdownProps,
    LocationOptions,
    SearchBarFieldsProps
} from '@lodgify/ui';
import { CHECK_IN, CHECK_OUT, GUESTS, LOCATION } from '@lodgify/ui/lib/es/utils/default-strings';
import { ICON_NAMES } from '@lodgify/ui/lib/es/components/elements/Icon';
import { Calendar, CalendarProps } from '../Calendar';
import { ChangeInputData } from './PropertyBookingForm.type';
import { Form, FormProps, InputField } from '../Form';


// import { size } from '@lodgify/ui/lib/es/utils/size';

export type PropertyBookingFormContentProps = Omit<SearchBarFieldsProps, 'locationOptions'> & {
    locationOptions: LocationOptions[];
    onSubmit?: (data: ChangeInputData) => void;
    searchButton?: FormProps[ 'searchButton' ];
} & Pick<CalendarProps, 'minimumNights'>;

export const PropertyBookingFormContent: React.FunctionComponent<PropertyBookingFormContentProps> = props => {

    const dropdownProps: DropdownProps = {
        label: props.locationInputLabel,
        onChange: props.onInputChange,
        options: props.locationOptions,
        value: props.locationInputValue,
        willOpenAbove: props.willLocationDropdownOpenAbove
    };

    const calendarProps: CalendarProps /* DateRangePickerProps */ = {
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


    /* const searchButton: FormProps[ 'searchButton' ] = useCallback(({ isDisabled }) => (
        <Button isDisabled={isDisabled} isFormSubmit isPositionedRight isRounded>
            Search
        </Button>
    ), []);


    const button = <div className="button-container">{props.searchButton || searchButton}</div>; */

    return (
        <Form className="inputs-container"
            onSubmit={props.onSubmit}
            onInputChange={props.onInputChange}
            searchButton={<FormButton isDisabled={false} searchButton={props.searchButton} />}>

            <InputField className="input-container location-input-container"><Dropdown icon={ICON_NAMES.MAP_PIN} name="location" {...dropdownProps} /></InputField>
            <InputField className="input-container dates-input-container">
                {/* <DateRangePicker name="dates" {...dateRangePickerProps} /> */}
                <Calendar name="dates" {...calendarProps} />
            </InputField>
            <InputField className="input-container guests-input-container"><CounterDropdown name="guests" {...counterDropdownProps} /></InputField>

        </Form>
    );
};


const FormButton: React.FunctionComponent<{ isDisabled: boolean; searchButton: FormProps[ 'searchButton' ]; }> = ({ isDisabled, searchButton }) => {
    return (
        <div className="button-container">{
            searchButton ||
            <Button isDisabled={isDisabled} isFormSubmit isPositionedRight isRounded>
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
