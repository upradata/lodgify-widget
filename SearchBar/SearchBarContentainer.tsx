import classnames from 'classnames';
import React from 'react';
import { HorizontalGutters, VerticalGutters } from '@lodgify/ui';


export type Size = 'small' | 'large';

export type SearchBarContentainerProps = {
    size: Size;
    className?: string;
    isFixed?: boolean;
    isStackable?: boolean;
};


const Container: React.FunctionComponent<{ size: Size; }> = ({ size, children }) => {
    if (size === 'large')
        return <HorizontalGutters>{children}</HorizontalGutters>;

    return <VerticalGutters><HorizontalGutters>{children}</HorizontalGutters></VerticalGutters>;
};


export const SearchBarContainer: React.FunctionComponent<SearchBarContentainerProps> = props => {
    const { size, className, isFixed, isStackable, children/*  ...formProps */ } = props;

    /*  useEffect(() => {
       console.log('refffff2', ref.current);
       setRef(ref.current);
       // ref.current = ref2.current;
   }, [ ref.current ]); */

    return <div className={classnames(className, 'search-bar', { 'is-fixed': isFixed }, size, { 'is-stackable': isStackable ?? size === 'small' })}>
        <Container size={size}>
            {children}
        </Container>
    </div>;
};

SearchBarContainer.displayName = 'SearchBarContent';
SearchBarContainer.defaultProps = {
    isFixed: false,
    className: ''
};
