import type { FormProps as LodgifyFormProps } from '@lodgify/ui';
import type { StrictFormProps } from 'semantic-ui-react';
import type { Omit } from '../../util.types';


export type FormProps<Values = unknown> = Omit<LodgifyFormProps<Values>, 'headingText'> & {
    onInputChange?: (name: string, value: Values) => void;
    searchButton?: React.ReactNode | ((props: { isDisabled: boolean; }) => React.ReactNode);
} & Omit<StrictFormProps, 'onSubmit'>;
