import './Container.scss';

import React, { useMemo } from 'react';
import { HorizontalGutters, VerticalGutters } from '@lodgify/ui';
import classnames from 'classnames';
import { ContainerContext, ContainerContextType } from './ContainerContext';


export type Direction = 'row' | 'column';

export type ContainerProps = PropsWithStyle<{
    direction?: Direction;
    isBarFixed?: boolean;
    isStackable?: boolean;
}>;


const _Container: React.FunctionComponent<{ direction: Direction; }> = ({ direction, children }) => {
    if (direction === 'row')
        return <HorizontalGutters>{children}</HorizontalGutters>;

    return <VerticalGutters><HorizontalGutters>{children}</HorizontalGutters></VerticalGutters>;
};


export const Container: React.FunctionComponent<ContainerProps> = props => {
    const { direction, className, isBarFixed, isStackable, children } = props;

    const context = useMemo<ContainerContextType>(() => ({
        isBarFixed,
        // isStackable: isStackable ?? direction === 'column',
        isRow: direction === 'row',
        isColumn: direction === 'column',
        isResponsive: !direction,
        direction
    }), [ isBarFixed, isStackable, direction ]);


    return (
        <ContainerContext.Provider value={context}>
            <div className={classnames(
                className,
                'Container',
                {
                    'is-bar-fixed': isBarFixed,
                    // 'is-stackable': context.isStackable,
                    'is-row': context.isRow,
                    'is-column': context.isColumn,
                    'is-responsive': context.isResponsive
                })}>
                <_Container direction={direction}>
                    {children}
                </_Container>
            </div>
        </ContainerContext.Provider>
    );
};



Container.displayName = 'Container';
Container.defaultProps = {
    isBarFixed: false,
    className: ''
};
