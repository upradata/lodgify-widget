// import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/components/loader.css';
import './PropertyBookingBar.scss';

import React, { useCallback, useState } from 'react';
import { Summary } from '@lodgify/ui';
import { FixedBar } from '../FixedBar';
import { BookingProps } from '../Booking/BookingComponent';
import { PropertyBookingForm, usePropertyBookingFormProps } from '../PropertyBookingForm';
import { StepBooking } from '../StepBooking';
import { PropertyBookingFormProps } from '../PropertyBookingForm/PropertyBookingForm.props';

export const PropertyBooking: React.FunctionComponent<BookingProps> = ({ onSubmit }) => {

    // const [ propertyData, setPropertyData ] = useState<Partial<PropertySearchData[ 'data' ]>>({});
    // const [ details, setDetails ] = useState<Partial<BookingDetailsData>>({});

    // const [ state, setState ] = useState<Partial<PropertyBookingData>>({});

    const [ isBookingDetailsOpen, setIsBookingDetailsOpen ] = useState(false);

    const onSearchFormOnSubmit: PropertyBookingFormProps[ 'onSubmit' ] = useCallback(data => {
        // setState(state => ({ ...state, ...data }));
        setIsBookingDetailsOpen(true);
    }, [ setIsBookingDetailsOpen ]);


    // const onBookingDetailFormInputChange: BookingDetailsProps[ 'onInputChange' ] = useCallback((name, value) => {
    //     onReservationDetailsChange({ [ name ]: value });
    //     setDetails(state => ({ ...state, [ name ]: value }));
    // }, [ setDetails, onReservationDetailsChange ]);

    // const onBookingDetailsSubmit: BookingDetailsProps[ 'onSubmit' ] = useCallback(data => {
    //     setIsBookingDetailsOpen(false);
    //     onSubmit();
    //     // onSubmit(propertyData as PropertySearchData[ 'data' ], data/* details */ as BookingDetailsData);
    // }, [ setIsBookingDetailsOpen, onSubmit /*, propertyData , details */ ]);


    const { searchProps, summaryProps } = usePropertyBookingFormProps();

    // const [ isLoading, setIsLoading ] = useState(false);

    return (
        <div className="PropertyBookingBar">

            <FixedBar>
                {!isBookingDetailsOpen && <React.Fragment>
                    <Summary {...summaryProps} />
                    <PropertyBookingForm {...searchProps} isCompact onSubmit={onSearchFormOnSubmit} />
                </React.Fragment>
                }
            </FixedBar>

            {isBookingDetailsOpen && <StepBooking onClose={() => setIsBookingDetailsOpen(false)} />}
        </div>
    );
};

{/* <Modal dimmer="inverted" isOpen={isBookingDetailsOpen} onOpenChange={useCallback(isOpen => { setIsBookingDetailsOpen(isOpen); }, [])}>
     <Button onClick={() => setIsLoading(!isLoading)}>Enable Loading</Button> 

    <BookingDetails
        header={<PropertyBookingHeader roomName={room.name} startDate={reservation.startDate} endDate={reservation.endDate} />}
        subHeader={
            <PropertyBookingSubHeader price={reservation.quote?.totalGross} isLoading={reservation.isLoading}
                nbGuest={reservation.nbGuests} nbNights={reservation.nbOfNights} />
        }
        onInputChange={onBookingDetailFormInputChange}
        onSubmit={onBookingDetailsSubmit}
        {...details} />

    <BookingSummary onReservationChange={onReservationChange} {...reservation}></BookingSummary>
</Modal> */}
