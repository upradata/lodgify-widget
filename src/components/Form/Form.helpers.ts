import { useContext } from 'react';
import { AppContext } from '../../App/AppContext';
import { map } from '../../util';

import type { InputsState, InputState } from './Form.state.type';
import type { GetValidation, Validation } from './Form.validation';


// import { getEmptyRequiredInputs as _getEmptyRequiredInputs } from '@lodgify/ui/lib/es/components/collections/Form/utils/getEmptyRequiredInputs';
// import { getIsSubmitButtonDisabled as _getIsSubmitButtonDisabled } from '@lodgify/ui/lib/es/components/collections/Form/utils/getIsSubmitButtonDisabled';
// import { getValidationWithDefaults as _getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';


export const DEFAULT_IS_REQUIRED_MESSAGE = 'This field is required';
export const DEFAULT_IS_INVALID_MESSAGE = 'Invalid';


export const isRequiredFieldEmpty = (value: unknown, validation: Validation) => {
    return validation.isRequired && validation.isEmpty(value);
};



export const getEmptyRequiredInputs = (inputsState: InputsState, getValidation: GetValidation): string[] => {
    return Object.entries(inputsState).reduce((list, [ inputName, { value } ]) => {
        if (isRequiredFieldEmpty(value, getValidation(inputName)))
            return [ ...list, inputName ];

        return list;
    }, [] as string[]);
};


export const getEmptyState = (intputsValues: InputsState, getValidation: GetValidation) => {
    return map(intputsValues, (name, data) => {
        const { emptyValue } = getValidation(name);
        return [ name, { ...data, value: emptyValue } ];
    });
};


export const useProcessInputValue = () => {
    const context = useContext(AppContext);
    const logError = context.isDebug ? context.logError : () => { };

    return (options: { validation: Validation; hasNewValue: boolean; inputValue: InputState; state: InputsState; }) => {

        const { validation, hasNewValue, inputValue, state } = options;

        const getInputValue = (): Pick<InputState, 'isValid' | 'error' | 'isEmpty' | 'transformedValue'> => {
            if (!hasNewValue)
                return {};

            const newValue = inputValue.value;

            const requiredError = isRequiredFieldEmpty(newValue, validation);
            const isEmpty = validation.isEmpty(newValue);

            if (requiredError)
                return { isValid: false, error: validation.isRequiredMessage, isEmpty };

            const validatedValue = !isEmpty ?
                { ...validation.validate(newValue, state), isValid: true } :
                { error: false, isValid: false };

            const { error } = validatedValue;

            if (error) {
                const message = error === true ? validation.invalidMessage : error;
                logError(message);

                return { isValid: false, isEmpty, error: validation.invalidMessage };
            }

            // both false => empty value
            // no transformedValue => by default, transformedValue = value (identity)
            return { ...validatedValue, isEmpty, transformedValue: validatedValue.transformedValue || newValue, error: false };
        };


        return { ...inputValue, ...getInputValue() };
    };
};


export type ProcessInputValue = ReturnType<typeof useProcessInputValue>;


export const isSubmitButtonDisabled = (inputsState: InputsState, getValidation: GetValidation) => {
    const emptyRequiredInputs = getEmptyRequiredInputs(inputsState, getValidation);

    if (emptyRequiredInputs.length > 0)
        return true;

    const values = Object.values(inputsState);
    return values.length === 0 || values.some(({ error }) => !!error);
};
