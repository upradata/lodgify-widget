import type { LocationOptions, SearchBarFieldsProps } from '@lodgify/ui';
import type { CalendarProps } from '../Calendar';
import type { ChangeInputData, InputDataNames, InputDataValues } from './PropertyBookingForm.type';
import type { FormProps } from '../Form';


export type PropertyBookingFormProps = Omit<PropertyBookingFormContentProps, 'onInputChange'> & {
    onSubmit?: (data: ChangeInputData) => void;
    onInputChange?: (name: InputDataNames, value: InputDataValues, data: ChangeInputData) => void;
    searchButton?: FormProps[ 'searchButton' ];
    isCompact?: boolean;
};


export type PropertyBookingFormContentProps = Omit<SearchBarFieldsProps, 'locationOptions'> & {
    locationOptions: LocationOptions[];
    onSubmit?: (data: ChangeInputData) => void;
    searchButton?: FormProps[ 'searchButton' ];
    buttonText?: string;
} & Pick<CalendarProps, 'minimumNights'>;
