
import isEqual from 'fast-deep-equal';
import React, { useCallback, useEffect, useState } from 'react';
// import Form from 'semantic-ui-react/dist/es/collections/Form/Form.js';
import { Button } from '@lodgify/ui';
// import { SearchFields } from '@lodgify/ui/lib/es/components/general-widgets/SearchBar/components/SearchFields';
import { usePrevious } from '../../util';
import { Form, FormProps } from '../Form';
import { ChangeInputData, InputDataNames, InputDataValues } from './PropertyBookingForm.type';
import { PropertyBookingFormContent, PropertyBookingFormContentProps } from './PropertyBookingFormContent';
import './PropertyBookingForm.scss';


// type InputDataValueOf<Name extends InputDataNames> = ChangeInputData[ Name ];
// export type PropertySearchDataValueOf<Name extends InputDataNames> = InputDataValueOf<Name>;



export type PropertyBookingFormProps = Omit<PropertyBookingFormContentProps, 'onInputChange'> & {
    onSubmit?: (data: ChangeInputData) => void;
    onInputChange?: (name: InputDataNames, value: InputDataValues, data: ChangeInputData) => void;
    searchButton?: FormProps[ 'searchButton' ];
};


export const PropertyBookingForm: React.FunctionComponent<PropertyBookingFormProps> = props => {
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


    const onInputChange = useCallback((name: InputDataNames, value: InputDataValues) => {
        setState(state => {
            const newState = { ...state, [ name ]: value };
            /* console.log('persistInputChange-START');
            console.log(prev, { [ name ]: value }, newState);
            console.log('persistInputChange-END'); */
            props.onInputChange?.(name, value, newState);
            return newState;
        });
    }, [ props.onInputChange, setState ]);


    const handleSubmit = () => { props.onSubmit?.(state); };


    const previousProps = usePrevious(props);

    useEffect(() => {
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

            /*  console.log('previous--current', 'START');
             console.log(previousInputValueProps, currentInputValueProps); */

            if (!isEqual(previousInputValueProps, currentInputValueProps)) {
                // console.log('CHANGED');
                setState(prev => ({ ...prev, ...currentInputValueProps }));
            }
            // console.log('previous--current', 'END');
        }
    }, [ props, previousProps ]);


    // const breakpoints = useMemo(() => [ { min: 0, max: 1300, className: 'small' }, { min: 1301, className: 'large' } ]/* [ 600, 800, 1000, 1200 ] */, []);
    const formProps: PropertyBookingFormContentProps = {
        datesInputValue: state.dates,
        guestsInputValue: state.guests,
        locationInputValue: state.location,
        ...props,
        willLocationDropdownOpenAbove: props.willLocationDropdownOpenAbove,
        onSubmit: handleSubmit,
        onInputChange: onInputChange
    };

    return (
        <div className="PropertyBookingForm">
            <PropertyBookingFormContent  {...formProps} willLocationDropdownOpenAbove={props.willLocationDropdownOpenAbove ?? true /* || isDropdownOpenAbove */} />
        </div>
    );
};

PropertyBookingForm.displayName = 'PropertyBookingForm';
PropertyBookingForm.defaultProps = {
    onSubmit: () => { }
};
