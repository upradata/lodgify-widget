import React from 'react';
import { ResponsiveConainer, ResponsiveConainerProps } from '../Container';
import type { Omit } from '../../util.types';

export type FixedBarProps = Omit<ResponsiveConainerProps, 'isBarFixed'>;

export const FixedBar: React.FunctionComponent<FixedBarProps> = ({ children, ...props }) => {
    return (
        <ResponsiveConainer breakpoint={1300} {...props} isBarFixed>{children}</ResponsiveConainer>
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


FixedBar.displayName = 'FixedBar';
