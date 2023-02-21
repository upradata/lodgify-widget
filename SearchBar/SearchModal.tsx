import React, { useCallback, useState } from 'react';
import { Heading, HorizontalGutters, Modal } from '@lodgify/ui';
import { CHECK_OUR_AVAILABILITY } from '@lodgify/ui/lib/es/utils/default-strings';
import { PropertySearchForm, PropertySearchFormProps } from './SearchBarForm';




export class SearchModalProps extends PropertySearchFormProps {
    isModalOpen?: boolean;
    modalHeadingText?: string;
    modalSummaryElement?: React.ReactNode;
    searchButton?: React.ReactNode;
    isFullscreen?: boolean;
};


export const SearchModal: React.FunctionComponent<SearchModalProps> = props => {
    const [ formProps, { modalSummaryElement, modalHeadingText, isModalOpen, searchButton, isFullscreen } ] = partition(props, PropertySearchFormProps);

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
                <PropertySearchForm {...formProps} />
            </HorizontalGutters>
        </div>
    </Modal>;
};


SearchModal.displayName = 'SearchModal';

SearchModal.defaultProps = {
    modalSummaryElement: null,
    modalHeadingText: CHECK_OUR_AVAILABILITY,
    isModalOpen: false,
    searchButton: React.createElement("div", null),
    isFullscreen: true
};
