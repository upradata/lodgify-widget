import classnames from 'classnames';
import isEqual from 'fast-deep-equal';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Form from 'semantic-ui-react/dist/es/collections/Form/Form.js';
import { Button, DateRange, HorizontalGutters, LocationOptions, PropsWithStyle, ShowOn } from '@lodgify/ui';
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
// import { SearchModal } from '@lodgify/ui/lib/es/components/general-widgets/SearchBar/components/SearchModal';
import { SearchModal } from './SearchModal';


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
    onChangeInput?: (data: {
        dates: DateRange;
        guests: number;
        location: Location;
        willLocationDropdownOpenAbove: boolean;
    }) => void | Promise<void>;
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
    const {
        className,
        datesInputValue,
        guestsInputValue,
        isDisplayedAsModal,
        isFixed,
        isStackable,
        locationInputValue,
        onChangeInput,
        onSubmit,
        summaryElement,
        willLocationDropdownOpenAbove,
        isModalFullScreen
    } = props;

    const [ state, setState ] = useState({
        dates: datesInputValue,
        guests: guestsInputValue,
        location: locationInputValue,
        willLocationDropdownOpenAbove
    });

    const ref = useRef<HTMLDivElement>();

    const handleScroll = useCallback(() => {
        setState(prev => ({
            ...prev,
            willLocationDropdownOpenAbove: getWillLocationDropdownOpenAbove(ref.current, willLocationDropdownOpenAbove)
        }));
    }, [ ref.current, willLocationDropdownOpenAbove, setState ]);

    useEffect(() => {
        if (isDisplayedAsModal)
            return;

        global.document.addEventListener('scroll', handleScroll);

        handleScroll();

        return () => {
            if (isDisplayedAsModal)
                return;

            global.document.removeEventListener('scroll', handleScroll);
        };
    }, []);



    const persistInputChange = useCallback((name: string, value: unknown) => {
        setState(prev => {
            const newState = { ...prev, [ name ]: value };

            onChangeInput?.(newState);
            return newState;
        });
    }, [ setState ]);

    const handleSubmit = useCallback(() => onSubmit(state), [ state ]);

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

            if (!isEqual(previousInputValueProps, currentInputValueProps)) {
                setState(prev => ({ ...prev, currentInputValueProps }));
            }
        }
    }, [ props, previousProps ]);

    const makeForm = () => <Form onSubmit={handleSubmit}>
        <SearchFields {...props}
            datesInputValue={state.dates}
            guestsInputValue={state.guests}
            locationInputValue={state.location}
            onInputChange={persistInputChange}
            willLocationDropdownOpenAbove={state.willLocationDropdownOpenAbove}
        />
    </Form>;

    const makeSearchModal = () => <SearchModal {...props}
        datesInputValue={state.dates}
        guestsInputValue={state.guests}
        locationInputValue={state.location}
        onInputChange={persistInputChange}
        onSubmit={handleSubmit}
        willLocationDropdownOpenAbove={state.willLocationDropdownOpenAbove}
        isFullscreen={isModalFullScreen} />;


    if (isDisplayedAsModal) {
        return makeSearchModal();
    }

    return <div ref={ref} className={classnames(className, 'search-bar', {
        'is-fixed': isFixed,
        'is-stackable': isStackable
    })} >

        {isFixed ?
            <HorizontalGutters>
                {summaryElement}

                <ShowOn computer widescreen>
                    {makeForm()}
                </ShowOn>

                <ShowOn mobile tablet>
                    {makeSearchModal()}
                </ShowOn>
            </HorizontalGutters>
            : makeForm()
        }
    </div>;
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
    isStackable: false,
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
