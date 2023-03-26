type PropsWithStyle<P = {}> = P & {
    style?: React.CSSProperties;
    className?: string;
};


declare module '@lodgify/ui' {
    import type React from 'react';
    import type { Moment } from 'moment';
    // import type { PropsWithStyle } from '../../../util.types';
    // import { ModalProps as ModalPropsClass } from './types';
    /* import { type } from '../../../App/PropertyContext';
export type PropsWithStyle<P = {}> = P & {
        style?: React.CSSProperties;
        className?: string;
    }; */

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


    export type SearchBarFieldsProps = PropsWithStyle<{
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
        searchButton?: React.ReactNode;
        willLocationDropdownOpenAbove?: boolean;
        onInputChange?: InputProps[ 'onChange' ];
    }>;


    export type SearchBarProps<Location extends string = string> = Omit<SearchBarFieldsProps, 'onChange'> & PropsWithStyle<{
        onInputChange?: (data: {
            dates: DateRange;
            guests: number;
            location: Location;
            willLocationDropdownOpenAbove: boolean;
        }) => void;
        onSubmit?: Function;
        searchBarDatesCheckInLabel?: string;
        searchBarDatesCheckOutLabel?: string;
        searchBarGuestsInputLabel?: string;
        searchBarMaximumGuestsInputValue?: number;
        locationInputLabel?: string;
        locationInputValue?: string;
        locationOptions?: LocationOptions[];
        isDisplayedAsModal?: boolean;
        isModalOpen?: boolean;
        modalHeadingText?: string;
        modalSummaryElement?: React.ReactNode;
        summaryElement?: React.ReactNode;
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
        // 
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

    export type TextPlaceholderProps = PropsWithStyle<{
        isFluid?: boolean;
        length?: 'short' | 'medium' | 'long' | 'full';
    }>;

    export const TextPlaceholder: React.ComponentType<TextPlaceholderProps>;


    export type BlockPlaceholderProps = PropsWithStyle<{
        isFluid?: boolean;
        isRectangular?: boolean;
        isSquare?: boolean;
    }>;
    export const BlockPlaceholder: React.ComponentType<BlockPlaceholderProps>;

    export const Viewport: React.ComponentType<{ [ K: string ]: any; }>;

    export type DateRangePickerProps = PropsWithStyle<{
        displayFormat?: string | Function;
        endDatePlaceholderText?: string;
        error?: string | boolean;
        focusedInput?: null | 'startDate' | 'endDate';
        getIsDayBlocked?: Function;
        initialValue?: DateRange;
        isCalendarIconDisplayed?: boolean;
        isLoading?: boolean;
        isValid?: boolean;
        localeCode?: string;
        name?: string;
        onBlur?: Function;
        onChange?: Function;
        onFocusChange?: Function;
        startDatePlaceholderText?: string;
        value?: DateRange;
        willOpenAbove?: boolean;
        windowInnerWidth?: number;
    }> & InputProps;

    export const DateRangePicker: React.ComponentType<DateRangePickerProps>;

    export type CounterDropdownProps = PropsWithStyle<{
        counterName?: string;
        counterValue?: number;
        dropdownLabel?: string;
        maximumCounterValue?: number;
        onChange?: Function;
        popupId?: string;
        willOpenAbove?: boolean;
    }> & InputProps;

    export const CounterDropdown: React.ComponentType<CounterDropdownProps>;

    export const HorizontalGutters: React.ComponentType<{ [ K: string ]: any; }>;
    export const VerticalGutters: React.ComponentType<{ [ K: string ]: any; }>;


    type Directions = 'down' | 'left' | 'right' | 'up';

    export type IconProps = PropsWithStyle<{
        labelText?: string;
        color?: 'black' | 'blue' | 'brown' | 'green' | 'grey' | 'light grey' | 'olive' | 'orange' | 'pink' | 'primary' | 'purple' | 'red' | 'teal' | 'violet' | 'yellow';
        hasBorder?: boolean;
        isButton?: boolean;
        isCircular?: boolean;
        isColorInverted?: boolean;
        isDisabled?: boolean;
        isLabelLeft?: boolean;
        labelText?: string;
        labelWeight?: 'heavy' | 'light',
        name?: `arrow ${Directions}` | `chevron ${Directions}` | `caret ${Directions}` |
        'baby crib' | 'bars' | 'bathroom' | 'bedroom door' |
        'bed linen' | 'blog' | 'bus' | 'calendar' |
        'checkmark' | 'checkmark circle' | 'check in' | 'check out' |
        'coffee' | 'cooking' | 'couch' | 'credit card' |
        'double bed' | 'entertainment' | 'facebook' | 'filter' |
        'fire' | 'further info' | 'google plus' | 'guests' |
        'heating' | 'home' | 'info' | 'instagram' |
        'laundry' | 'leaf' | 'linkedin' | 'list' |
        'location' | 'loft bed' | 'map pin' | 'minus' |
        'no children' | 'parking' | 'paw' | 'phone' |
        'pinterest' | 'placeholder' | 'plane' | 'plus' |
        'port' | 'question mark' | 'road' | 'search' |
        'single bed' | 'spinner' | 'square' | 'star' |
        'sun' | 'train' | 'twitter' | 'underground' |
        'users' | 'wheelchair' | 'wifi' | 'youtube';
        path?: string;
        size?: 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive';
    }>;


    export type IconNames = IconProps[ 'name' ];
    export const Icon: React.ComponentType<IconProps>;


    export type CheckboxProps = PropsWithStyle<{
        isChecked?: boolean;
        isCompact?: boolean;
        isDisabled?: boolean;
        isFluid?: boolean;
        isLabelLeft?: boolean;
        isRadioButton?: boolean;
        isToggle?: boolean;
        onClick?: Function,
    }> & InputProps<boolean | string>;


    export const Checkbox: React.ComponentType<CheckboxProps>;

    export type SearchFieldsProps = PropsWithStyle<{
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
    }>;
    export const SearchFields: React.ComponentType<SearchFieldsProps>;
    export const SearchModal: React.ComponentType<{ [ K: string ]: any; }>;
    export const Heading: React.ComponentType<{ [ K: string ]: any; }>;

    export type Validation = {
        getIsEmpty: (value: string) => boolean;
        getIsValid: (value: string) => boolean;
        invalidMessage?: string;
        isRequired: boolean;
        isRequiredMessage?: string;
    };

    export type FormProps<
        Names extends string = string,
        Values = unknown,
        V extends Record<string, Partial<Validation>> = Record<string, Partial<Validation>>
    > = PropsWithStyle<{
        actionLink?: {
            onClick?: Function;
            text: React.ReactNode;
        };
        autoComplete?: 'on' | 'off';
        children: boolean | React.ReactChild | React.ReactNodeArray | React.ReactPortal; //  Exclude<React.ReactNode, React.ReactFragment>;
        errorMessage?: string;
        headingText?: string;
        onSubmit?: (values: FormValues<Names, Values>) => void;
        submitButtonText?: string;
        successMessage?: string;
        validation?: V;
        // ref?: React.MutableRefObject<typeof Form>;
    }>;

    export type FormValue<V = unknown> = {
        isBlurred?: boolean;
        value?: V;
        isValid?: boolean;
        error?: boolean | string;
    };

    export type FormValues<Names extends string = string, V = unknown> = {
        [ InputName in Names ]: FormValue<V>;
    };

    export const Form: ForwardRefExoticComponent<PropsWithoutRef<FormProps> & RefAttributes<{}>>;
    // React.ComponentType<FormProps>;
    //  export const Form: React.ComponentClass<FormProps; { [ InputName: string ]: { isBlurred?: boolean; value?: any; error?: boolean; }; }>;
    export const InputGroup: React.ComponentType<{ [ K: string ]: any; }>;

    export type InputProps<V = unknown> = {
        name?: string;
        onBlur?: React.DOMAttributes<Element>[ 'onBlur' ]; // (event: FocusEvent) => void;
        onChange?: (name: string, value: V) => void;
        width?: string;
        label?: string;
        value?: V;
        inputValue?: V;
    };

    export type DropdownProps = PropsWithStyle<{
        error?: boolean | string;
        // DropdownItemProps
        getOptionsWithSearch?: boolean | ((options: {}[], value: string) => {}[]);
        icon?: string;
        initialValue?: boolean | number | string;
        isClearable?: boolean;
        isCompact?: boolean;
        isDisabled?: boolean;
        isSearchable?: boolean;
        isValid?: boolean;
        label?: string;
        noResultsText?: string;
        onFocus?: (name?: string) => void;
        options?: {
            content?: React.ReactNode;
            imageSizes?: string;
            imageSrcSet?: string;
            imageUrl?: string;
            indent?: 0 | 1 | 2 | 3 | 4 | 5;
            label?: string;
            text: React.ReactNode;
            value?: boolean | number | string;
        }[];
        value?: boolean | number | string;
        willOpenAbove?: boolean;
        ref?: Dropdown;
    }> & InputProps;

    export const Dropdown: React.ComponentType<DropdownProps>;

    export type NumberInputProps = {
        autoComplete?: string;
        error?: boolean | string;
        icon?: React.ReactElement;
        isValid?: boolean;
        label?: string;
        max?: number;
        min?: number;
    } & InputProps<boolean | string | number>;

    export const NumberInput: React.ComponentType<NumberInputProps>;

    export type TextInputProps = PropsWithStyle<{
        autoComplete?: string;
        error?: boolean | string;
        isFluid?: boolean;
        isValid?: boolean;
        maxCharacters?: number;
        type?: string;
    }> & InputProps<string>;

    export const TextInput: React.ComponentType<TextInputProps>;

    export type TextAreaProps = PropsWithStyle<{
        autoComplete?: string;
        error?: boolean | string;
        isValid?: boolean;
        label?: string;
        maxCharacters?: number;
        name?: string;
        onBlur?: Function;
        onChange?: Function;
        value?: string;
    }> & InputProps;

    export const TextArea: TextArea.ComponentType<TextAreaProps>;


    export type InputControllerProps = {
        adaptOnChangeEvent?: (...args: unknown[]) => unknown;
        error?: boolean | string;
        icon?: React.ReactNode;
        inputOnChangeFunctionName?: string;
        isCompact?: boolean;
        isFluid?: boolean;
        isFocused?: boolean;
        isValid?: boolean;
        mapValueToProps?: (v: unknown) => Record<string, unknown>;
        value?: unknown; // boolean | string | number | object | Array<unknown>;
        name: string;
        onChange?: InputProps[ 'onChange' ];
        children: React.ReactElement;
    };


    // export type ModalProps = ModalPropsClass;
    export type ModalProps = PropsWithStyle<{
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
    /*   export class ModalProps {
          style?: React.CSSProperties;
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
      }; */

    export const Modal: React.ComponentType<ModalProps>;
    export const FlexContainer: React.ComponentType<{ [ K: string ]: any; }>;
    export const NumberInput: React.ComponentType<{ [ K: string ]: any; } & InputProps>;
    export const Paragraph: React.ComponentType<{ [ K: string ]: any; }>;
    export const Link: React.ComponentType<{ [ K: string ]: any; }>;
    export const ErrorMessage: React.ComponentType<{ [ K: string ]: any; }>;
}


declare module '@lodgify/ui/lib/es/components/inputs/TextArea' {
    export type TextAreaProps = PropsWithStyle<{
        autoComplete?: string;
        error?: boolean | string;
        isValid?: boolean;
        label?: string;
        maxCharacters?: number;
        name?: string;
        onBlur?: Function;
        onChange?: Function;
        value?: string;
    }>;

    export const TextArea: TextArea.ComponentType<TextAreaProps>;
}
