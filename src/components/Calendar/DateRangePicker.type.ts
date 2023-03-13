import type { DateRange, FormValue as LodgifyFormValue } from '@lodgify/ui';


class InputProps<V = unknown> {
    name?: string;
    onBlur?: (event?: FocusEvent) => any;
    onChange?: (name: string, value: V) => any;
    width?: string;
    label?: string;
};

class FormValue<V = unknown> extends InputProps implements Required<LodgifyFormValue> {
    isBlurred: boolean;
    value: V;
    isValid: boolean;
    error: boolean | string;
};


export class DateRangePickerProps extends (FormValue as (new () => Partial<FormValue>)) {
    displayFormat?: string | Function;
    endDatePlaceholderText?: string;
    error?: string | boolean;
    focusedInput?: null | 'startDate' | 'endDate';
    getIsDayBlocked?: Function;
    // initialValue?: DateRange;
    isCalendarIconDisplayed?: boolean;
    isLoading?: boolean;
    isValid?: boolean;
    localeCode?: string;
    name?: string;
    onFocusChange?: Function;
    startDatePlaceholderText?: string;
    value?: DateRange;
    willOpenAbove?: boolean;
    // windowInnerWidth?: number;
};
