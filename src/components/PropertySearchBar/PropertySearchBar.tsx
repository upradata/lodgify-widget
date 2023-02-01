import React from 'react';
import { /* ShowOn, */ Summary, SummaryProps } from '@lodgify/ui';
import { partition } from '../../util';
import type { Typify } from '../../util.types';
import { SearchBar, SearchBarProps } from '../SearchBar';
import './PropertySearchBar.scss';


/* export type RoomSearchProps = {
    summary: SummaryProps;
    search: SearchBarProps;
}; */

export type RoomSearchProps = SummaryProps & Typify<SearchBarProps>;

export const PropertySearchBar: React.FunctionComponent<RoomSearchProps> = props => {
    const [ searchBarProps, summaryProps ] = partition(props, SearchBarProps);

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
        <SearchBar {...searchBarProps} summaryElement={searchBarProps.summaryElement || <Summary {...summaryProps} />} />
    </div>;
};


PropertySearchBar.displayName = 'PropertySearchBar';
