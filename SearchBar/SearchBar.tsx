import isEqual from 'fast-deep-equal';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, DateRange } from '@lodgify/ui';
import { ICON_NAMES } from '@lodgify/ui/lib/es/components/elements/Icon';
// import { getWillLocationDropdownOpenAbove } from '@lodgify/ui/lib/es/components/general-widgets/SearchBar/utils/getWillLocationDropdownOpenAbove';
import {
    CHECK_IN,
    CHECK_OUR_AVAILABILITY,
    CHECK_OUT,
    GUESTS,
    LOCATION,
    SEARCH
} from '@lodgify/ui/lib/es/utils/default-strings';
import { fragments, usePrevious } from '../../util';
import { BreakPoint } from '../MediaQuery/BreakPoint';
import './SearchBar.scss';
import { SearchBarContainer, SearchBarContentainerProps } from './SearchBarContentainer';
import { PropertySearchForm, PropertySearchFormProps } from './SearchBarForm';
// import { SearchModal } from '@lodgify/ui/lib/es/components/general-widgets/SearchBar/components/SearchModal';
import { SearchModal, SearchModalProps } from './SearchModal';


class SearchBarContentProps extends PropertySearchFormProps {
    summaryElement?: React.ReactNode;
};


const SearchBarContent: React.FunctionComponent<SearchBarContentProps> = ({ summaryElement, ...formProps }) => {
    return (
        <React.Fragment>
            {summaryElement}
            <PropertySearchForm {...formProps} />;
        </React.Fragment>
    );
};

SearchBarContent.displayName = 'SearchBarContent';


export type ChangeInputData<Location extends string = string> = {
    dates: DateRange;
    guests: number;
    location: Location;
    // willLocationDropdownOpenAbove?: boolean;
};

export type SearchBarProps<Location extends string = string> =
    Omit<SearchBarContentainerProps, 'className'> &
    Omit<SearchBarContentProps, 'onInputChange' | 'onSubmit'> &
    Omit<SearchModalProps, 'onSubmit'> & {
        onChangeInput?: (data: ChangeInputData<Location>) => void | Promise<void>;
        onSubmit?: Function;
        isDisplayedAsModal?: boolean;
        isModalFullScreen?: boolean;
    };


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
    }, [ props.onChangeInput ]);

    const handleSubmit = useCallback(() => { props.onSubmit?.(state); }, [ state, props.onSubmit ]);


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
    const formProps: PropertySearchFormProps = {
        datesInputValue: state.dates,
        guestsInputValue: state.guests,
        locationInputValue: state.location,
        ...props,
        willLocationDropdownOpenAbove: props.willLocationDropdownOpenAbove,
        onInputChange: persistInputChange,
        onSubmit: handleSubmit
    };

    if (props.isDisplayedAsModal) {
        const [ searchModalProps ] = fragments(formProps, SearchModalProps) as [ SearchModalProps ];

        return <SearchModal {...searchModalProps}
            modalSummaryElement={searchModalProps.modalSummaryElement || props.summaryElement}
            isFullscreen={props.isModalFullScreen} />;
    }

    const [ contentProps ] /* : Omit<SearchBarContentProps, 'size'> */ = fragments(formProps, SearchBarContentProps);

    const content = <SearchBarContent {...contentProps} />;

    if (!props.isFixed)
        return <SearchBarContainer size={props.size || "large"} isFixed={false} isStackable={props.isStackable}>{content}</SearchBarContainer>;


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
            <SearchBarContainer size={props.size || "small"} isFixed isStackable={props.isStackable}>{content}</SearchBarContainer>
        </BreakPoint>

        <BreakPoint min={1201}>
            <SearchBarContainer size={props.size || "large"} isFixed isStackable={props.isStackable}>{content}</SearchBarContainer>
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
