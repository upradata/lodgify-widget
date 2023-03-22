// import { FormValue, FormValues } from '@lodgify/ui';
import { map } from '../../util';
import { InputsState, InputState } from './Form.props';
import { DomValue, PropsValidation, Validation } from './Form.validation';
// import { getEmptyRequiredInputs as _getEmptyRequiredInputs } from '@lodgify/ui/lib/es/components/collections/Form/utils/getEmptyRequiredInputs';
// import { getIsSubmitButtonDisabled as _getIsSubmitButtonDisabled } from '@lodgify/ui/lib/es/components/collections/Form/utils/getIsSubmitButtonDisabled';
// import { getValidationWithDefaults as _getValidationWithDefaults } from '@lodgify/ui/lib/es/components/collections/Form/utils/getValidationWithDefaults';


export const DEFAULT_IS_REQUIRED_MESSAGE = 'This field is required';
export const DEFAULT_IS_INVALID_MESSAGE = 'Invalid';


export const isRequiredError = (value: DomValue, validation: Validation) => {
    return validation.isRequired && validation.isEmpty(value);
};



export const getEmptyRequiredInputs = (propsValidation: PropsValidation, inputsState: InputsState): string[] => {
    return Object.entries(inputsState).reduce((list, [ inputName, { value } ]) => {
        if (isRequiredError(value, propsValidation[ inputName ]))
            return [ ...list, inputName ];

        return list;
    }, [] as string[]);
};


export const getEmptyState = (propsValidation: PropsValidation, intputsValues: InputsState) => {
    return map(intputsValues, (name, data) => {
        const { input } = propsValidation[ name ];
        return [ name, { ...data, value: input.type === 'date' /* name === 'dates' */ ? null : '' } ];
    });
};


export const processInputValue = (validation: Validation, inputValue: InputState) => {
    const { value } = inputValue;

    const getInputValue = (): Pick<InputState, 'isValid' | 'error' | 'transformedValue'> => {
        const requiredError = isRequiredError(value, validation);

        if (requiredError)
            return { isValid: false, error: validation.isRequiredMessage };

        const { value: transformedValue, error, isValid } = !validation.isEmpty(value) ?
            { ...validation.validate(value), isValid: true } :
            { error: false, isValid: false, value };

        if (error)
            return { isValid: false, error: error === true ? validation.invalidMessage : error };

        // both false => empty value
        return { isValid, error, transformedValue };
    };


    return { ...inputValue, ...getInputValue() };
};



export const isSubmitButtonDisabled = (inputsState: InputsState) => {
    return Object.values(inputsState).some(({ error }) => !!error);
};