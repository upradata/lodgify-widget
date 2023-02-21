import classnames from 'classnames';
import React from 'react';
import { HorizontalGutters, VerticalGutters } from '@lodgify/ui';


export type Size = 'small' | 'large';

export type BarContentainerProps = PropsWithStyle<{
    size?: Size;
    isFixed?: boolean;
    isStackable?: boolean;
}>;


const Container: React.FunctionComponent<{ size: Size; }> = ({ size, children }) => {
    if (size === 'large')
        return <HorizontalGutters>{children}</HorizontalGutters>;

    return <VerticalGutters><HorizontalGutters>{children}</HorizontalGutters></VerticalGutters>;
};


export const BarContainer: React.FunctionComponent<BarContentainerProps> = props => {
    const { size, className, isFixed, isStackable, children/*  ...formProps */ } = props;

    /*  useEffect(() => {
       console.log('refffff2', ref.current);
       setRef(ref.current);
       // ref.current = ref2.current;
   }, [ ref.current ]); */

    return <div className={classnames(className, 'Bar', { 'is-fixed': isFixed }, size, { 'is-stackable': isStackable ?? size === 'small' })}>
        <Container size={size}>
            {children}
        </Container>
    </div>;
};

BarContainer.displayName = 'BarContainer';
BarContainer.defaultProps = {
    size: 'large',
    isFixed: false,
    className: ''
};
