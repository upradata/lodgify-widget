import React, { memo, useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';


type ChildrenNode = React.ReactNode | React.ReactNode[];
export type BreakPointChildren<P extends {} = {}> = ChildrenNode | React.ElementType | ((childrenProps: P) => ChildrenNode);

export type BreakPointProps<P extends {} = {}> = {
    min?: number;
    max?: number;
    mediaQuery?: string;
    onActive?: () => void;
    onInactive?: () => void;
    children?: BreakPointChildren<P>;
    childrenProps?: P;
    className?: string;
    destroyWhenNotMatched?: boolean;
};


const makeCssMatchMedia = (bp: Pick<BreakPointProps, 'min' | 'max'>) => {
    const min = bp.min ? `(min-width: ${bp.min}px)` : '';
    const max = bp.max ? `(max-width: ${bp.max}px)` : '';

    return [ 'only screen', min, max ].filter(Boolean).join(' and ');
};

export const getChild = (children: BreakPointChildren, props: any) => {

    if (!children)
        return children;

    if (typeof children === 'function') {
        try {
            const Child = children as React.ElementType;
            return <Child {...props} />;
        } catch {
            const child = children as ((props: any) => React.ReactNode);
            return child(props);
        }
    }

    return children;
};

const _BreakPoint: React.FunctionComponent<BreakPointProps> = props => {
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
    }, [ props.onActive, props.onInactive, setIsActive ]);


    const children = props.destroyWhenNotMatched ? isActive && props.children : props.children;
    const child = useMemo(() => getChild(children, props.childrenProps), [ children, props.childrenProps ]);


    return <Container className={props.className} isActive={isActive}>
        {
            /* children && (typeof children === 'function' ?  children(props.parentProps) : children) */
            child
        }
    </Container>;
};

const Container: React.FunctionComponent<{ className: string; isActive: boolean; }> = ({ className, isActive, children }) => {
    return className ? <div className={classnames({ [ className ]: isActive })}>{children}</div> : <React.Fragment>{children}</React.Fragment>;
};

_BreakPoint.displayName = 'BreakPoint';

_BreakPoint.defaultProps = {
    destroyWhenNotMatched: true,
    childrenProps: {}
};

export const BreakPoint = memo(_BreakPoint);
