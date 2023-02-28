import { DateRange } from '@lodgify/ui';

export type ChangeInputData = {
    dates: DateRange;
    guests: number;
    location: string;
    // willLocationDropdownOpenAbove?: boolean;
};


export type InputDataValues = ChangeInputData[ keyof ChangeInputData ];
export type InputDataNames = keyof ChangeInputData;


export type PropertySearchData = {
    data: ChangeInputData;
    values: InputDataValues;
    names: InputDataNames;
};
