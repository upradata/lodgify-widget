import React, { useCallback, useState } from 'react';
import Form from 'semantic-ui-react/dist/es/collections/Form/Form.js';
import { DateRange, Heading, HorizontalGutters, LocationOptions, Modal } from '@lodgify/ui';
import { SearchFields } from '@lodgify/ui/lib/es/components/general-widgets/SearchBar/components/SearchFields';
import { CHECK_OUR_AVAILABILITY } from '@lodgify/ui/lib/es/utils/default-strings';


export type SearchFieldsProps = {
    dateRangePickerLocaleCode?: string;
    datesCheckInLabel?: string;
    datesCheckOutLabel?: string;
    datesInputFocusedInput?: null | 'startDate' | 'endDate';
    datesInputOnFocusChange?: Function;
    datesInputValue?: DateRange;
    getIsDayBlocked?: Function;
    guestsInputValue?: number;
    isDateRangePickerLoading?: boolean;
    guestsInputLabel?: string;
    guestsPopupId?: string;
    isCalendarIconDisplayed?: boolean;
    locationInputLabel?: string;
    locationInputValue?: string;
    locationOptions?: LocationOptions[];
    maximumGuestsInputValue?: number;
    onInputChange?: Function;
    searchButton?: React.ReactNode;
    willLocationDropdownOpenAbove?: boolean;
};

export type SearchModalProps = {
    isModalOpen?: boolean;
    modalHeadingText?: string;
    modalSummaryElement?: React.ReactNode;
    onSubmit?: Function;
    searchButton?: React.ReactNode;
    isFullscreen?: boolean;
} & SearchFieldsProps;

export const SearchModal: React.FunctionComponent<SearchModalProps> = props => {
    const { modalSummaryElement, modalHeadingText, isModalOpen, searchButton, onSubmit, isFullscreen, ...searchFieldsProps } = props;

    const [ isOpen, setIsOpen ] = useState(isModalOpen);

    return <Modal
        hasPadding
        header={modalSummaryElement ? modalSummaryElement : <Heading size="small">{modalHeadingText}</Heading>}
        isFullscreen={isFullscreen}
        isOpen={isOpen}
        onClose={useCallback(() => { setIsOpen(false); }, [ setIsOpen ])}
        trigger={<div data-test-id="search-bar-search-modal-trigger" onClick={useCallback(() => { setIsOpen(true); }, [ setIsOpen ])}>{searchButton}</div>}
    >
        <div className="search-bar is-stackable">
            <HorizontalGutters>
                <Form onSubmit={onSubmit}>
                    <SearchFields {...searchFieldsProps} />
                </Form>
            </HorizontalGutters>
        </div>
    </Modal>;
};


SearchModal.displayName = 'SearchModal';

SearchModal.defaultProps = {
    modalSummaryElement: null,
    modalHeadingText: CHECK_OUR_AVAILABILITY,
    onSubmit: Function.prototype,
    isModalOpen: false,
    searchButton: React.createElement("div", null),
    isFullscreen: true
};
