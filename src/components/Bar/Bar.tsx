import React, { useCallback, useMemo, useState } from 'react';
import { BreakPoint, BreakpointRange, BreakPoints } from '../MediaQuery';
import { BarContainer, BarContentainerProps, Size } from './BarContentainer';
import './Bar.scss';


export type BarProps = BarContentainerProps;

export const Bar: React.FunctionComponent<BarProps> = ({ children, ...props }) => {
    type BP = BreakpointRange<{ size: Size; }>;
    const [ state, setState ] = useState<BP>(null);

    const breakpoints = useMemo(() => [ { max: 1200, data: { size: 'small' } }, { min: 1201, data: { size: 'large' } } ], []);

    return (
        <React.Fragment>
            {/* <BreakPoint max={4000}>
                <BarContainer size="large" {...props}>{children}</BarContainer>
            </BreakPoint> */}
            <BreakPoints breakpoints={breakpoints} onActive={bp => setState(bp as BP)} /* childrenProps={props} */>{
                state && <BarContainer size={state.data.size} {...props}>{children}</BarContainer>
                /* (bp: BreakpointRange<Data>) => {
                    return <BarContainer size={bp.data.size} {...props}>{children}</BarContainer>;
                } */
                /* BB */
            }</BreakPoints>

            {/*  <BarContainer size="large" {...props}>{children}</BarContainer> */}
        </React.Fragment>
    );
};

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
