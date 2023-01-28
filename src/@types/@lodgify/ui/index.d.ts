declare module '@lodgify/ui' {
    import React from 'react';
    import { Moment } from 'moment';

    type PropsWithStyle<P = {}> = P & { style?: React.CSSProperties; };
    export type LocationOptions = {
        content?: React.ReactNode;
        imageSizes?: string;
        imageSrcSet?: string;
        imageUrl?: string;
        indent?: 0 | 1 | 2 | 3 | 4 | 5;
        text: string;
        value?: boolean | number | string;
        label?: string;
    };

    export type DateRange<D = Moment> = { startDate: D; endDate: D; };

    export type SearchBarProps<Location extends string = string> = PropsWithStyle<{
        className?: string;
        dateRangePickerLocaleCode?: string;
        datesCheckInLabel?: string;
        datesCheckOutLabel?: string;
        datesInputFocusedInput?: null | 'startDate' | 'endDate';
        datesInputOnFocusChange?: Function;
        datesInputValue?: DateRange;
        getIsDayBlocked?: Function;
        guestsInputValue?: string;
        isDateRangePickerLoading?: boolean;
        onChangeInput?: (data: {
            dates: DateRange;
            guests: number;
            location: Location;
            willLocationDropdownOpenAbove: boolean;
        }) => void | Promise<void>;
        onSubmit?: Function;
        searchBarDatesCheckInLabel?: string;
        searchBarDatesCheckOutLabel?: string;
        searchBarGuestsInputLabel?: string;
        searchBarMaximumGuestsInputValue?: number;
        searchButton?: React.ReactNode;
        guestsInputLabel?: string;
        guestsPopupId?: string;
        isCalendarIconDisplayed?: boolean;
        isFixed?: boolean;
        isStackable?: boolean;
        locationInputLabel?: string;
        locationInputValue?: string;
        locationOptions?: LocationOptions[];
        maximumGuestsInputValue?: number;
        isDisplayedAsModal?: boolean;
        isModalOpen?: boolean;
        modalHeadingText?: string;
        modalSummaryElement?: React.ReactNode;
        summaryElement?: React.ReactNode;
        willLocationDropdownOpenAbove?: boolean;
    }>;



    export type ShowOnProps = PropsWithStyle<{
        children?: React.ReactNode;
        computer?: boolean;
        mobile?: boolean;
        tablet?: boolean;
        widescreen?: boolean;
        parent?: React.ReactNode | Function;
        parentProps?: object;

    }>;
    export const ShowOn: React.ComponentType<ShowOnProps>;
    export const SearchBar: React.ComponentType<{ [ K: string ]: any; }>;

    export type SummaryProps = PropsWithStyle<{
        propertyName: string;
        locationName: string;
        areOnlyNightPriceAndRatingDisplayed?: boolean;
        isShowingPlaceholder?: boolean;
        periodText?: string;
        pricePerPeriod?: string;
        pricePerPeriodPrefix?: string;
        ratingNumber?: number;
    }>;
    export const Summary: React.ComponentType<SummaryProps>;

    export type ButtonProps = PropsWithStyle<{
        children: React.ReactNode;
        hasShadow?: boolean;
        icon?: string;
        isCompact?: boolean;
        isDisabled?: boolean;
        isFluid?: boolean;
        isFormSubmit?: boolean;
        isLoading?: boolean;
        isOutlined?: boolean;
        isPositionedRight?: boolean;
        isRounded?: boolean;
        isSecondary?: boolean;
        onClick?: Function;
        size?: string;
    }>;

    export const Button: React.ComponentType<ButtonProps>;
    export const TextPlaceholder: React.ComponentType<{ [ K: string ]: any; }>;
    export const Viewport: React.ComponentType<{ [ K: string ]: any; }>;
    export const DateRangePicker: React.ComponentType<{ [ K: string ]: any; }>;
    export const Dropdown: React.ComponentType<{ [ K: string ]: any; }>;
    export const HorizontalGutters: React.ComponentType<{ [ K: string ]: any; }>;
    export const VerticalGutters: React.ComponentType<{ [ K: string ]: any; }>;

    export type SearchFieldsProps = {
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
    export const SearchFields: React.ComponentType<SearchFieldsProps>;
    export const SearchModal: React.ComponentType<{ [ K: string ]: any; }>;
    export const Heading: React.ComponentType<{ [ K: string ]: any; }>;

    export type FormProps = {
        actionLink?: {
            onClick?: Function,
            text: React.ReactNode;
        };
        autoComplete?: 'on' | 'off';
        children: React.ReactNode;
        errorMessage?: string;
        headingText?: string;
        onSubmit?: Function;
        submitButtonText?: string;
        successMessage?: string;
        validation?: Record<string, {
            getIsEmpty?: Function;
            getIsValid?: Function;
            invalidMessage?: string;
            isRequired?: boolean;
            isRequiredMessage?: string;
        }>;
    };

    export const Form: React.ComponentType<FormProps>;
    export const InputGroup: React.ComponentType<{ [ K: string ]: any; }>;

    export type ModalProps = PropsWithStyle<{
        children: React.ReactNode;
        className?: string;
        closeIcon?: React.ReactNode;
        hasCloseIcon?: boolean;
        hasPadding?: boolean;
        hasRoundedCorners?: boolean;
        header?: React.ReactNode;
        isClosingOnDimmerClick?: boolean;
        isFullscreen?: boolean;
        isOpen?: boolean;
        onClose?: Function;
        size?: 'mini' | 'tiny' | 'small' | 'large';
        trigger?: React.ReactNode;
    }>;

    export const Modal: React.ComponentType<ModalProps>;
    export const NumberInput: React.ComponentType<{ [ K: string ]: any; }>;
    export const Paragraph: React.ComponentType<{ [ K: string ]: any; }>;
    export const TextInput: React.ComponentType<{ [ K: string ]: any; }>;

    export type InputControllerProps = {
        adaptOnChangeEvent?: Function;
        children: React.ReactNode;
        error?: boolean | string;
        icon?: React.ReactNode;
        inputOnChangeFunctionName?: string;
        isCompact?: boolean;
        isFluid?: boolean;
        isFocused?: boolean;
        isValid?: boolean;
        mapValueToProps?: Function;
        name: string;
        onChange?: Function;
        value?: boolean | string | number | object | Array<unknown>;
    };
}
