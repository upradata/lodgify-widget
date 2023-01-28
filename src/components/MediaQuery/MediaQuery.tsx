import React, { useState } from 'react';
import classnames from 'classnames';
import { useEffect } from 'react';

type Children = React.ReactNode | React.ReactNode[];

export type BreakPoint<P = unknown> = {
    min?: number;
    max?: number;
    mediaQuery?: string;
    onActive?: () => void;
    onInactive?: () => void;
    children?: (parentProps?: P) => Children;
    parentProps?: P;
    className?: string;
};

export type MediaQueryProps<P = unknown> = {
    breakpoints: readonly BreakPoint[];
    onActive?: (bp?: BreakPoint<P>) => void;
    onInactive?: (bp?: BreakPoint<P>) => void;
    className?: string;
    parentProps?: P;
};

const makeCssMatchMedia = (bp: Pick<BreakPoint, 'min' | 'max'>) => {
    const min = bp.min ? `(min-width: ${bp.min}px)` : '';
    const max = bp.max ? `(max-width: ${bp.max}px)` : '';

    return [ 'only screen', min, max ].filter(Boolean).join(' and ');
};


const getClasses = (breakpoints: BreakPoint[]) => {
    return breakpoints.reduce((classNames, bp) => bp?.className ? ({ ...classNames, [ bp.className ]: true }) : classNames, {});
};

function getValues<O extends {}>(o: O): Array<O[ keyof O ]> {
    return Reflect.ownKeys(o).map(key => o[ key ]) as any;
}

export const MediaQuery: React.FunctionComponent<MediaQueryProps> = props => {
    const [ breakpoints, setBreakpoints ] = useState<{ [ MediaQuery: symbol ]: BreakPoint; }>({});

    useEffect(() => {
        // console.log('MEDIA CREATION');
        const mediaQueries = props.breakpoints.map(bp => {
            const mediaQueryCss = bp.mediaQuery || makeCssMatchMedia(bp);
            const mediaQuery = window.matchMedia(mediaQueryCss);
            const mediaQuerySymbol = Symbol('MediaQuery Symbol');

            const handleMatchMedia = (mql: Pick<MediaQueryList, 'matches' | 'media'>) => {
                if (mql.matches) {
                    setBreakpoints(prev => ({
                        ...prev,
                        [ mediaQuerySymbol ]: bp
                    }));

                    bp.onActive?.();
                    props.onActive?.(bp);
                } else {
                    setBreakpoints(prev => ({ ...prev, [ mediaQuerySymbol ]: undefined }));

                    bp.onInactive?.();
                    props.onInactive?.(bp);
                }
            };

            handleMatchMedia(mediaQuery);
            mediaQuery.addEventListener('change', handleMatchMedia);

            return { mediaQuery, handleMatchMedia };
        });

        return () => {
            mediaQueries.forEach(m => { m.mediaQuery.removeEventListener('change', m.handleMatchMedia); });
        };
    }, [ /* props.breakpoints, ...props.breakpoints */ ]);

    const activeBreakPoints = getValues(breakpoints).filter(Boolean);

    return <div className={classnames(props.className, getClasses(activeBreakPoints))}>
        {props.children}
        {activeBreakPoints.flatMap(bp => bp.children?.(bp.parentProps || props.parentProps))}
    </div>;
};;
