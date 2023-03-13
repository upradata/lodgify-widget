import React, { useCallback, useMemo, useState } from 'react';
import { Container, ContainerProps } from './Container';
import { BreakPoint, MediaQuery } from '../MediaQuery/MediaQuery';


export type ResponsiveConainerProps = ContainerProps & {
    breakpoint?: number;
};

export const ResponsiveConainer: React.FunctionComponent<ResponsiveConainerProps> = ({ children, breakpoint, ...props }) => {
    type BP = BreakPoint<never, { size: 'small' | 'large'; }>;
    const [ state, setState ] = useState<BP>(null);

    const breakpoints = useMemo(() => [ { max: breakpoint, size: 'small' }, { min: breakpoint + 1, size: 'large' } ], [ breakpoint ]);

    return (
        <MediaQuery breakpoints={breakpoints} onActive={useCallback(bp => setState(bp as BP), [ setState ])}>
            {state && <Container direction={state.size === 'small' ? 'column' : 'row'} {...props}>{children}</Container>}
        </MediaQuery>
    );
};


ResponsiveConainer.displayName = 'ResponsiveConainer';

ResponsiveConainer.defaultProps = {
    breakpoint: 1200
};
