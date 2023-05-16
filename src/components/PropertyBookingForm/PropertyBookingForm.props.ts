import type { DateRange, LocationOptions, SearchBarFieldsProps } from '@lodgify/ui';
import type { CalendarProps } from '../Calendar';
import type { ChangeInputData, InputDataNames, InputDataValues } from './PropertyBookingForm.type';
import type { FormProps, InputState } from '../Form';
import type { Omit } from '../../util.types';

export type PropertyBookingFormProps = Omit<PropertyBookingFormContentProps, /* 'onInputChange' |  */'onSubmit'> & {
    onSubmit?: (/* data: ChangeInputData */) => void;
    // onInputChange?: (name: InputDataNames, value: InputDataValues, inputState: InputState) => void;
    searchButton?: FormProps[ 'searchButton' ];
    isCompact?: boolean;
};


export type PropertyBookingFormContentProps = PropsWithStyle<{
    dateRangePickerLocaleCode?: string;
    datesCheckInLabel?: string;
    datesCheckOutLabel?: string;
    datesInputFocusedInput?: null | 'startDate' | 'endDate';
    datesInputOnFocusChange?: Function;
    datesInputValue?: DateRange;
    getIsDayBlocked?: Function;
    guestsInputLabel?: string;
    guestsInputValue?: number;
    guestsPopupId?: string;
    isCalendarIconDisplayed?: boolean;
    isDateRangePickerLoading?: boolean;
    locationInputLabel?: string;
    locationInputValue?: string;
    locationOptions?: LocationOptions[];
    maximumGuestsInputValue?: number;
    willLocationDropdownOpenAbove?: boolean;
    onInputChange?: (name: InputDataNames, value: InputDataValues, inputState: InputState<unknown, InputDataValues>) => void; // InputProps[ 'onChange' ];
    onSubmit?: (/* data: ChangeInputData */) => void;
    searchButton?: FormProps[ 'searchButton' ];
    buttonText?: string;
    minimumNights: CalendarProps[ 'minimumNights' ];
}>;




// Omit<SearchBarFieldsProps, 'locationOptions'> & {
//     locationOptions: LocationOptions[];
//     onSubmit?: (/* data: ChangeInputData */) => void;
//     searchButton?: FormProps[ 'searchButton' ];
//     buttonText?: string;
// } & Pick<CalendarProps, 'minimumNights'>;
