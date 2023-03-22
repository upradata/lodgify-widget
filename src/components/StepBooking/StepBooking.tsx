import './StepBooking.scss';

import React, { useCallback, useContext, useState } from 'react';
import { Button, Icon, IconProps, Summary } from '@lodgify/ui';
import classnames from 'classnames';
import { Menu, StrictMenuItemProps as MenuItemProps, Tab, StrictTabProps as TabProps } from 'semantic-ui-react';
import { BookingBillingInfo } from '../BookingBillingInfo';
import { BookingContext } from '../Booking/BookingContext';
import { BookingSummary } from '../BookingSummary';
import { Modal } from '../Modal';
import { PropertyBookingForm, usePropertyBookingFormProps } from '../PropertyBookingForm';
import { Container } from '../Container';
import { StepBookingHeader } from './StepBookingHeader';
import { StepBookingSubHeader } from './StepBookingSubHeader';
import { wrapWith } from '../../react-util';


const TabHeader = wrapWith({ props: { className: 'TabHeader' } });
const TabSubHeader = wrapWith({ props: { className: 'TabSubHeader' } });
const TabContent = wrapWith({ props: { className: 'TabContent' } });


type TabState = { isValid: boolean; isActive: boolean; isEnabled: boolean; };

type StepBookingMenuItemProps = {
    iconName: IconProps[ 'name' ];
    tabState: TabState;
    title?: string;
    description?: string;
} & MenuItemProps;


export const StepBookingMenuItem: React.FunctionComponent<StepBookingMenuItemProps> = ({ children, tabState, iconName, title, description, ...props }) => {
    return (
        <Menu.Item key={props.name} {...props} className={classnames({ 'is-valid': tabState.isValid })} disabled={!tabState.isEnabled}>
            <Icon name={tabState.isValid ? 'checkmark' : iconName} />

            {(title || description) && <div className="MenuItemTitle">
                {title && <h4 className="MenuItemTitle__header">{title}</h4>}
                {description && <span className="MenuItemTitle__description">{description}</span>}
            </div>}

            {children}
        </Menu.Item>
    );
};


const TabContentHeader: React.FunctionComponent<{}> = () => {
    const { getRoom, reservation } = useContext(BookingContext);
    const room = getRoom(reservation.roomValue);

    return (
        <div className="TabContentHeader">
            <TabHeader>
                <StepBookingHeader roomName={room.name} startDate={reservation.startDate} endDate={reservation.endDate} />
            </TabHeader>
            <TabSubHeader>
                <StepBookingSubHeader loaderInverted price={reservation.quote?.totalGross} isLoading={reservation.isLoading}
                    nbGuest={reservation.nbGuests} nbNights={reservation.nbOfNights} />
            </TabSubHeader>
        </div>
    );
};

export type StepBookingProps = {
    onClose?: () => void;
};

export const StepBooking: React.FunctionComponent<StepBookingProps> = ({ onClose }) => {
    const { getRoom, reservation, setReservation, billingInfo } = useContext(BookingContext);

    const [ isModalOpen, setIsModalOpen ] = useState(true);

    const tabNames = [ 'booking', 'info', 'billing' ] as const;
    type TabNames = (typeof tabNames)[ number ];

    type TabsState = Record<TabNames, TabState>;

    const defaultActiveIndex = tabNames.findIndex(name => name === 'info');
    const [ activeIndex, setActiveIndex ] = useState(defaultActiveIndex);


    const [ tabStates, _setTabsState ] = useState<TabsState>(Object.fromEntries(
        tabNames.map((name, i) => [ name, { isActive: i === defaultActiveIndex, isValid: name === 'booking', isEnabled: name !== 'billing' } as TabState ])
    ) as TabsState);

    const isBillingTabEnabled = (tabsState: TabsState) => {
        return Object.entries(tabsState).filter(([ name ]) => (name as TabNames) !== 'billing').every(([ , { isValid } ]) => isValid);
    };

    const setTabsState = (name: TabNames, value: Partial<TabState>) => {
        _setTabsState(state => {
            const newState = { ...state, [ name ]: { ...state[ name ], ...value } };

            if (name !== 'billing')
                newState.billing.isEnabled = isBillingTabEnabled(newState);

            return newState;
        });
    };
    /* const [ activeIndex, setActiveIndex ] = useState(0); */
    // const onBookingDetailFormInputChange: BookingDetailsProps[ 'onInputChange' ] = useCallback((name, value) => {
    //     onReservationDetailsChange({ [ name ]: value });
    //     setDetails(state => ({ ...state, [ name ]: value }));
    // }, [ setDetails, onReservationDetailsChange ]);

    // const onBookingDetailsSubmit: BookingDetailsProps[ 'onSubmit' ] = useCallback(data => {
    //     setIsBookingDetailsOpen(false);
    //     onSubmit();
    //     // onSubmit(propertyData as PropertySearchData[ 'data' ], data/* details */ as BookingDetailsData);
    // }, [ setIsBookingDetailsOpen, onSubmit /*, propertyData , details */ ]);

    // const onBookingDetailsSubmit: BookingDetailsProps[ 'onSubmit' ] = useCallback(data => { }, []);

    const { searchProps, summaryProps } = usePropertyBookingFormProps({ buttonText: 'Next' });

    const panes = tabNames.map(name => {
        const handleTabState = () => {
            setTabsState(name, { isValid: true });

            if (tabNames[ tabNames.length - 1 ] !== name) {
                const activeIndex = tabNames.findIndex(n => name !== n && !tabStates[ n ].isValid);
                setActiveIndex(activeIndex !== -1 ? activeIndex : tabNames.length - 1);
            }
        };

        const onSubmit = () => {
            handleTabState();

            setReservation({ type: 'create-booking', billingInfo });
        };

        if (name === 'booking') {
            const searchButton = <Button isFormSubmit isRounded>Next</Button>;

            return {
                name,
                menuItem: (
                    <StepBookingMenuItem name={name} iconName="further info" tabState={tabStates[ name ]} title="Booking" description="Choose the room(s)" />
                ),
                render: () => <Tab.Pane>
                    <TabContentHeader />

                    <TabContent>
                        <Container direction="column">
                            <Summary {...summaryProps} propertyName="" />
                            <PropertyBookingForm {...searchProps} searchButton={searchButton} onSubmit={handleTabState} />
                        </Container>
                    </TabContent>
                </Tab.Pane>
            };
        }

        if (name === 'info') {
            return {
                name,
                menuItem: (
                    <StepBookingMenuItem name={name} iconName="further info" tabState={tabStates[ name ]} title="Billing" description="Enter billing information" />
                ),
                render: () => <Tab.Pane>
                    <TabContentHeader />

                    <TabContent>
                        <BookingBillingInfo onSubmit={handleTabState} buttonText="Next" />
                    </TabContent>
                </Tab.Pane>
            };
        }

        if (name === 'billing') {
            return {
                name,
                menuItem: <StepBookingMenuItem name={name} iconName="credit card" tabState={tabStates[ name ]} title="Confirm Order" description="Payment summary" />,
                render: () => <Tab.Pane>
                    <TabContentHeader />

                    <TabContent>
                        <BookingSummary onSubmit={onSubmit} buttonText="Proceed to payment" />
                    </TabContent>
                </Tab.Pane>
            };
        }
    }) satisfies (TabProps[ 'panes' ][ number ] & { name: string; })[];


    return (
        <Modal dimmer="inverted" size="fullscreen" /* header={"Some Header"} */ isOpen={isModalOpen} onClose={onClose} onOpenChange={useCallback(isOpen => { setIsModalOpen(isOpen); }, [])} >
            <Tab className="StepBooking" menu={{ /* borderless: true, */ attached: false, tabular: false }} activeIndex={activeIndex} /* defaultActiveIndex={defaultActiveIndex} */
                panes={panes} onTabChange={(_, data) => {
                    panes.forEach(({ name }, i) => {
                        setTabsState(name, { isActive: i === data.activeIndex });
                        setActiveIndex(Number(data.activeIndex));
                    });
                }} />
            {/* <Button onClick={() => setIsLoading(!isLoading)}>Enable Loading</Button> */}
        </Modal>

    );
};
