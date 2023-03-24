import { InputProps } from '../../types';

import type { IconNames } from '@lodgify/ui';
import type { DropdownOnSearchChangeData, StrictDropdownItemProps, StrictDropdownProps } from 'semantic-ui-react';
import type { Omit as MyOmit } from '../../util.types';


type Value = boolean | number | string;
type ValueOf<T> = T extends ReadonlyArray<infer U> ? U : T;

// value: Value | Value[] can be an array for multiple selection if enabled
export class LodgifyDropdownProps<V extends Value | Value[] = Value | Value[], ItemProps = {}> extends (
    InputProps as (new () => Partial<MyOmit<InputProps, 'value' | 'onChange' | 'onBlur'>>)
) {
    style?: React.CSSProperties;
    className?: string;
    error?: boolean | string;
    // DropdownItemProps
    getOptionsWithSearch?: DropdownSearchOptionsFn<ValueOf<V>, ItemProps>;
    icon?: IconNames;
    initialValue?: V;
    isClearable?: boolean;
    isCompact?: boolean;
    isDisabled?: boolean;
    isSearchable?: boolean;
    isValid?: boolean;
    label?: string;
    // noResultsText?: string;
    options?: {
        content?: React.ReactNode;
        imageSizes?: string;
        imageSrcSet?: string;
        imageUrl?: string;
        indent?: 0 | 1 | 2 | 3 | 4 | 5;
        label?: string;
        text: React.ReactNode;
        value?: ValueOf<V>;
    }[];
    value?: V;
    willOpenAbove?: boolean;
    onFocus?: (name: string, event: React.SyntheticEvent) => void;
    onBlur?: (name: string, event: React.SyntheticEvent) => void;
    onChange?: (name: string, value: V, event: React.SyntheticEvent) => void;
    autoComplete?: string;
    ref?: React.ForwardedRef<DropdownRef<V, ItemProps>>;
};


type SemanticDropdownState<V extends Value | Value[] = Value | Value[]> = {
    value?: V;
    searchQuery?: string;
    selectedLabel?: string;
    upward?: boolean;
    open?: boolean;
    focus?: boolean;
    selectedIndex?: number;
};

type SemanticDropdownComponentElement<V extends Value | Value[] = Value | Value[]> =
    React.Component<
        StrictDropdownProps,
        SemanticDropdownState<V>
    >
    & React.ReactElement<StrictDropdownProps, React.ComponentClass<StrictDropdownProps>>;


export type DropdownRef<V extends Value | Value[] = Value | Value[], ItemProps = {}> = /* InstanceType<typeof SemanticDropdown> */
    SemanticDropdownComponentElement<V> & {
        handleItemClick: (event: React.SyntheticEvent, item: DropdownItemProps<ValueOf<V>, ItemProps>) => void;
        clearSearchQuery: () => void;
    };


export type DropdownItemProps<V extends Value = Value, P = {}> = Omit<StrictDropdownItemProps, 'value'> & { value?: V; } & P;
export type DropdownSearchOptionsFn<V extends Value = Value, P = {}> = (options: DropdownItemProps<V, P>[], value: V) => DropdownItemProps<V, P>[];


export type SemanticDropdownProps<V extends Value | Value[] = Value | Value[], ItemProps = {}> = MyOmit<
    StrictDropdownProps, 'onSearchChange' | 'search'
//Exclude<keyof LodgifyDropdownProps | 'onSearchChange' | 'search', 'ref' | 'onChange' | 'onBlur' | 'icon' | 'options' |'value'>
> & {
    onSearchChange?: (
        event: React.SyntheticEvent<HTMLElement, InputEvent>,
        data: MyOmit<DropdownOnSearchChangeData, 'value'> & { value?: V; }
    ) => void;
    search?: boolean | LodgifyDropdownProps<V, ItemProps>[ 'getOptionsWithSearch' ];
    ref?: LodgifyDropdownProps<V, ItemProps>[ 'ref' ];
};

export type DropdownProps<V extends Value | Value[] = Value | Value[], ItemProps = {}> =
    LodgifyDropdownProps<V, ItemProps> &
    MyOmit<SemanticDropdownProps<V, ItemProps>, 'onChange' | 'onFocus' | 'onBlur' | 'options'>;


export type DropdownSearchInput = {
    /** An element type to render as (string or function). */
    as?: React.ComponentType;

    /** An input can have the auto complete. */
    autoComplete?: string;

    /** Additional classes. */
    className?: string;

    /** An input can receive focus. */
    tabIndex?: number | string;

    /** The HTML input type. */
    type?: string;

    /** Stored value. */
    value?: number | string;
};
