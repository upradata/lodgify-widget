import { useContext } from 'react';
import { AppContext } from '../../App/AppContext';
import { map } from '../../util';

import type { InputsState, InputState } from './Form.state.type';
import type { Validation } from './Form.validation';


// import { getEmptyRequiredInputs as _getEmptyRequiredInputs } from '@lodgify/ui/lib/es/components/collections/Form/utils/getEmptyRequiredInputs';
// import { getIsSubmitButtonDisabled as _getIsSubmitButtonDisabled } from '@lodgify/ui/lib/es/components/collections/Form/utils/getIsSubmitButtonDisabled';
// import { getValidationWithDefaults as _getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';


export const DEFAULT_IS_REQUIRED_MESSAGE = 'This field is required';
export const DEFAULT_IS_INVALID_MESSAGE = 'Invalid';


export const isRequiredError = (value: unknown, validation: Validation) => {
    return validation.isRequired && validation.isEmpty(value);
};



export const getEmptyRequiredInputs = (getValidation: (name: string | number) => Validation, inputsState: InputsState): string[] => {
    return Object.entries(inputsState).reduce((list, [ inputName, { value } ]) => {
        if (isRequiredError(value, getValidation(inputName)))
            return [ ...list, inputName ];

        return list;
    }, [] as string[]);
};


export const getEmptyState = (getValidation: (name: string | number) => Validation, intputsValues: InputsState) => {
    return map(intputsValues, (name, data) => {
        const { input } = getValidation(name);
        return [ name, { ...data, value: input.type === 'date' /* name === 'dates' */ ? null : '' } ];
    });
};


export const useProcessInputValue = () => {
    const context = useContext(AppContext);
    const logError = context.isDebug ? context.logError : () => { };

    return (options: { validation: Validation; hasNewValue: boolean; inputValue: InputState; state: InputsState; }) => {

        const { validation, hasNewValue, inputValue, state } = options;

        const getInputValue = (): Pick<InputState, 'isValid' | 'error' | 'transformedValue'> => {
            if (!hasNewValue)
                return {};

            const newValue = inputValue.value;

            const requiredError = isRequiredError(newValue, validation);

            if (requiredError)
                return { isValid: false, error: validation.isRequiredMessage };

            const { value: transformedValue, error, isValid } = !validation.isEmpty(newValue) ?
                { ...validation.validate(newValue, state), isValid: true } :
                { error: false, isValid: false, value: newValue };

            if (error) {
                const message = error === true ? validation.invalidMessage : error;
                logError(message);

                return { isValid: false, error: validation.invalidMessage };
            }

            // both false => empty value
            return { isValid, error, transformedValue };
        };


        return { ...inputValue, ...getInputValue() };
    };
};



export const isSubmitButtonDisabled = (inputsState: InputsState) => {
    return Object.values(inputsState).some(({ error }) => !!error);
};
