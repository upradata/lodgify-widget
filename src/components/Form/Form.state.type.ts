export type InputState<InputValue = unknown, TrasnformedValue = InputValue> = {
    isBlurred?: boolean;
    value?: InputValue;
    transformedValue?: TrasnformedValue;
    isValid?: boolean;
    error?: boolean | string;
};

export type InputsState<InputValues extends Record<string, unknown> = Record<string, unknown>> = {
    [ K in keyof InputValues ]: InputState<InputValues[ K ]>
};
