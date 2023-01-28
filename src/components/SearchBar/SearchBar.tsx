import classnames from 'classnames';
import isEqual from 'fast-deep-equal';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Form from 'semantic-ui-react/dist/es/collections/Form/Form.js';
import { Button, DateRange, HorizontalGutters, LocationOptions, PropsWithStyle, VerticalGutters, SearchFieldsProps } from '@lodgify/ui';
import { ICON_NAMES } from '@lodgify/ui/lib/es/components/elements/Icon';
import { SearchFields } from '@lodgify/ui/lib/es/components/general-widgets/SearchBar/components/SearchFields';
import { getWillLocationDropdownOpenAbove } from '@lodgify/ui/lib/es/components/general-widgets/SearchBar/utils/getWillLocationDropdownOpenAbove';
import {
    CHECK_IN,
    CHECK_OUR_AVAILABILITY,
    CHECK_OUT,
    GUESTS,
    LOCATION,
    SEARCH
} from '@lodgify/ui/lib/es/utils/default-strings';
import { usePrevious } from '../../util';
import { BreakPoint } from '../MediaQuery/BreakPoint';
import './SearchBar.scss';
// import { SearchModal } from '@lodgify/ui/lib/es/components/general-widgets/SearchBar/components/SearchModal';
import { SearchModal } from './SearchModal';

export type SearchBarFields<Location extends string = string> = {
    dates: DateRange;
    guests: number;
    location: Location;
    // willLocationDropdownOpenAbove: boolean;
};

export type SearchBarProps<Location extends string = string> = PropsWithStyle<{
    className?: string;
    dateRangePickerLocaleCode?: string;
    datesCheckInLabel?: string;
    datesCheckOutLabel?: string;
    datesInputFocusedInput?: null | 'startDate' | 'endDate';
    datesInputOnFocusChange?: Function;
    datesInputValue?: DateRange;
    getIsDayBlocked?: Function;
    guestsInputValue?: number;
    isDateRangePickerLoading?: boolean;
    onChangeInput?: (data: SearchBarFields<Location>) => void | Promise<void>;
    onSubmit?: Function;
    searchBarDatesCheckInLabel?: string;
    searchBarDatesCheckOutLabel?: string;
    searchBarGuestsInputLabel?: string;
    searchBarMaximumGuestsInputValue?: number;
    searchButton?: React.ReactNode;
    guestsInputLabel?: string;
    guestsPopupId?: string;
    isCalendarIconDisplayed?: boolean;
    isFixed?: boolean;
    isStackable?: boolean;
    locationInputLabel?: string;
    locationInputValue?: string;
    locationOptions?: LocationOptions[];
    maximumGuestsInputValue?: number;
    isDisplayedAsModal?: boolean;
    isModalOpen?: boolean;
    modalHeadingText?: string;
    modalSummaryElement?: React.ReactNode;
    isModalFullScreen?: boolean;
    summaryElement?: React.ReactNode;
    willLocationDropdownOpenAbove?: boolean;
}>;


export const SearchBar: React.FunctionComponent<SearchBarProps> = props => {

    const [ state, setState ] = useState({
        dates: props.datesInputValue,
        guests: props.guestsInputValue,
        location: props.locationInputValue,
        // willLocationDropdownOpenAbove
    });

    const persistInputChange = useCallback((name: string, value: unknown) => {
        setState(prev => {
            const newState = { ...prev, [ name ]: value };
            /* console.log('persistInputChange-START');
            console.log(prev, { [ name ]: value }, newState);
            console.log('persistInputChange-END'); */
            props.onChangeInput?.(newState);
            return newState;
        });
    }, []);

    const handleSubmit = useCallback(() => { props.onSubmit?.(state); }, [ state ]);

    const contentProps: Omit<SearchBarContentProps, 'size'> = useMemo(() => ({
        datesInputValue: state.dates,
        guestsInputValue: state.guests,
        locationInputValue: state.location,
        ...props,
        willLocationDropdownOpenAbove: props.willLocationDropdownOpenAbove,
        onInputChange: persistInputChange,
        onSubmit: handleSubmit
    }), [ state, props ]);



    const previousProps = usePrevious(props);
    /* console.log(props); */
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

    if (props.isDisplayedAsModal) {
        return <SearchModal {...props}
            datesInputValue={state.dates}
            guestsInputValue={state.guests}
            locationInputValue={state.location}
            onInputChange={persistInputChange}
            onSubmit={handleSubmit}
            willLocationDropdownOpenAbove={props.willLocationDropdownOpenAbove}
            isFullscreen={props.isModalFullScreen} />;
    }

    if (!props.isFixed)
        return <SearchBarContent size="large" isFixed  {...contentProps} />;


    return <React.Fragment>
        {/* <div ref={ref} className={classnames(className, 'search-bar', 'is-fixed')}>
            <HorizontalGutters>
                {summaryElement}
                {makeForm(true)}
            </HorizontalGutters>
        </div>; */}
        {/* <BreakPoint max={20000}>
            <FixContent
                size="large"
                className={className}
                searchFields={{
                    datesInputValue: state.dates,
                    guestsInputValue: state.guests,
                    locationInputValue: state.location,
                    willLocationDropdownOpenAbove: true,
                    onInputChange: persistInputChange
                }}
                handleSubmit={handleSubmit}
                summaryElement={summaryElement}
                {...props}></FixContent>;
        </BreakPoint> */}
        <BreakPoint max={1200}>
            <SearchBarContent size="small" isFixed  {...contentProps} />
        </BreakPoint>

        <BreakPoint min={1201}>
            <SearchBarContent size="large" isFixed  {...contentProps} />
        </BreakPoint>
    </React.Fragment>;

    {/* <BreakPoints breakpoints={breakpoints} mode="range">
        <div ref={ref} className={classnames(className, 'search-bar', 'is-fixed')} >
            <HorizontalGutters>
                {summaryElement}
                {makeForm()}
            </HorizontalGutters>
        </div>
    </BreakPoints>; */}
};

type Size = 'small' | 'large';

type SearchBarContentProps = {
    size: Size;
    className?: string;
    summaryElement?: React.ReactNode;
    onSubmit: () => void;
    isFixed?: boolean;
    isStackable?: boolean;
} & SearchFieldsProps;


const Container: React.FunctionComponent<{ size: Size; }> = ({ size, children }) => {
    if (size === 'large')
        return <HorizontalGutters>{children}</HorizontalGutters>;

    return <VerticalGutters><HorizontalGutters>{children}</HorizontalGutters></VerticalGutters>;
};

const SearchBarContent: React.FunctionComponent<SearchBarContentProps> = props => {
    const { size, className, isFixed, isStackable, summaryElement, ...formProps } = props;

    /*  useEffect(() => {
       console.log('refffff2', ref.current);
       setRef(ref.current);
       // ref.current = ref2.current;
   }, [ ref.current ]); */

    return <div className={classnames(className, 'search-bar', { 'is-fixed': isFixed }, size, { 'is-stackable': isStackable ?? size === 'small' })}>
        <Container size={size}>
            {summaryElement}
            <SearchBarForm {...formProps} />
        </Container>
    </div>;
};

SearchBarContent.displayName = 'SearchBarForm';
SearchBarContent.defaultProps = {
    isFixed: false,
    className: ''
};

const SearchBarForm: React.FunctionComponent<SearchFieldsProps & { onSubmit: () => void; }> = ({ willLocationDropdownOpenAbove, onSubmit, ...props }) => {
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

    return <Form /* ref={ref}  */ onSubmit={onSubmit}>
        <SearchFields  {...props} willLocationDropdownOpenAbove={true /* || isDropdownOpenAbove */} />
    </Form>;
};

SearchBarForm.displayName = 'SearchBarForm';


SearchBar.displayName = 'SearchBar';
SearchBar.defaultProps = {
    className: null,
    dateRangePickerLocaleCode: undefined,
    datesCheckInLabel: CHECK_IN,
    datesCheckOutLabel: CHECK_OUT,
    datesInputFocusedInput: undefined,
    datesInputOnFocusChange: Function.prototype,
    datesInputValue: undefined,
    getIsDayBlocked: Function.prototype,
    guestsInputLabel: GUESTS,
    guestsInputValue: undefined,
    guestsPopupId: undefined,
    isCalendarIconDisplayed: undefined,
    isDateRangePickerLoading: undefined,
    isDisplayedAsModal: false,
    isFixed: false,
    isModalOpen: undefined,
    isModalFullScreen: true,
    isStackable: undefined,
    locationInputLabel: LOCATION,
    locationInputValue: undefined,
    locationOptions: null,
    maximumGuestsInputValue: undefined,
    modalHeadingText: CHECK_OUR_AVAILABILITY,
    modalSummaryElement: null,
    onChangeInput: Function.prototype as any,
    onSubmit: Function.prototype,
    searchButton: <Button icon={ICON_NAMES.SEARCH} isFormSubmit isRounded>SEARCH</Button>,
    summaryElement: null,
    willLocationDropdownOpenAbove: false
};
