import { TextInputProps as LodgifyTextInputProps } from '@lodgify/ui';
import { fragments } from '../../util';
import { InputController, InputControllerProps, StrictInputControllerPropsWithInputState } from '../InputController';

type TextInputProps = LodgifyTextInputProps & Partial<InputControllerProps>;

export const TextInput: React.FunctionComponent<TextInputProps> = props => {
    const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
        autoComplete: props.autoComplete,
        maxLength: props.maxCharacters,
       // name: props.name,
        // onBlur: props.onBlur,
        placeholder: props.label,
        type: props.type
    };

    const [ inputControllerProps ] = fragments(props,
        StrictInputControllerPropsWithInputState
         // [ 'autoComplete', 'maxCharacters', 'name', /* 'onBlur', */ 'label', 'type' ]
         );

    return (
        <InputController showErrorMessage="blur" useValidCheckOnValid={false} {...inputControllerProps} name={props.name}>
            <input {...inputProps} />
        </InputController>
    );
};

TextInput.displayName = 'TextInput';
