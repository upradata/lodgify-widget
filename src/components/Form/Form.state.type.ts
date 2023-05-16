export class InputState<InputValue = unknown, TransformedValue = InputValue>  {
    isBlurred?: boolean;
    value?: InputValue;
    transformedValue?: TransformedValue;
    isValid?: boolean;
    isEmpty?: boolean;
    error?: boolean | string;
};

export type InputsState<InputValues extends Record<string, unknown> = Record<string, unknown>> = {
    [ K in keyof InputValues ]: InputState<InputValues[ K ]>
};


export type InputStateAction = InputState & { type: 'init' | 'update'; };
export type SetInputState = (inputName: string, inputState: InputStateAction) => void;
