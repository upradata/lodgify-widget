import React from 'react';
import { ShowOn, Summary, SummaryProps/* , SearchBar */ } from '@lodgify/ui';
import { SearchBar, SearchBarProps } from '../SearchBar';
import './PropertySearchBar.scss';


export type RoomSearchProps = {
    summary: SummaryProps;
    search: SearchBarProps;
};


export const PropertySearchBar: React.FunctionComponent<RoomSearchProps> = props => {
    const SummaryElement = () => <Summary {...props.summary} />;

    return <div className="property-page-searchbar">
        {/* <ShowOn computer widescreen>
            <SearchBar {...props.search} summaryElement={props.search.summaryElement || SummaryElement()} />
        </ShowOn>

        <ShowOn tablet mobile>
            <SearchBar {...props.search}
                isModalFullScreen={false}
                summaryElement={props.search.summaryElement || SummaryElement()}
                modalSummaryElement={props.search.modalSummaryElement || SummaryElement()}
            />
        </ShowOn> */}
        <SearchBar {...props.search} summaryElement={props.search.summaryElement || SummaryElement()} />
    </div>;
};


PropertySearchBar.displayName = 'PropertySearchBar';
