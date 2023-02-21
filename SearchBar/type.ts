import { DateRange, LocationOptions } from '@lodgify/ui';
import { PropsWithStyleBase } from '../../util.types';

export class SearchFieldsProps extends PropsWithStyleBase {
    dateRangePickerLocaleCode?: string;
    datesCheckInLabel?: string;
    datesCheckOutLabel?: string;
    datesInputFocusedInput?: null | 'startDate' | 'endDate';
    datesInputOnFocusChange?: Function;
    datesInputValue?: DateRange;
    getIsDayBlocked?: Function;
    guestsInputValue?: number;
    isDateRangePickerLoading?: boolean;
    guestsInputLabel?: string;
    guestsPopupId?: string;
    isCalendarIconDisplayed?: boolean;
    locationInputLabel?: string;
    locationInputValue?: string;
    locationOptions?: LocationOptions[];
    maximumGuestsInputValue?: number;
    onInputChange?: Function;
    searchButton?: React.ReactNode;
    willLocationDropdownOpenAbove?: boolean;
};
