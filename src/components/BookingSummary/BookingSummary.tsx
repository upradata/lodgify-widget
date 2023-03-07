// import 'semantic-ui-css/components/accordion.css';
import './BookingSummary.scss';

import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Icon, Checkbox, TextInput } from '@lodgify/ui';
import {
    Accordion,
    AccordionTitleProps,
    Label,
    Menu,
    Tab,
    Table,
    TabProps
} from 'semantic-ui-react';
import { BookingContext } from '../Booking/BookingContext';
import { Card } from '../Card';
import { CardProps } from '../Card/Card';
import { localizedPrice, partition, plural } from '../../util';
import { PropertyBookingHeader } from '../PropertyBooking/PropertyBookingHeader';
import { PropertyBookingSubHeader } from '../PropertyBooking/PropertyBookingSubHeader';
import { Reservation, ReservationQuote, ReservationQuoteRoomCategoryPrices, ReservationQuoteRoomPriceDetails } from '../Booking/reservation.type';
import { Form, FormProps } from '../Form';


type AAProps = CardProps & {

};

const AA: React.FunctionComponent<AAProps> = (props) => {
    const [ cardProps ] = partition(props, CardProps);

    return (
        <Card
            /*  header={<PropertyBookingHeader roomName={room.name} startDate={reservation.startDate} endDate={reservation.endDate} />}
             subHeader={<PropertyBookingSubHeader price={100} nbGuest={reservation.nbGuests} nbNights={reservation.nbOfNights} />} */
            {...cardProps}>


        </Card>
    );
};

const panes: TabProps[ 'panes' ] = [
    {
        menuItem: { key: 'users', icon: 'users', content: 'Users' },
        render: () => <Tab.Pane>Tab 1 Content</Tab.Pane>,
    },
    {
        menuItem: (
            <Menu.Item key='messages'>
                Messages<Label>15</Label>
            </Menu.Item>
        ),
        render: () => <Tab.Pane>Tab 2 Content</Tab.Pane>,
    },
];

type CategoryItemsProps = { items: ReservationQuoteRoomCategoryPrices[ 'items' ]; };

const CategoryItems: React.FunctionComponent<CategoryItemsProps> = ({ items }) => {
    return (
        <React.Fragment>{
            items.map(({ price, description }, i) => (
                <Table.Row key={i}>
                    <Table.Cell>{description}</Table.Cell>
                    <Table.Cell textAlign="right">{localizedPrice(price)}</Table.Cell>
                </Table.Row>
            ))
        }</React.Fragment>
    );
};


type CategoryProps = Pick<ReservationQuoteRoomCategoryPrices, 'category' | 'subTotal'> & { index: number; as: React.ElementType; } & CategoryItemsProps;

const Category: React.FunctionComponent<CategoryProps> = ({ category, subTotal, index, items, as: As }) => {
    const [ state, setState ] = useState({ activeIndex: -1 });

    const onClick: AccordeonSegmentProps[ 'onClick' ] = useCallback(({ index }) => {
        const newIndex = state.activeIndex === index ? -1 : Number(index);
        setState({ activeIndex: newIndex });
    }, [ setState, state ]);


    return (
        <As title={`${category}: ${localizedPrice(subTotal)}`} index={index} activeIndex={state.activeIndex} onClick={onClick} >
            <Table compact /* padded */>
                {/* <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>Notes</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header> */}

                <Table.Body>
                    <CategoryItems items={items} />
                </Table.Body>
                {/* <Table.Footer>{subTotal}</Table.Footer> */}
            </Table>
        </As>
    );
};


/* type CategoriesProps = ReservationQuoteRoomPriceDetails;

const Categories: React.FunctionComponent<CategoriesProps> = ({ categoriesPrices, subTotal }) => {
    return (
        <div>
            {categoriesPrices.map((category, i) => <Category {...category} index={i} key={i} />)}
            <p>Subtotal: {subTotal}</p>
        </div>
    );
}; */


type RoomPriceDetailsProps = ReservationQuoteRoomPriceDetails & { isOnlyOneRoom: boolean; };

const RoomPriceDetails: React.FunctionComponent<RoomPriceDetailsProps> = ({ nbGuests, roomValue, categoriesPrices, subTotal, isOnlyOneRoom }) => {
    const { getRoom } = useContext(BookingContext);

    const room = getRoom(roomValue);

    const roomRateCategory = categoriesPrices.find(p => p.isRoomRate);
    const categories = categoriesPrices.filter(p => !p.isRoomRate);

    if (isOnlyOneRoom && categories.length === 0)
        return null;

    return (
        <div className="RoomPriceDetails">
            <Table padded>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>{room.name} room : {nbGuests} {plural(nbGuests, 'person')}</Table.Cell>
                        <Table.Cell textAlign="right">{localizedPrice(roomRateCategory.subTotal)}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>

            <div className="CategoriesPrices">
                <Accordion fluid styled>
                    {categories.map((categoryPrices, i) => <Category {...categoryPrices} as={AccordeonSegment} index={i} key={i} />)}
                </Accordion>
                {!isOnlyOneRoom && <p>Subtotal: {subTotal}</p>}
            </div>
        </div>
    );
};


type QuoteProps = ReservationQuote;

const QuoteSummary: React.FunctionComponent<QuoteProps> = ({ roomsPriceDetails, totalNet, totalGross, vat, isPricesIncludesVat }) => {
    const isOnlyOneRoom = roomsPriceDetails.length === 1;
    const isOnlyPropertyPrice = isOnlyOneRoom && roomsPriceDetails[ 0 ].categoriesPrices.length === 0 && roomsPriceDetails[ 0 ].categoriesPrices[ 0 ].isRoomRate;

    if (isOnlyPropertyPrice)
        return null;

    return (
        <div className="QuoteSummary">
            {roomsPriceDetails.map((roomPriceDetails, i) => <RoomPriceDetails {...roomPriceDetails} isOnlyOneRoom={isOnlyOneRoom} key={i} />)}
            {/* <Table padded>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Net price</Table.HeaderCell>
                        <Table.HeaderCell>VAT ({vat}%)</Table.HeaderCell>
                        <Table.HeaderCell>Gross price</Table.HeaderCell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>{totalNet}</Table.Cell>
                        <Table.Cell>{totalGross - totalNet}</Table.Cell>
                        <Table.Cell>{totalGross}</Table.Cell>
                    </Table.Row>
                </Table.Header>
            </Table> */}

        </div>
    );
};


export type BookingSummaryProps = {

} & Reservation;


export const BookingSummary: React.FunctionComponent<BookingSummaryProps> = props => {
    const { getRoom, } = useContext(BookingContext);
    const [ reservation, rest ] = partition(props, Reservation);

    const room = getRoom(reservation.roomValue);

    /* return (
        <Tab panes={panes} menu={{ fluid: true, vertical: true, borderless: true, attached: false }} menuPosition='right' />
    ); */
    const { quote } = reservation;

    const [ formState, setFormState ] = useState({ hasCoupon: false });

    const onSubmit: FormProps<{}>[ 'onSubmit' ] = useCallback((values => {
        // const data = Object.entries(values).reduce((o, [ k, v ]) => ({ ...o, [ k ]: v.value }), {} as FormValues);
        // handleSummit?.(data);
    }), [ /* handleSummit */ ]);


    const onInputChange = useCallback((name: string /* keyof FormValues */, value: string /* FormValues */) => {
        setFormState(state => ({ ...state, [ name ]: value }));
        // handleInputChange?.(name, value);
    }, [ setFormState ]);

    const totalGross = reservation.quote.totalGross;

    return (
        <Card
            className="BookingSummary"
            header={<PropertyBookingHeader roomName={room.name} startDate={reservation.startDate} endDate={reservation.endDate} />}
            subHeader={<PropertyBookingSubHeader price={totalGross} nbGuest={reservation.nbGuests} nbNights={reservation.nbOfNights} />}
            /* {...cardProps} */>

            <QuoteSummary {...quote} />

            <Form submitButtonText={`Pay ${localizedPrice(totalGross)}`} /* validation={validation} */ onSubmit={onSubmit} onInputChange={onInputChange} >

                <Checkbox label={"Do you have any coupon?"} name="hasCoupon" />
                {formState.hasCoupon && <TextInput label="Coupon" name="coupon" />}
            </Form>
        </Card>
    );
};



/* export type BookingSummaryHeaderProps = { roomName: string; startDate: LodgifyDate; endDate: LodgifyDate; };

export const BookingSummaryHeader: React.FunctionComponent<BookingSummaryHeaderProps> = ({ roomName, startDate, endDate }) => {
    return (
        <div className="BookingHeader vertical-baseline">
            <span className="BookingHeader__location">{roomName}</span>

            <div className="BookingHeader__dates vertical-center">
                <span>{dateAsString(startDate)}</span>
                <Icon name="arrow right" />
                <span>{dateAsString(endDate)}</span>
            </div>
        </div>
    );
}; */

type AccordeonSegmentProps = {
    activeIndex: number;
    index: number;
    onClick: (accordeonTitleProps: AccordionTitleProps) => void;
    title: string;
};

const AccordeonSegment: React.FunctionComponent<AccordeonSegmentProps> = ({ onClick, activeIndex, index, title, children }) => {

    const handleClick: AccordionTitleProps[ 'onClick' ] = useCallback((_event, data) => onClick(data), [ onClick ]);

    return (
        <React.Fragment>
            <Accordion.Title active={activeIndex === index} index={index} onClick={handleClick}>
                <Icon name="caret right" size="small" />
                <span className="label">{title}</span>
            </Accordion.Title>

            <Accordion.Content active={activeIndex === index}>
                {children}
            </Accordion.Content>
        </React.Fragment>
    );
};
