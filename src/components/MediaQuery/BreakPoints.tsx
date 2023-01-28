import React, { useMemo } from 'react';
import { BreakPoint } from './BreakPoint';

type Children = React.ReactNode | React.ReactNode[];

export type BreakpointNb = number;
export type BreakpointRange = { min?: number; max?: number; className?: string; };
export type Breakpoint = BreakpointNb | BreakpointRange;

export type BreakPointsProps<P = unknown> = {
    mode?: 'min' | 'max' | 'range';
    breakpoints: Breakpoint[];
    onActive?: (breakpoint: BreakpointRange) => void;
    onInactive?: (breakpoint: BreakpointRange) => void;
    children?: Children | ((breakpoint?: BreakpointRange, parentProps?: P) => Children);
    parentProps?: P;
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

export const BreakPoints: React.FunctionComponent<BreakPointsProps> = props => {
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

            return <BreakPoint
                key={i}
                {...bp}
                {...breakpointProps}
                className={className || getClassName(classNameBase, bp)}
                onActive={onActive ? () => onActive(breakpoint) : undefined}
                onInactive={onInactive ? () => onInactive?.(breakpoint) : undefined}
            >
                {typeof children === 'function' ? (parentProps: unknown) => children(bp, parentProps) : children}
            </BreakPoint>;
        })}
    </React.Fragment>;
};

BreakPoints.displayName = 'BreakPoints';

BreakPoints.defaultProps = {
    destroyWhenNotMatched: true,
    mode: 'range',
    classNameBase: 'breakpoint'
};
