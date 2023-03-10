import './PropertyBookingForm.scss';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import classnames from 'classnames';
// import isEqual from 'fast-deep-equal';
import { PropertyBookingFormContent } from './PropertyBookingFormContent';

import type { InputDataNames, InputDataValues } from './PropertyBookingForm.type';
import type { PropertyBookingFormContentProps, PropertyBookingFormProps } from './PropertyBookingForm.props';
import { ContainerContext } from '../Container/ContainerContext';


// import Form from 'semantic-ui-react/dist/es/collections/Form/Form.js';
// import { SearchFields } from '@lodgify/ui/lib/es/components/general-widgets/SearchBar/components/SearchFields';
// import { usePrevious } from '../../util';


// type InputDataValueOf<Name extends InputDataNames> = ChangeInputData[ Name ];
// export type PropertySearchDataValueOf<Name extends InputDataNames> = InputDataValueOf<Name>;




export const PropertyBookingForm: React.FunctionComponent<PropertyBookingFormProps> = ({
    onSubmit, onInputChange: onChange, isCompact, ...props
}) => {

    // const [ isDropdownOpenAbove, setDropdownOpenAbove ] = useState(willLocationDropdownOpenAbove);

    /* const ref = useRef<HTMLDivElement>();

    const handleScroll = useCallback(() => {
        setDropdownOpenAbove(getWillLocationDropdownOpenAbove(ref.current, isDropdownOpenAbove));
    }, [ ref.current, willLocationDropdownOpenAbove ]);

    useEffect(() => {
        global.document.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            global.document.removeEventListener('scroll', handleScroll);
        };
    }, []); */

    const [ state, setState ] = useState({
        dates: props.datesInputValue,
        guests: props.guestsInputValue,
        location: props.locationInputValue,
        // willLocationDropdownOpenAbove
    });

    // const [ stateNameChanged, setStateNameChanged ] = useState<{ name: InputDataNames | null; }>({ name: null });

    const onInputChange = useCallback((name: InputDataNames, value: InputDataValues) => {
        setState(state => {
            const newState = { ...state, [ name ]: value };
            onChange?.(name, value, newState);
            return newState;
        });

        // setStateNameChanged({ name });
    }, [ onChange /* , setStateNameChanged  */ ]);

    /* useEffect(() => {
        const { name } = stateNameChanged;

        if (name)
            onChange?.(name, state[ name ], state);
    }, [ stateNameChanged, onChange ]); */


    const handleSubmit = useCallback(() => { onSubmit?.(state); }, [ onSubmit, state ]);


    // const previousProps = usePrevious(props);

    /* useEffect(() => {
        if (previousProps) {
            const previousInputValueProps = {
                dates: previousProps.datesInputValue,
                guests: previousProps.guestsInputValue,
                location: previousProps.locationInputValue
            };

            const currentInputValueProps = {
                dates: props.datesInputValue,
                guests: props.guestsInputValue,
                location: props.locationInputValue
            };

            if (!isEqual(previousInputValueProps, currentInputValueProps)) {
                setState(prev => ({ ...prev, ...currentInputValueProps }));
            }
        }
    }, [ props, previousProps ]); */


    const formProps: PropertyBookingFormContentProps = {
        ...props,
        datesInputValue: state.dates,
        guestsInputValue: state.guests,
        locationInputValue: state.location,
        willLocationDropdownOpenAbove: props.willLocationDropdownOpenAbove,
        onSubmit: handleSubmit,
        onInputChange: onInputChange
    };

    const { isColumn, isRow } = useContext(ContainerContext);

    return (
        <div className={classnames('PropertyBookingForm', {
            'is-compact': isCompact,
            'is-not-column': !isColumn,
            'is-not-row': !isRow
        })}>
            <PropertyBookingFormContent {...formProps} willLocationDropdownOpenAbove={props.willLocationDropdownOpenAbove ?? true /* || isDropdownOpenAbove */} />
        </div>
    );
};

PropertyBookingForm.displayName = 'PropertyBookingForm';
PropertyBookingForm.defaultProps = {
    onSubmit: () => { }
};
