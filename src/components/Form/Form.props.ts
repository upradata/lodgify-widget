import type { FormProps as LodgifyFormProps, FormValues } from '@lodgify/ui';
import type { StrictFormProps } from 'semantic-ui-react';
import type { Omit } from '../../util.types';


export type FormProps<Values = unknown> = Omit<LodgifyFormProps<Values>, 'headingText'> & {
    onInputChange?: (name: string, value: Values) => void;
    searchButton?: React.ReactElement; // | ((props: { isDisabled: boolean; }) => React.ReactNode);
    isSubmitDisabled?: (inputsState: FormValues<string, Values>) => boolean;
} & Omit<StrictFormProps, 'onSubmit'>;
