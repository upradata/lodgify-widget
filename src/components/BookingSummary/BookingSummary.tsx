// import 'semantic-ui-css/components/accordion.css';
import './BookingSummary.scss';

import React, { useCallback, useContext, useState } from 'react';
import {
    /* BlockPlaceholder,
    BlockPlaceholderProps, */
    Button,
    Checkbox,
    FlexContainer,
    Icon,
    TextInput,
    TextPlaceholder,
    TextPlaceholderProps
} from '@lodgify/ui';
import {
    Accordion,
    StrictAccordionTitleProps,
    Placeholder,
    PlaceholderLine,
    StrictPlaceholderLineProps,
    PlaceholderParagraph,
    StrictPlaceholderParagraphProps,
    PlaceholderProps,
    Table
} from 'semantic-ui-react';
import classnames from 'classnames';
import { BookingContext } from '../Booking/BookingContext';
import { Form, FormProps, InputField, RenderInputField } from '../Form';
import { localizedPrice, plural } from '../../util';
import { QuotePriceType } from '../../lodgify-requests';
import { ReservationQuote, ReservationQuoteRoomCategoryPrices, ReservationQuoteRoomPriceDetails } from '../Booking/reservation.type';


type _PlaceholderProps = Pick<PlaceholderProps, 'fluid' | 'inverted' | 'className'>;
type PlaceHolderProps = |
    { type: 'paragraph'; nbLines?: number; } & _PlaceholderProps & StrictPlaceholderParagraphProps /* StrictBlockPlaceholderProps */ |
    { type: 'line'; } & _PlaceholderProps & StrictPlaceholderLineProps /* TextPlaceholderProps */;


const PlaceHolder: React.FunctionComponent<PlaceHolderProps> = ({ fluid, inverted, className, type, ...props }) => {
    const placeholderProps = { fluid, inverted, className };

    type GetProps<T extends string> = PlaceHolderProps extends infer P ? P extends PlaceHolderProps ? P[ 'type' ] extends T ? P : never : never : never;

    const getProps = function <T extends string>(type: T): GetProps<T> {
        return props as any;
    };

    const getPlaceHolder = () => {
        if (type === 'line') {
            const props = getProps(type);
            return <PlaceholderLine {...props} style={{/*  height: 'unset', */ /* minWidth: '6ch' */ }} />;
        }


        if (type === 'paragraph') {
            const { nbLines = 1, ...props } = getProps(type);

            return <PlaceholderParagraph {...props} >
                {Array.from(Array(nbLines)).map(() => <PlaceholderLine /* style={{ minWidth: '6ch' }} */ />)}
            </PlaceholderParagraph>;

        }
    };

    return (
        <Placeholder {...placeholderProps}>{getPlaceHolder()}</Placeholder>
    );
};


type PlaceHolderProps2 = |
    { type: 'paragraph'; nbLines?: number; isRight?: boolean; } & TextPlaceholderProps /* BlockPlaceholderProps */ |
    { type: 'line'; isRight?: boolean; } & TextPlaceholderProps /* TextPlaceholderProps */;


const PlaceHolder2: React.FunctionComponent<PlaceHolderProps2> = ({ type, isRight, ...props }) => {

    type GetProps<T extends string> = PlaceHolderProps2 extends infer P ? P extends PlaceHolderProps2 ? P[ 'type' ] extends T ? P : never : never : never;

    const getProps = function <T extends string>(type: T): GetProps<T> {
        return props as any;
    };

    const className = classnames('PlaceHolder', { 'is-right': isRight });

    if (type === 'line') {
        const props = getProps(type);
        return <div className={className}><TextPlaceholder {...props} /></div>;
    }


    if (type === 'paragraph') {
        const { nbLines = 1, ...props } = getProps(type);
        return <>{Array.from(Array(nbLines)).map(() => <TextPlaceholder />)}</>;
    }

    return null;
};


/* type AddKeyPrefix<T, Prefix extends string> = T extends infer P ? P extends T ? // to get the distribution over an union A | B | C
        {[ K in `${Prefix}${Capitalize<keyof P & string>}` ]: K extends `${Prefix}${infer Key}` ? P[ Uncapitalize<Key> & keyof P ] : never } :
            never : never; */


type WithPlaceHolderProps = { isLoading: boolean; } & PlaceHolderProps2; /* PlaceHolderProps */ // AddKeyPrefix<PlaceHolderProps, 'placeholder'>;


const WithPlaceHolder: React.FunctionComponent<WithPlaceHolderProps> = ({ children, isLoading, ...props }) => {
    /* const placeholderProps = Object.fromEntries(
        Object.entries(props).map(([ k, v ]) => [
            // remove the placeholder prefix and lowercase first letter
            k.replace(/^placeholder(.)(.*)/, (_, g1: string, g2: string) => `${g1.toUpperCase()}${g2}`),
                v
                ])
                ) as PlaceHolderProps; */

    return (
        <React.Fragment>
            {isLoading ? <PlaceHolder2 {...props} /> : children}
        </React.Fragment>
    );
};


type CategoryItemsProps = { items: ReservationQuoteRoomCategoryPrices[ 'items' ]; isLoading: boolean; };

const CategoryItems: React.FunctionComponent<CategoryItemsProps> = ({ items, isLoading }) => {
    return (
        <React.Fragment>{
            items.map(({ price, description }, i) => (
                <Table.Row key={i}>
                    <Table.Cell><WithPlaceHolder type="line" length="long" isLoading={isLoading}>{description}</WithPlaceHolder></Table.Cell>
                    <Table.Cell textAlign="right">
                        {/* <WithPlaceHolder type="line" isRight length="short" isLoading={isLoading}>{localizedPrice(price)}</WithPlaceHolder> */}
                        {!isLoading && localizedPrice(price)}
                    </Table.Cell>
                </Table.Row>
            ))
        }</React.Fragment>
    );
};


type CategoryProps = Pick<ReservationQuoteRoomCategoryPrices, 'category' | 'subTotal'> &
{ index: number; as: React.ElementType; isLoading: boolean; } & CategoryItemsProps;


const Category: React.FunctionComponent<CategoryProps> = ({ isLoading, category, subTotal, index, items, as: As }) => {
    const [ state, setState ] = useState({ activeIndex: -1 });

    const onClick: AccordeonSegmentProps[ 'onClick' ] = useCallback(({ index }) => {
        const newIndex = state.activeIndex === index ? -1 : Number(index);
        setState({ activeIndex: newIndex });
    }, [ setState, state ]);

    const title = <FlexContainer justifyContent="space-between" alignItems="center">
        <span>{category}</span>
        <WithPlaceHolder type="line" length="short" isRight isLoading={isLoading}><span>{localizedPrice(subTotal)}</span></WithPlaceHolder>
    </FlexContainer>;

    return (
        <As title={title}
            index={index} activeIndex={state.activeIndex} onClick={onClick}>
            <Table compact /* padded */>
                {/* <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>Notes</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header> */}

                <Table.Body>
                    <CategoryItems items={items} isLoading={isLoading} />
                </Table.Body>
                {/* <Table.Footer>{subTotal}</Table.Footer> */}
            </Table>
        </As>
    );
};


/* type CategoriesProps = ReservationQuoteRoomPriceDetails;

const Categories: React.FunctionComponent<CategoriesProps> = ({categoriesPrices, subTotal}) => {
    return (
                            <div>
                                {categoriesPrices.map((category, i) => <Category {...category} index={i} key={i} />)}
                                <p>Subtotal: {subTotal}</p>
                            </div>
                            );
}; */


type RoomPriceDetailsProps = ReservationQuoteRoomPriceDetails & { isOnlyOneRoom: boolean; isLoading: boolean; };

const quotePriceTypeOrder = {
    [ QuotePriceType.RoomRate ]: 0,
    [ QuotePriceType.Fee ]: 1,
    [ QuotePriceType.Tax ]: 2,
    [ QuotePriceType.AddOn ]: 3,
    [ QuotePriceType.Other ]: 4,
    [ QuotePriceType.Promotion ]: 5
};

const RoomPriceDetails: React.FunctionComponent<RoomPriceDetailsProps> = ({ isLoading, nbGuests, roomValue, categoriesPrices = [], subTotal, isOnlyOneRoom }) => {
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
                        <Table.Cell textAlign="right">
                            <WithPlaceHolder type="line" isRight length="short" isLoading={isLoading}>{localizedPrice(roomRateCategory.subTotal)}</WithPlaceHolder>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>

            <div className="CategoriesPrices">
                <Accordion fluid styled>{
                    categories
                        .sort((c1, c2) => quotePriceTypeOrder[ c1.type ] - quotePriceTypeOrder[ c2.type ])
                        .map((categoryPrices, i) => <Category {...categoryPrices} as={AccordeonSegment} index={i} isLoading={isLoading} key={i} />)
                }</Accordion>
                {!isOnlyOneRoom && <div>
                    <span>Subtotal: </span>
                    <WithPlaceHolder type="line" length="full" isLoading={isLoading}>{localizedPrice(subTotal)}</WithPlaceHolder>
                </div>}
            </div>
        </div>
    );
};


type QuoteProps = ReservationQuote & { isLoading: boolean; };

const QuoteSummary: React.FunctionComponent<QuoteProps> = ({ roomsPriceDetails, isLoading, totalNet, totalGross, vat, isPricesIncludesVat }) => {
    const isOnlyOneRoom = roomsPriceDetails.length === 1;
    const isOnlyPropertyPrice = isOnlyOneRoom && roomsPriceDetails[ 0 ].categoriesPrices.length === 0 && roomsPriceDetails[ 0 ].categoriesPrices[ 0 ].isRoomRate;

    if (isOnlyPropertyPrice)
        return null;

    return (
        <div className="QuoteSummary">
            {roomsPriceDetails.map((roomPriceDetails, i) => <RoomPriceDetails {...roomPriceDetails} isOnlyOneRoom={isOnlyOneRoom} isLoading={isLoading} key={i} />)}
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


export type BookingSummaryProps = { onSubmit?: () => void; buttonText?: string; };



export const BookingSummary: React.FunctionComponent<BookingSummaryProps> = ({ onSubmit: handleSubmit, buttonText }) => {
    const { reservation, setReservation } = useContext(BookingContext);
    // const [ reservation, { onReservationChange } ] = partition(props, Reservation);

    /* return (
        <Tab panes={panes} menu={{ fluid: true, vertical: true, borderless: true, attached: false }} menuPosition='right' />
                                        ); */
    const { quote } = reservation;

    const [ formState, setFormState ] = useState({ hasCoupon: false, coupon: null as string });

    const onSubmit: FormProps<{}>[ 'onSubmit' ] = useCallback((values => {
        handleSubmit?.();
        // const data = Object.entries(values).reduce((o, [ k, v ]) => ({ ...o, [ k ]: v.value }), {} as FormValues);
        // handleSummit?.(data);
    }), [ /* handleSummit */ ]);


    const onInputChange = useCallback((name: string /* keyof FormValues */, value: string /* FormValues */) => {
        setFormState(state => ({ ...state, [ name ]: value }));
        // handleInputChange?.(name, value);
    }, [ setFormState ]);

    const onCouponApply = useCallback(() => {
        if (formState.coupon)
            setReservation({ type: 'change-input', promotionCode: formState.coupon });
    }, [ setReservation, formState.coupon ]);

    // const [ isLoading, setIsLoading ] = useState(reservation.isLoading);

    return (
        <div className="BookingSummary">

            {/* <PropertyBookingHeader roomName={room.name} startDate={reservation.startDate} endDate={reservation.endDate} />
            <PropertyBookingSubHeader price={quote?.totalGross} isLoading={reservation.isLoading} nbGuest={reservation.nbGuests} nbNights={reservation.nbOfNights} /> */}


            {/* <Button onClick={() => setIsLoading(!isLoading)}>Enable Loading</Button> */}

            <QuoteSummary {...quote} isLoading={/* isLoading */reservation.isLoading} />

            <Form submitButtonText={buttonText} /* validation={validation} */ onSubmit={onSubmit} onInputChange={onInputChange} className="BookingSummary__form">

                <Checkbox label={"Do you have any coupon?"} name="hasCoupon" />
                {formState.hasCoupon && <RenderInputField name="coupon">
                    {props => (
                        <FlexContainer alignItems="flex-start">
                            <InputField style={{ flexGrow: 1 }}><TextInput label="Coupon" {...props} /></InputField>
                            <Button isLoading={reservation.isLoading} onClick={onCouponApply}>Apply</Button>
                        </FlexContainer>
                    )}
                </RenderInputField>
                }
            </Form>
        </div>

    );
};

BookingSummary.defaultProps = {
    buttonText: "Proceed to payment"
};


{/* <Card */ }; /* {...cardProps} */
/* </Card> */
/* 
header={<PropertyBookingHeader roomName={room.name} startDate={reservation.startDate} endDate={reservation.endDate} />}
            subHeader={<PropertyBookingSubHeader price={quote?.totalGross} isLoading={reservation.isLoading}
                nbGuest={reservation.nbGuests} nbNights={reservation.nbOfNights} />
*/

/* export type BookingSummaryHeaderProps = {roomName: string; startDate: LodgifyDate; endDate: LodgifyDate; };

                                            export const BookingSummaryHeader: React.FunctionComponent<BookingSummaryHeaderProps> = ({roomName, startDate, endDate}) => {
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
    onClick: (accordeonTitleProps: StrictAccordionTitleProps) => void;
    title: string | React.ReactNode;
};

const AccordeonSegment: React.FunctionComponent<AccordeonSegmentProps> = ({ onClick, activeIndex, index, title, children }) => {

    const handleClick: StrictAccordionTitleProps[ 'onClick' ] = useCallback((_event, data) => onClick(data), [ onClick ]);

    return (
        <React.Fragment>
            <Accordion.Title active={activeIndex === index} index={index} onClick={handleClick}>
                <Icon name="caret right" size="small" />
                <div className="label">{title}</div>
            </Accordion.Title>

            <Accordion.Content active={activeIndex === index}>
                {children}
            </Accordion.Content>
        </React.Fragment>
    );
};
