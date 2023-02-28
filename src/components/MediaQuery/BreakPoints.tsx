import React, { memo, useCallback, useMemo } from 'react';
import { BreakPoint, BreakPointChildren, BreakPointProps } from './BreakPoint';


// type Children = React.ReactNode | React.ReactNode[];

export type BreakpointNb = number;
export type BreakpointRange<T = unknown> = { min?: number; max?: number; className?: string; data?: T; };
export type Breakpoint = BreakpointNb | BreakpointRange;

export type BreakPointsProps<P extends {} = {}, Data = unknown> = {
    mode?: 'min' | 'max' | 'range';
    breakpoints: Breakpoint[];
    onActive?: (breakpoint: BreakpointRange<Data>) => void;
    onInactive?: (breakpoint: BreakpointRange<Data>) => void;
    children?: BreakPointChildren<BreakpointRange<Data> & P>;
    childrenProps?: P;
    classNameBase?: string;
    // className?: (breakpoint: BreakpointRange) => string;
    destroyWhenNotMatched?: boolean;
};



const isRange = (bp: Breakpoint): bp is BreakpointRange => {
    return typeof bp === 'object';
};

const getClassName = (classNameBase: string, bp: BreakpointRange) => {
    return [ classNameBase, bp.min ? `min:${bp.min}` : '', bp.max ? `-max:${bp.max}` : '' ].filter(Boolean).join('-');
};

export const _BreakPoints: React.FunctionComponent<BreakPointsProps> = props => {
    const { mode, breakpoints, onActive, onInactive, classNameBase, children, ...breakpointProps } = props;

    const breakpointRanges: BreakpointRange[] = useMemo(() => {
        const getRange = (bpPrevious: Breakpoint, bp: number) => {
            if (props.mode === 'min')
                return { min: bp };

            if (props.mode === 'max')
                return { max: bp };

            const min = isRange(bpPrevious) ? bpPrevious.max ?? bpPrevious.min : bpPrevious;

            return { min: min + 1, max: bp };
        };

        return props.breakpoints.flatMap<BreakpointRange>((bp, i, list) => {
            if (isRange(bp))
                return bp;

            if (i === 0) {
                if (props.mode === 'range')
                    return { min: 0, max: bp };

                return props.mode === 'min' ? { min: bp } : { max: bp };
            }

            const range = getRange(list[ i - 1 ], bp);

            if (i === list.length - 1) {
                if (props.mode === 'range')
                    return [ range, { min: bp + 1 } ];

                return props.mode === 'min' ? { min: bp } : { max: bp };
            }

            return range;
        }).filter(Boolean);
    }, [ props.breakpoints, props.mode ]);


    return <React.Fragment>
        {breakpointRanges.map((breakpoint, i) => {
            const { className, ...bp } = breakpoint;

            return <BreakpointWrapper
                key={i}
                {...bp}
                {...breakpointProps}
                className={className || getClassName(classNameBase, bp)}
                breakpoint={breakpoint}
                onActive={onActive}
                onInactive={onInactive}
            >
                {/* {getChild(children as any, { ...bp })} */}
                {children}
                {/* typeof children === 'function' ? (parentProps: unknown) => {
                    console.log('CACA');
                    return children(bp, parentProps);
                } : children */}
            </BreakpointWrapper>;
        })}
    </React.Fragment>;
};


const _BreakpointWrapper: React.FunctionComponent<
    Omit<BreakPointProps, 'onActive' | 'onInactive'> &
    Pick<BreakPointsProps, 'onActive' | 'onInactive'> & {
        breakpoint: BreakpointRange;
    }> = ({
        children, breakpoint, onActive, onInactive, childrenProps: cProps, ...props
    }) => {

        const onActiveHandler = useCallback(() => onActive?.(breakpoint), [ onActive, breakpoint ]);
        const onInactiveHandler = useCallback(() => onInactive?.(breakpoint), [ onInactive, breakpoint ]);

        const { className, ...bp } = breakpoint;
        const childrenProps = useMemo(() => ({ ...bp, ...cProps }), [ bp, cProps ]);

        return <BreakPoint {...props}
            onActive={onActive ? onActiveHandler : undefined}
            onInactive={onInactive ? onInactiveHandler : undefined}
            childrenProps={childrenProps}>
            {/* {getChild(children as any, { ...bp })} */}
            {children}
            {/* typeof children === 'function' ? (parentProps: unknown) => {
                    console.log('CACA');
                    return children(bp, parentProps);
                } : children */}
        </BreakPoint>;
    };


_BreakpointWrapper.displayName = 'BreakpointWrapper';
const BreakpointWrapper = memo(_BreakpointWrapper);

_BreakPoints.displayName = 'BreakPoints';

_BreakPoints.defaultProps = {
    destroyWhenNotMatched: true,
    mode: 'range',
    classNameBase: 'breakpoint',
    childrenProps: {}
};

export const BreakPoints = memo(_BreakPoints);
