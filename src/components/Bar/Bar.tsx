import './Bar.scss';

import React, { useCallback, useMemo, useState } from 'react';
import { BarContainer, BarContentainerProps, Size } from './BarContentainer';
import { BreakPoint, MediaQuery } from '../MediaQuery/MediaQuery';


export type BarProps = BarContentainerProps;

export const Bar: React.FunctionComponent<BarProps> = ({ children, ...props }) => {
    // type BP = BreakpointRange<{ size: Size; }>;
    type BP = BreakPoint<never, { size: Size; }>;
    const [ state, setState ] = useState<BP>(null);

    const breakpoints = useMemo(() => [ { max: 1200, size: 'small' }, { min: 1201, size: 'large' } ], []);

    return (
        <React.Fragment>
            {/* <BreakPoint max={4000}>
                <BarContainer size="large" {...props}>{children}</BarContainer>
            </BreakPoint> */}
            <MediaQuery breakpoints={breakpoints} onActive={useCallback(bp => setState(bp as BP), [ setState ])}>
                {state && <BarContainer size={state.size} {...props}>{children}</BarContainer>}
            </MediaQuery>
        </React.Fragment>
    );
};

/* childrenProps={props} */
{/* <BreakPoints breakpoints={breakpoints} onActive={useCallback(bp => setState(bp as BP), [ setState ])} >{
    state && <BarContainer size={state.data.size} {...props}>{children}</BarContainer>
}</BreakPoints>; */}

{/*  <BarContainer size="large" {...props}>{children}</BarContainer> */ }

/* (bp: BreakpointRange<Data>) => {
                   return <BarContainer size={bp.data.size} {...props}>{children}</BarContainer>;
               } */
/* BB */

// const B = children => ({ data, max, ...props }) => {
//     /*  debugger; */
//     return <BarContainer size={data.size} {...props}>{children}</BarContainer>;
// };


Bar.displayName = 'Bar';
Bar.defaultProps = {
    className: null,
    isFixed: false,
    isStackable: undefined,

};
