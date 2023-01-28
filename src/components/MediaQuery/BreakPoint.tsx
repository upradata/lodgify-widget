import classnames from 'classnames';
import React, { useEffect, useState } from 'react';


type Children = React.ReactNode | React.ReactNode[];

export type BreakPointProps<P = unknown> = {
    min?: number;
    max?: number;
    breakpoints?: number[];
    mediaQuery?: string;
    onActive?: () => void;
    onInactive?: () => void;
    children?: Children | ((parentProps?: P) => Children);
    parentProps?: P;
    className?: string;
    destroyWhenNotMatched?: boolean;
};


const makeCssMatchMedia = (bp: Pick<BreakPointProps, 'min' | 'max'>) => {
    const min = bp.min ? `(min-width: ${bp.min}px)` : '';
    const max = bp.max ? `(max-width: ${bp.max}px)` : '';

    return [ 'only screen', min, max ].filter(Boolean).join(' and ');
};

export const BreakPoint: React.FunctionComponent<BreakPointProps> = props => {
    const [ isActive, setIsActive ] = useState(false);

    useEffect(() => {

        const mediaQueryCss = props.mediaQuery || makeCssMatchMedia(props);
        const mediaQuery = window.matchMedia(mediaQueryCss);

        const handleMatchMedia = (mql: Pick<MediaQueryList, 'matches' | 'media'>) => {
            if (mql.matches) {
                setIsActive(true);
                props.onActive?.();
            } else {
                setIsActive(false);
                props.onInactive?.();
            }
        };

        handleMatchMedia(mediaQuery);
        mediaQuery.addEventListener('change', handleMatchMedia);

        return () => {
            mediaQuery.removeEventListener('change', handleMatchMedia);
        };
    }, [ props ]);

    const children = props.destroyWhenNotMatched ? isActive && props.children : props.children;
    const Container = props.className ? ({ children }) => <div className={classnames({ [ props.className ]: isActive })}>{children}</div> : React.Fragment;

    return <Container /* className={classnames({ [ props.className ]: isActive })} */>
        {children && (typeof children === 'function' ? children(props.parentProps) : children)}
    </Container>;
};

BreakPoint.displayName = 'BreakPoint';

BreakPoint.defaultProps = {
    destroyWhenNotMatched: true,
};
