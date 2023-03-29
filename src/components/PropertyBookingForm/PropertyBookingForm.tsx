import './PropertyBookingForm.scss';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import classnames from 'classnames';
// import isEqual from 'fast-deep-equal';
import { PropertyBookingFormContent } from './PropertyBookingFormContent';

import type { PropertyBookingFormContentProps, PropertyBookingFormProps } from './PropertyBookingForm.props';
import { ContainerContext } from '../Container/ContainerContext';


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

    
    const handleSubmit = useCallback(() => { onSubmit?.(/* state */); }, [ onSubmit/* , state */ ]);


    const formProps: PropertyBookingFormContentProps = {
        ...props,
        willLocationDropdownOpenAbove: props.willLocationDropdownOpenAbove,
        onSubmit: handleSubmit,
        onInputChange: onChange
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
