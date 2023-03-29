import { InputState } from '../Form';

import type { StrictInputProps } from 'semantic-ui-react';
import type { Omit } from '../../util.types';


export class StrictInputControllerProps<V = unknown, Args extends unknown[] = unknown[]> {
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
    // children: React.ReactElement;
    ////
    as?: React.ElementType | string;
    showErrorMessage?: 'typing' | 'blur';
    isDirty?: boolean;
    className?: string;
    adaptOnChangeEvent?: (...args: Args) => V;
    onChange?: (name: string, value: V) => void;
    // initialValue?: V;
    onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
    hasFocusAndBlur?: boolean;
    useValidCheckOnValid?: boolean;
}



export class StrictInputControllerPropsWithInputState<V = unknown, Args extends unknown[] = unknown[]> implements Partial<StrictInputControllerProps<V, Args>>, InputState {
    constructor() {
        Object.assign(this, new StrictInputControllerProps());
        Object.assign(this, new InputState());
    }
} { }

export type InputControllerProps<V = unknown, Args extends unknown[] = unknown[]> =
    // Omit<LodgifyInputControllerProps, 'children' | 'onChange' | 'adaptOnChangeEvent'> &
    StrictInputControllerProps<V, Args> &
    Omit<StrictInputProps, 'className' | 'fluid' | 'error' | 'onChange'>;



type ICChildDataProps = {
    value?: unknown;
    onChangeName?: string;
    onChange?: (name: string, value: unknown) => void;
    hasFocusAndBlur?: boolean;
};

type ICChildDefaultProps = {
    value: unknown;
    onChangeName: 'onChange';
    onChange: (name: string, value: unknown) => void;
    hasFocusAndBlur: true;
};

type WithDefault<
    Data extends ICChildDataProps,
    P extends keyof Data,
    Defaults extends ICChildDataProps = ICChildDefaultProps
> = P extends keyof Data ? Data[ P ] : Defaults[ P & keyof Defaults ];


export type InputControllerChildProps<ChildProps extends object = {}, Data extends ICChildDataProps = {}> =
    ChildProps &
    { value?: WithDefault<Data, 'value'>; } &
    (WithDefault<Data, 'hasFocusAndBlur'> extends true ? {
        onFocus?: StrictInputControllerProps[ 'onFocus' ];
        onBlur?: StrictInputControllerProps[ 'onBlur' ];
    } : {}) &
    {
        [ Name in WithDefault<Data, 'onChangeName'> ]?: WithDefault<Data, 'onChange'>;
    };
