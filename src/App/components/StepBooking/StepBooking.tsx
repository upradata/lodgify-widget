import './StepBooking.scss';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, FlexContainer, Heading, Icon, IconProps, Summary } from '@lodgify/ui';
import { Card, CardContent, CardHeader, CardSubHeader, Container, Modal } from '@components';
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { wrapWith } from '@root/react-util';
import { CardDescription, Menu, StrictMenuItemProps as MenuItemProps, StrictTabProps as TabProps, Tab } from 'semantic-ui-react';
import classnames from 'classnames';
import { BookingBillingInfo } from '../BookingBillingInfo';
import { BookingContext } from '../Booking/BookingContext';
import { BookingReservation } from '../Booking/reservation.type';
import { BookingSummary } from '../BookingSummary';
import { helpers } from '../Booking/BookingReservation.action';
import { PropertyBookingForm, usePropertyBookingFormProps } from '../PropertyBookingForm';
import { StepBookingHeader } from './StepBookingHeader';
import { StepBookingSubHeader } from './StepBookingSubHeader';
import { stripe$, StripeCheckoutForm } from './StripeCheckoutForm';


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

const ReservationPayment: React.FunctionComponent<{}> = () => {
    const { reservation } = useContext(BookingContext);
    /* booking?.isBooked */
    const options: StripeElementsOptions = {
        // passing the client secret obtained from the server
        // clientSecret: '{{CLIENT_SECRET}}',
        mode: 'payment',
        amount: reservation.quote.totalGross * 100, // 10.99€
        currency: reservation.quote.currencyCode.toLowerCase(),
        fonts: [ { cssSrc: 'https://fonts.googleapis.com/css?family=Open+Sans' } ],
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#0570de',
                colorBackground: '#ffffff',
                colorText: '#30313d',
                colorDanger: '#df1b41',
                // colorSuccess:'#',
                // colorWarning:'#',
                fontFamily: 'Ideal Sans, system-ui, sans-serif',
                fontSizeBase: '1em',
                // spacingUnit: '2px',
                borderRadius: '8px',

                // See all possible variables below
            },
            rules: {
                '.Tab': {
                    border: '1px solid #E0E6EB',
                    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02)',
                },

                '.Tab:hover': {
                    color: 'var(--colorText)',
                },

                '.Tab--selected': {
                    borderColor: '#E0E6EB',
                    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02), 0 0 0 2px var(--colorPrimary)',
                },

                '.Input--invalid': {
                    boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.07), 0 0 0 2px var(--colorDanger)',
                },

                // See all supported class names and selector syntax below
            }
        }
    };

    return (
        <div className="BillingPayment">
            <Card fluid={true}>
                <div className="BillingPayment-status-card">
                    <Icon name="checkmark circle" size="large" className="success" />
                    <div className="BillingPayment-status-card__status">
                        <CardHeader size="small">Status: <span className="success">booked</span></CardHeader>
                        <CardSubHeader>The room has been booked</CardSubHeader>
                        <CardContent>
                            The dates have been reserved for the selected room.
                            To validate the booking, you must proceed to the payment with any available method at your disposal.
                        </CardContent>
                    </div>
                </div>
            </Card>

            {/* <p className="BillingPayment__description">
                The dates have been reserved for the selected room. To validate the booking, you must proceed to the payment with any available method at your disposal.
            </p> */}
            <div className="BillingPayment__methods">
                <Heading size="small">Payment methods</Heading>

                <Elements stripe={stripe$} options={options}>
                    <StripeCheckoutForm />
                </Elements>
            </div>
        </div>
    );
};


export type StepBookingProps = {
    onClose?: () => void;
};

export const StepBooking: React.FunctionComponent<StepBookingProps> = ({ onClose }) => {
    const { getRoom, reservation, setReservation, billingInfo } = useContext(BookingContext);

    const [ isModalOpen, setIsModalOpen ] = useState(true);

    const tabNames = [ 'booking', 'billing', 'confirmation', 'payment' ] as const;
    type TabNames = (typeof tabNames)[ number ];

    type TabsState = Record<TabNames, TabState>;

    const defaultActiveIndex = tabNames.findIndex(name => name === 'billing');
    const [ activeIndex, setActiveIndex ] = useState(defaultActiveIndex);

    const isValid = (name: TabNames) => {
        if (name === 'booking')
            return helpers.isReservationValid(reservation);

        if (name === 'billing' || name === 'confirmation' || name === 'payment')
            return helpers.isBillingInfoValid(billingInfo);

        return false;
    };

    const isEnabled = (name: TabNames, tabsState: TabsState) => {
        const index = tabNames.findIndex(tabName => tabName === name);

        const isValidPreviouses = (i = 0) => {
            if (i === index)
                return true;

            const tabState = tabsState[ tabNames[ i ] ];
            return tabState.isValid ? isValidPreviouses(i + 1) : false;
        };

        return index === 0 || isValidPreviouses();
    };

    const [ tabsState, _setTabsState ] = useState<TabsState>(() => Object.fromEntries(
        tabNames.map((name, i) => [ name, {
            isActive: i === defaultActiveIndex,
            isValid: isValid(name),
            isEnabled: isValid(name)
        } as TabState ])
    ) as TabsState);


    const setTabsState = (name: TabNames, value: Partial<TabState> | ((tabState: TabState, tabsState: TabsState) => Partial<TabState>)) => {
        _setTabsState(state => {
            const newState = tabNames.reduce<TabsState>((newState, tabName) => {
                const tabState = tabsState[ tabName ];
                const partialTabState = tabName === name ? (typeof value === 'function' ? value(tabState, state) : value) : {};
                // const isEnabled = Object.values(newState).every(s => s.isValid);

                return {
                    ...newState,
                    [ tabName ]: {
                        ...tabState,
                        isValid: isValid(tabName),
                        isEnabled: isEnabled(tabName, newState),
                        ...partialTabState
                    }
                };
            }, {} as TabsState);

            return newState;
        });
    };


    useEffect(() => { console.log(billingInfo); setTabsState('confirmation', {}); }, [ billingInfo ]);
    useEffect(() => { console.log(reservation); setTabsState('booking', {}); }, [ reservation ]);

    const { searchProps, summaryProps } = usePropertyBookingFormProps({ buttonText: 'Next' });

    const booking = reservation.bookings?.find(b => b.startDate === reservation.startDate && b.endDate === reservation.endDate);

    const panes = tabNames.map(name => {
        const handleTabState = () => {
            setTabsState(name, { isValid: true });

            if (tabNames.at(-1) !== name) {
                // next tab with isValid state = false
                const activeIndex = tabNames.findIndex(n => name !== n && !tabsState[ n ].isValid);
                setActiveIndex(activeIndex !== -1 ? activeIndex : tabNames.length - 1);
            }

            if (name === 'confirmation')
                setReservation({ type: 'create-booking', billingInfo });

        };


        if (name === 'booking') {
            const searchButton = <Button isFormSubmit isRounded>Next</Button>;

            return {
                name,
                menuItem: (
                    <StepBookingMenuItem name={name} iconName="further info" tabState={tabsState[ name ]} title="Booking" description="Choose the room(s)" />
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

        if (name === 'billing') {
            return {
                name,
                menuItem: (
                    <StepBookingMenuItem name={name} iconName="further info" tabState={tabsState[ name ]} title="Billing" description="Enter billing information" />
                ),
                render: () => <Tab.Pane>
                    <TabContentHeader />

                    <TabContent>
                        <BookingBillingInfo onSubmit={handleTabState} buttonText="Next" />
                    </TabContent>
                </Tab.Pane>
            };
        }

        if (name === 'confirmation') {
            return {
                name,
                menuItem: <StepBookingMenuItem name={name} iconName="credit card" tabState={tabsState[ name ]} title="Confirm Order" description="Reservation summary" />,
                render: () => <Tab.Pane>
                    <TabContentHeader />

                    <TabContent>
                        <BookingSummary onSubmit={handleTabState} buttonText="Proceed to payment" />
                    </TabContent>
                </Tab.Pane>
            };
        }

        if (name === 'payment') {
            return {
                name,
                menuItem: <StepBookingMenuItem name={name} iconName="credit card" tabState={tabsState[ name ]} title="Payment" description="Reservation payment" />,
                render: () => <Tab.Pane>
                    <TabContentHeader />

                    <TabContent>
                        <ReservationPayment />
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
